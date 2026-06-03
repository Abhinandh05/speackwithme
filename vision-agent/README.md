# vision-agent

AI language teacher voice agent for the **SpeakWithMe** app.

- **Transport**: Stream Edge (WebRTC via `getstream`)
- **LLM**: OpenAI Realtime (`gpt-realtime-2`) — speech-to-speech, no separate STT/TTS
- **Persona**: Lumi, a friendly English-speaking teacher who teaches the student's target language

## How it works

The Expo app creates a Stream call with `call_id = lesson-{lessonId}` (e.g. `lesson-es-l1`).  
The agent server listens for POST requests to `/calls/{call_id}/sessions`, spawns a Lumi instance, and joins the call.  
Lumi detects the target language from the call ID (`es` → Spanish, `fr` → French, etc.) and opens with a warm greeting.

## Supported languages

| Code | Language         |
|------|-----------------|
| `es` | Spanish          |
| `fr` | French           |
| `ja` | Japanese         |
| `ko` | Korean           |
| `de` | German           |
| `zh` | Chinese (Mandarin)|

## Setup

1. Copy `.env` and fill in your OpenAI key:

```bash
cp .env .env.local   # optional — .env is already git-ignored at root
```

Edit `vision-agent/.env`:
```
STREAM_API_KEY=...        # already set — reused from parent .env
STREAM_API_SECRET=...     # already set — reused from parent .env
OPENAI_API_KEY=sk-...     # your OpenAI key
```

2. Install [uv](https://github.com/astral-sh/uv) if not already present:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Development

Start a single interactive agent session in your browser:

```bash
uv run agent.py run
```

The CLI prints a Stream demo URL — open it to talk to Lumi in your browser.

## Production (HTTP server mode)

Start the HTTP server that spawns agents on demand:

```bash
uv run agent.py serve --host 0.0.0.0 --port 8000
```

### Spawn an agent for a lesson call

```bash
curl -X POST http://localhost:8000/calls/lesson-es-l1/sessions \
  -H "Content-Type: application/json" \
  -d '{"call_type": "default"}'
```

### Health checks

```bash
curl http://localhost:8000/health
curl http://localhost:8000/ready
```

## API endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/calls/{call_id}/sessions` | Spawn a new Lumi session |
| DELETE | `/calls/{call_id}/sessions/{session_id}` | Close a session |
| GET | `/calls/{call_id}/sessions/{session_id}` | Session info |
| GET | `/calls/{call_id}/sessions/{session_id}/metrics` | Real-time metrics |
| GET | `/health` | Liveness check |
| GET | `/ready` | Readiness check |
