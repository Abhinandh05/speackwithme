// app/api/stream-token+api.ts
// Generates a Stream Video user token and creates/gets a lesson call (audio_room).
// Runs server-side — STREAM_SECRET_KEY is never sent to the client.
// Uses Web Crypto for JWT generation so it works both locally and on
// Cloudflare Workers (EAS Hosting).

function objectToBase64Url(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createHmacJwt(
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = objectToBase64Url(header);
  const payloadB64 = objectToBase64Url(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  const keyData = new TextEncoder().encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${bufferToBase64Url(sigBuffer)}`;
}

export interface LessonContext {
  title: string;
  languageName: string;
  goals: string[];
  vocabulary: { word: string; translation: string }[];
  phrases: { phrase: string; translation: string }[];
  systemPrompt?: string;
  teacherName?: string;
  teacherPersona?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      lessonId,
      languageId,
      lessonContext,
    } = body as {
      userId: string;
      userName: string;
      lessonId: string;
      languageId: string;
      lessonContext?: LessonContext;
    };

    if (!userId || !lessonId) {
      return Response.json(
        { error: "Missing required fields: userId, lessonId" },
        { status: 400 }
      );
    }

    const apiKey = process.env.STREAM_API_KEY;
    const secretKey = process.env.STREAM_SECRET_KEY;

    if (!apiKey || !secretKey) {
      console.error("Stream credentials not configured in environment");
      return Response.json(
        { error: "Stream credentials not configured" },
        { status: 500 }
      );
    }

    const now = Math.floor(Date.now() / 1000);

    // User token — used by the Stream Video client in the app
    const userToken = await createHmacJwt(
      {
        user_id: userId,
        iss: "stream-video-nodejs",
        sub: `user/${userId}`,
        iat: now - 5,
        exp: now + 3600,
      },
      secretKey
    );

    // Server token — used to call Stream REST API
    const serverToken = await createHmacJwt(
      {
        iss: "stream-video-nodejs",
        sub: "server-side",
        iat: now - 5,
        exp: now + 300,
      },
      secretKey
    );

    const callType = "audio_room";
    const callId = `lesson-${lessonId}`;

    const streamBase = `https://video.stream-io-api.com/video/call/${callType}/${callId}`;
    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serverToken}`,
      "stream-auth-type": "jwt",
    };

    // Create or get the call — pack lesson data into custom so the agent can read it
    const callResponse = await fetch(`${streamBase}?api_key=${apiKey}`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        data: {
          custom: {
            lessonId,
            languageId,
            ...(lessonContext ?? {}),
          },
          settings_override: {
            audio: { noise_cancellation: { mode: "available" } },
          },
        },
        members: [
          { user_id: userId, role: "speaker" },
          // Agent user — admin role so it can publish audio without host approval
          { user_id: "lumi-teacher", role: "admin" },
        ],
      }),
    });

    if (!callResponse.ok) {
      const errorText = await callResponse.text();
      console.error("Stream call creation failed:", callResponse.status, errorText);
      return Response.json({ error: "Failed to create Stream call" }, { status: 502 });
    }

    // go_live — required for audio_room so participants can join and speak
    const goLiveResponse = await fetch(
      `${streamBase}/go_live?api_key=${apiKey}`,
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({}),
      }
    );

    if (!goLiveResponse.ok) {
      // Log but don't fail — the call may already be live from a previous session
      const errorText = await goLiveResponse.text();
      console.warn("go_live request failed (may already be live):", goLiveResponse.status, errorText);
    }

    return Response.json({
      token: userToken,
      callId,
      callType,
      apiKey,
    });
  } catch (error) {
    console.error("stream-token API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
