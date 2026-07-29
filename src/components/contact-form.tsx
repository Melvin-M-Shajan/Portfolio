"use client";

import { useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { siteConfig } from "@/content/site";

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function validateContact(values: { name: string; email: string; message: string }): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.message.trim().length < 20) errors.message = "Add a little more detail so I can respond well.";
  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string>("");

  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const values = {
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          message: String(data.get("message") ?? ""),
        };
        const nextErrors = validateContact(values);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) return;
        if (siteConfig.formEndpoint) {
          setStatus("Sending…");
          try {
            const response = await fetch(siteConfig.formEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error("Contact endpoint rejected the request.");
            setStatus("Message sent. Thank you.");
            event.currentTarget.reset();
          } catch {
            setStatus("The form endpoint is unavailable. Please use the email link instead.");
          }
          return;
        }
        const subject = encodeURIComponent(`Portfolio enquiry from ${values.name}`);
        const body = encodeURIComponent(`${values.message}\n\nFrom: ${values.name}\nEmail: ${values.email}`);
        window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      }}
    >
      <label>
        Name
        <input name="name" autoComplete="name" aria-describedby={errors.name ? "name-error" : undefined} />
        {errors.name ? <span id="name-error" className="field-error">{errors.name}</span> : null}
      </label>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" aria-describedby={errors.email ? "email-error" : undefined} />
        {errors.email ? <span id="email-error" className="field-error">{errors.email}</span> : null}
      </label>
      <label>
        What are you building?
        <textarea name="message" rows={6} aria-describedby={errors.message ? "message-error" : undefined} />
        {errors.message ? <span id="message-error" className="field-error">{errors.message}</span> : null}
      </label>
      <button className="button button-primary" type="submit">
        Draft email <PaperPlaneTilt weight="bold" />
      </button>
      <p className="form-note">This opens your email app. No form data is stored by this site.</p>
      <p className="form-note" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
