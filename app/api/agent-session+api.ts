// app/api/agent-session+api.ts
// Proxy to the Vision Agent HTTP server to start / stop agent sessions.
// Runs server-side — VISION_AGENT_URL and credentials never leave the server.

function getAgentUrl(): string {
  return process.env.VISION_AGENT_URL ?? "http://localhost:8000";
}

export interface StartAgentBody {
  callType: string;
  callId: string;
  lessonContext?: {
    title: string;
    languageName: string;
    goals: string[];
    vocabulary: { word: string; translation: string }[];
    phrases: { phrase: string; translation: string }[];
    systemPrompt?: string;
    teacherName?: string;
    teacherPersona?: string;
  };
}

// POST /api/agent-session — spawn an agent session for a call
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as StartAgentBody;
    const { callType, callId, lessonContext } = body;

    if (!callType || !callId) {
      return Response.json(
        { error: "Missing required fields: callType, callId" },
        { status: 400 }
      );
    }

    const agentUrl = getAgentUrl();

    const agentResponse = await fetch(
      `${agentUrl}/calls/${callId}/sessions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          call_type: callType,
          // Pass lesson data as kwargs — vision-agents forwards these to join_call(**kwargs)
          ...(lessonContext
            ? {
                lesson_title: lessonContext.title,
                language_name: lessonContext.languageName,
                lesson_goals: lessonContext.goals,
                lesson_vocabulary: lessonContext.vocabulary,
                lesson_phrases: lessonContext.phrases,
                teacher_system_prompt: lessonContext.systemPrompt ?? "",
                teacher_name: lessonContext.teacherName ?? "Lumi",
                teacher_persona: lessonContext.teacherPersona ?? "",
              }
            : {}),
        }),
      }
    );

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error(
        "Vision agent session start failed:",
        agentResponse.status,
        errorText
      );
      return Response.json(
        { error: "Failed to start agent session" },
        { status: 502 }
      );
    }

    const data = (await agentResponse.json()) as { session_id?: string };
    return Response.json({ sessionId: data.session_id ?? "" });
  } catch (error) {
    console.error("agent-session POST error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/agent-session?callId=...&sessionId=... — close an agent session
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const callId = url.searchParams.get("callId");
    const sessionId = url.searchParams.get("sessionId");

    if (!callId || !sessionId) {
      return Response.json(
        { error: "Missing query params: callId, sessionId" },
        { status: 400 }
      );
    }

    const agentUrl = getAgentUrl();

    const agentResponse = await fetch(
      `${agentUrl}/calls/${callId}/sessions/${sessionId}`,
      { method: "DELETE" }
    );

    // 202 Accepted is the normal success response for async session close
    if (!agentResponse.ok && agentResponse.status !== 404) {
      const errorText = await agentResponse.text();
      console.warn(
        "Vision agent session stop returned non-OK:",
        agentResponse.status,
        errorText
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("agent-session DELETE error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
