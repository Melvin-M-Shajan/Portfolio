import { afterEach, describe, expect, it, vi } from "vitest";
import { handleMelvinAssistant } from "@/server/melvin-assistant";

const makeRequest = (body: unknown) =>
  new Request("https://portfolio.example/api/ask-melvin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://portfolio.example",
    },
    body: JSON.stringify(body),
  });

afterEach(() => {
  delete process.env.GROQ_API_KEY;
  vi.unstubAllGlobals();
});

describe("Melvin assistant endpoint", () => {
  it("keeps the API key server-side and reports missing configuration", async () => {
    const response = await handleMelvinAssistant(
      makeRequest({ question: "What does Melvin build?" }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Mini Mel is not connected yet. Add GROQ_API_KEY to the hosting environment.",
    });
  });

  it("grounds a Groq chat completion in verified portfolio knowledge", async () => {
    process.env.GROQ_API_KEY = "test-only-key";
    const fetchMock = vi.fn().mockResolvedValue(
      Response.json({
        choices: [{ message: { content: "He builds production multi-agent systems." } }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleMelvinAssistant(
      makeRequest({ question: "What does Melvin build?" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      answer: "He builds production multi-agent systems.",
    });
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    const payload = JSON.parse(request.body as string) as {
      model: string;
      messages: Array<{ role: string; content: string }>;
    };
    expect(payload.model).toBe("llama-3.1-8b-instant");
    expect(payload.messages[0].content).toContain("VERIFIED PORTFOLIO KNOWLEDGE");
    expect(payload.messages[0].content).toContain("GraphRAG-Enterprise");
  });
});
