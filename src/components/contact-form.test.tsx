import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactForm, validateContact } from "@/components/contact-form";

describe("contact form", () => {
  it("validates each required field", () => {
    expect(validateContact({ name: "", email: "invalid", message: "short" })).toEqual({
      name: "Please enter your name.",
      email: "Enter a valid email address.",
      message: "Add a little more detail so I can respond well.",
    });
  });

  it("renders accessible validation feedback", () => {
    render(<ContactForm />);
    fireEvent.submit(screen.getByRole("button", { name: /draft email/i }).closest("form")!);
    expect(screen.getByText("Please enter your name.")).toBeVisible();
    expect(screen.getByText("Enter a valid email address.")).toBeVisible();
    expect(screen.getByText(/add a little more detail/i)).toBeVisible();
  });
});
