export async function* streamChat(
  messages: { role: string; content: string }[],
  systemPrompt?: string
): AsyncGenerator<{ type: "thinking" | "content"; text: string }> {
  const base = process.env.MIMO_API_BASE || "https://api.xiaomimimo.com/v1";
  const key = process.env.MIMO_API_KEY || "";
  const model = process.env.MIMO_MODEL || "mimo-v2.5-pro";

  const body: Record<string, unknown> = {
    model,
    stream: true,
    messages: [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  };

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": key,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`MiMo API error ${res.status}: ${errText}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);
      if (data === "[DONE]") return;

      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta;
        if (!delta) continue;

        if (delta.reasoning_content) {
          yield { type: "thinking", text: delta.reasoning_content };
        }
        if (delta.content) {
          yield { type: "content", text: delta.content };
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }

  // Process remaining buffer
  if (buffer.trim().startsWith("data: ")) {
    const data = buffer.trim().slice(6);
    if (data !== "[DONE]") {
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta;
        if (delta?.reasoning_content) yield { type: "thinking", text: delta.reasoning_content };
        if (delta?.content) yield { type: "content", text: delta.content };
      } catch {
        // Skip
      }
    }
  }
}
