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
  delete process.env.GROQ_MODEL;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
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
      reasoning_effort: string;
      include_reasoning: boolean;
      max_completion_tokens: number;
      messages: Array<{ role: string; content: string }>;
    };
    expect(payload.model).toBe("openai/gpt-oss-20b");
    expect(payload.reasoning_effort).toBe("low");
    expect(payload.include_reasoning).toBe(false);
    expect(payload.max_completion_tokens).toBe(1024);
    expect(payload.messages[0].content).toContain("VERIFIED PORTFOLIO KNOWLEDGE");
    expect(payload.messages[0].content).toContain("GraphRAG-Enterprise");
    expect(payload.messages[0].content).toContain("bold short category labels");
  });

  it("logs provider failures without exposing the API key", async () => {
    process.env.GROQ_API_KEY = "secret-test-key";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('{"error":{"message":"The model is unavailable."}}', {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal("fetch", fetchMock);

    const response = await handleMelvinAssistant(
      makeRequest({ question: "What is Melvin's AI stack?" }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "Mini Mel could not reach the answer service. Please try again shortly.",
    });
    expect(consoleError).toHaveBeenCalledWith(
      "[mini-mel] Groq request failed",
      expect.objectContaining({
        status: 400,
        model: "openai/gpt-oss-20b",
      }),
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain("secret-test-key");
  });
});
