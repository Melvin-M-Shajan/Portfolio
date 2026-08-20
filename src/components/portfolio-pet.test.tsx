import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PortfolioPet } from "@/components/portfolio-pet";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("portfolio pet", () => {
  it("opens an accessible portfolio-grounded chat", async () => {
    render(<PortfolioPet />);

    fireEvent.click(screen.getByRole("button", { name: "Ask Mini Mel about Melvin" }));

    expect(document.querySelector(".portfolio-pet")).toHaveAttribute("data-motion", "wave");
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "Ask Mini Mel about Melvin" })).toBeVisible();
    });
    expect(screen.getByText(/I know the work, tools, and ideas/i)).toBeVisible();
    expect(screen.getAllByRole("button", { name: "Close Mini Mel" })).toHaveLength(2);
  });

  it("sends a question and renders the Groq-backed answer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          answer: "**Agent orchestration**\nLangGraph, LangChain, and LangSmith for evaluation.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    render(<PortfolioPet />);

    fireEvent.click(screen.getByRole("button", { name: "Ask Mini Mel about Melvin" }));
    fireEvent.change(screen.getByLabelText("Ask a question about Melvin"), {
      target: { value: "What does Melvin build?" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Send question" }).closest("form")!);

    expect(document.querySelector(".portfolio-pet")).toHaveAttribute("data-motion", "think");
    await waitFor(() => {
      expect(screen.getByText("Agent orchestration").tagName).toBe("STRONG");
      expect(screen.getByText(/LangGraph, LangChain, and LangSmith/i)).toBeVisible();
    });
    expect(document.querySelector(".portfolio-pet")).toHaveAttribute("data-motion", "answer");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/ask-melvin",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
