"""
AI language teacher voice agent.

Transport : Stream Edge (getstream)
LLM       : OpenAI Realtime (speech-to-speech, no separate STT/TTS needed)
Language  : always speaks English, teaches the student's target language

Run locally (development):
    uv run agent.py run

Serve as HTTP API (production):
    uv run agent.py serve --host 0.0.0.0 --port 8000

Session start payload (sent by the Expo app via /api/agent-session):
    call_type        : "audio_room"
    lesson_title     : e.g. "Greetings & Basics"
    language_name    : e.g. "Spanish"
    lesson_goals     : list of goal strings
    lesson_vocabulary: list of {word, translation} dicts
    lesson_phrases   : list of {phrase, translation} dicts
    teacher_system_prompt : custom system prompt from lesson config
    teacher_name     : e.g. "Sofía"
    teacher_persona  : persona description

The call_id from the Expo app follows the convention:
    lesson-{lessonId}   e.g.  lesson-es-l1  or  lesson-fr-l2
"""

import logging
import os
from typing import Any

from dotenv import load_dotenv

from vision_agents.core import Agent, AgentLauncher, Runner, User
from vision_agents.core.agents.events import UserTranscriptEvent
from vision_agents.plugins import getstream

load_dotenv()

# Select LLM backend via AGENT_LLM_PROVIDER env var.
# Defaults to "gemini" when GOOGLE_API_KEY is set, otherwise "openai".
# Set AGENT_LLM_PROVIDER=openai to force OpenAI Realtime (requires quota).
_llm_provider = os.getenv("AGENT_LLM_PROVIDER", "").lower()
if not _llm_provider:
    _llm_provider = "gemini" if os.getenv("GOOGLE_API_KEY") else "openai"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

# Fallback language map when language_name is not passed in kwargs
LANGUAGE_NAMES: dict[str, str] = {
    "es": "Spanish",
    "fr": "French",
    "ja": "Japanese",
    "ko": "Korean",
    "de": "German",
    "zh": "Chinese (Mandarin)",
    "pt": "Portuguese",
    "it": "Italian",
    "ru": "Russian",
    "ar": "Arabic",
}

BASE_TEACHER_INSTRUCTIONS = """\
You are {teacher_name}, a warm and energetic AI language teacher.
You always speak English and teach {language} through English.

{persona_block}
Conversation rules — follow these strictly:
- This is a real-time voice conversation. After every single thing you say, STOP completely and wait for the student to respond. Do NOT keep talking.
- Say ONE thing at a time — one word introduction, one question, one correction — never more than two short sentences per turn.
- Use contractions and natural, friendly language (I'm, you're, let's, that's). Sound like a real person, not a textbook.
- Introduce {language} words one at a time: say the word, give its English meaning, add a simple pronunciation hint, then ask the student to try saying it — then STOP and listen.
- When the student responds, react to exactly what they said: if correct, celebrate briefly and move to the next word; if wrong, gently correct and ask them to try again.
- Stay strictly within this lesson's vocabulary and goals. Do not introduce unrelated topics or switch to other languages.
- Never use markdown, bullet points, numbered lists, or special symbols in your speech.
- Never list multiple words or phrases in a single turn. One item at a time, always.

{lesson_block}
"""


def _language_from_call_id(call_id: str) -> str:
    """
    Extract language name from a call_id when language_name is not available.
    Expected: lesson-es-l1 → "Spanish"
    """
    parts = call_id.split("-")
    lang_code = parts[1] if len(parts) >= 2 else "es"
    return LANGUAGE_NAMES.get(lang_code, "Spanish")


def _build_instructions(
    *,
    language: str,
    teacher_name: str,
    teacher_persona: str,
    lesson_title: str,
    lesson_goals: list[str],
    lesson_vocabulary: list[dict[str, str]],
    lesson_phrases: list[dict[str, str]],
    teacher_system_prompt: str,
) -> str:
    """Build a rich system instruction string from lesson data."""

    persona_block = (
        f"Your persona: {teacher_persona}\n\n" if teacher_persona.strip() else ""
    )

    lesson_parts: list[str] = []
    if lesson_title:
        lesson_parts.append(f"Today's lesson: {lesson_title}")
    if lesson_goals:
        goals_str = "; ".join(lesson_goals)
        lesson_parts.append(f"Lesson goals: {goals_str}")
    if lesson_vocabulary:
        vocab_str = ", ".join(
            f"{v['word']} ({v['translation']})"
            for v in lesson_vocabulary[:10]
        )
        lesson_parts.append(
            f"Lesson vocabulary (your private reference — introduce ONE item per turn, "
            f"never list them all at once): {vocab_str}"
        )
    if lesson_phrases:
        phrases_str = ", ".join(
            f"'{p['phrase']}' ({p['translation']})"
            for p in lesson_phrases[:6]
        )
        lesson_parts.append(
            f"Lesson phrases (your private reference — introduce ONE phrase per turn, "
            f"never list them all at once): {phrases_str}"
        )

    lesson_block = "\n".join(lesson_parts)
    if teacher_system_prompt.strip():
        lesson_block = f"{lesson_block}\n\nAdditional teaching guidance: {teacher_system_prompt}"

    return BASE_TEACHER_INSTRUCTIONS.format(
        teacher_name=teacher_name,
        language=language,
        persona_block=persona_block,
        lesson_block=lesson_block,
    )


