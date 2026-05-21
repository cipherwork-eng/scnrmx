import { NextRequest } from "next/server";
import { streamChat } from "@/lib/ai-client";
import { AGENT_SYSTEM_PROMPTS } from "@/lib/agent-prompts";

export const runtime = "edge";
export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages array required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = AGENT_SYSTEM_PROMPTS[context || "general"] || AGENT_SYSTEM_PROMPTS.general;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: Record<string, string>) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        try {
          for await (const chunk of streamChat(messages, systemPrompt)) {
            if (chunk.type === "thinking") {
              send("thinking", { text: chunk.text });
            } else if (chunk.type === "content") {
              send("content", { text: chunk.text });
            }
          }
          send("done", {});
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          send("error", { text: `Error: ${message}` });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
