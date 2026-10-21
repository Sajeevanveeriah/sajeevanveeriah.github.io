"use client";
import { useState, type FormEvent } from "react";

/**
 * The site is a static export with no backend, so the form prepares the
 * message in the visitor's own email app for them to review and send. The
 * address is assembled only at submit time and is never rendered on the page.
 */
const inbox = ["sajeevanveeriah", "gmail.com"];
const topics = ["Engineering role", "Project or consulting work", "Research collaboration", "Something else"] as const;

export function ContactForm({ defaultTopic = topics[0] }: { readonly defaultTopic?: (typeof topics)[number] }) {
  const [status, setStatus] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const subject = `${value("topic")} - ${value("name")}`;
    const body = [
      value("message"),
      "",
      `Name: ${value("name")}`,
      `Reply to: ${value("email")}`,
      value("organisation") && `Organisation: ${value("organisation")}`,
      "Sent from the portfolio contact form",
    ].filter((line) => line !== "").join("\n");
    window.location.href = `mailto:${inbox.join("@")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("Your email app should now open with the message ready. Review it and press send to reach me.");
  }

  return (
    <form className="contact-form" onSubmit={submit} aria-describedby="contact-form-note">
      <div className="form-row">
        <label>
          <span>Name</span>
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          <span>Your email</span>
          <input name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>Organisation <em>(optional)</em></span>
          <input name="organisation" autoComplete="organization" maxLength={160} />
        </label>
        <label>
          <span>Topic</span>
          <select name="topic" defaultValue={defaultTopic}>
            {topics.map((topic) => <option key={topic}>{topic}</option>)}
          </select>
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea name="message" required rows={5} maxLength={4000} />
      </label>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Send message</button>
        <p id="contact-form-note">Sending opens your email app with the message ready to review.</p>
      </div>
      <p className="form-status" role="status">{status}</p>
      <noscript><p className="form-status">The form needs JavaScript to prepare your message.</p></noscript>
    </form>
  );
}