def _opening_prompt(
    *,
    language: str,
    teacher_name: str,
    lesson_title: str,
    lesson_goals: list[str],
) -> str:
    """Build the opening prompt that primes the LLM for this specific lesson."""
    goals_summary = (
        f"The lesson goals are: {'; '.join(lesson_goals)}. "
        if lesson_goals
        else ""
    )
    return (
        f"Start the lesson now. Greet the student warmly as {teacher_name} their {language} teacher "
        f"and in one sentence say you'll be practising '{lesson_title}' together. "
        f"Then ask them ONE simple yes-or-no question to check they're ready — for example 'Ready to get started?'. "
        f"Say nothing else. Stop after the question and wait for their answer."
    )


def _make_llm():
    """Return the configured LLM plugin based on AGENT_LLM_PROVIDER."""
    if _llm_provider == "gemini":
        from vision_agents.plugins import gemini as va_gemini  # noqa: PLC0415
        logging.getLogger(__name__).info("Using Gemini Realtime LLM")
        return va_gemini.Realtime()
    else:
        from vision_agents.plugins import openai as va_openai  # noqa: PLC0415
        logging.getLogger(__name__).info("Using OpenAI Realtime LLM (gpt-realtime-2)")
        return va_openai.Realtime(model="gpt-realtime-2", voice="sage")


async def create_agent(**kwargs: Any) -> Agent:  # noqa: ANN401
    """
    Factory function called by AgentLauncher once per session.

    We build the instructions with whatever data is available; if lesson
    kwargs are missing we fall back to a generic persona.
    """
    language = kwargs.get("language_name") or "Spanish"
    teacher_name = kwargs.get("teacher_name") or "Lumi"
    teacher_persona = kwargs.get("teacher_persona") or ""
    lesson_title = kwargs.get("lesson_title") or "Language Lesson"
    lesson_goals = kwargs.get("lesson_goals") or []
    lesson_vocabulary = kwargs.get("lesson_vocabulary") or []
    lesson_phrases = kwargs.get("lesson_phrases") or []
    teacher_system_prompt = kwargs.get("teacher_system_prompt") or ""

    instructions = _build_instructions(
        language=language,
        teacher_name=teacher_name,
        teacher_persona=teacher_persona,
        lesson_title=lesson_title,
        lesson_goals=lesson_goals,
        lesson_vocabulary=lesson_vocabulary,
        lesson_phrases=lesson_phrases,
        teacher_system_prompt=teacher_system_prompt,
    )

    return Agent(
        edge=getstream.Edge(),
        agent_user=User(name=teacher_name, id="lumi-teacher"),
        instructions=instructions,
        llm=_make_llm(),
    )


async def join_call(
    agent: Agent, call_type: str, call_id: str, **kwargs: Any  # noqa: ANN401
) -> None:
    """
    Entry point called once the agent session starts.
    kwargs carries lesson data forwarded from the Expo API route.
    """
    log = logging.getLogger(__name__)

    # Resolve language — prefer explicit kwarg, fall back to call_id parsing
    language = kwargs.get("language_name") or _language_from_call_id(call_id)
    teacher_name = kwargs.get("teacher_name") or "Lumi"
    lesson_title = kwargs.get("lesson_title") or "Language Lesson"
    lesson_goals = kwargs.get("lesson_goals") or []

    call = await agent.create_call(call_type, call_id)

    async with agent.join(call):
        # Log every student turn so we can see the back-and-forth in server logs.
        # The Realtime LLM (Gemini / OpenAI) listens continuously and responds
        # automatically after each student utterance — no manual dispatch needed.
        @agent.events.subscribe(UserTranscriptEvent)
        async def on_student_speech(event: UserTranscriptEvent) -> None:
            text = event.text.strip()
            if text:
                log.info("Student said: %s", text)

        # Kick off the lesson with a single warm greeting + one question.
        # After speaking, the Realtime LLM stops and waits for the student's voice.
        opening = _opening_prompt(
            language=language,
            teacher_name=teacher_name,
            lesson_title=lesson_title,
            lesson_goals=lesson_goals,
        )
        await agent.simple_response(opening)

        # Keep the agent alive for the full duration of the call.
        await agent.finish()


if __name__ == "__main__":
    Runner(
        AgentLauncher(
            create_agent=create_agent,
            join_call=join_call,
            max_sessions_per_call=1,
            agent_idle_timeout=120.0,
        )
    ).cli()
