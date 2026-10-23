"use client";
import { useState, type FormEvent } from "react";

/**
 * The form posts to /api/contact on the `sv` Worker (worker/index.ts), which
 * relays the message through Resend. The inbox address is a Worker secret, so
 * it is never rendered, bundled or sent to the browser. If the relay is
 * unavailable the message stays in the form for the visitor to send later.
 */
const topics = ["Engineering role", "Project or consulting work", "Research collaboration", "Something else"] as const;
const messageLimit = 4000;

type State = { kind: "idle" | "sending" | "sent" | "unavailable"; text: string };

export function ContactForm({ defaultTopic = topics[0] }: { readonly defaultTopic?: (typeof topics)[number] }) {
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const [length, setLength] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const payload = {
      name: value("name"),
      email: value("email"),
      organisation: value("organisation"),
      topic: value("topic"),
      message: value("message"),
      leave_blank: value("leave_blank"),
    };
    setState({ kind: "sending", text: "Sending your message..." });
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
      if (response.ok && result.ok) {
        form.reset();
        setLength(0);
        setState({ kind: "sent", text: "Thank you. Your message has been sent and I will reply to the address you gave." });
        return;
      }
      if (result.reason === "invalid") {
        setState({ kind: "idle", text: "Please check your name, email address and message, then try again." });
        return;
      }
    } catch {}
    setState({ kind: "unavailable", text: "Your message could not be sent right now. It is still in the form, so please try again a little later." });
  }

  return (
    <form className="contact-form" onSubmit={submit} aria-describedby="contact-form-note" data-state={state.kind}>
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
      <div className="message-field">
        <label>
          <span>Message</span>
          <textarea name="message" required rows={5} maxLength={messageLimit} aria-describedby="message-count" onChange={(e) => setLength(e.target.value.length)} />
        </label>
        <p id="message-count" className="counter">{length} of {messageLimit} characters</p>
      </div>
      <label className="trap" aria-hidden="true">
        <span>Leave this field empty</span>
        <input name="leave_blank" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit" disabled={state.kind === "sending"}>{state.kind === "sending" ? "Sending..." : "Send message"}</button>
        <p id="contact-form-note">Sent from this page, so my email address is never published.</p>
      </div>
      <p className="form-status" role="status">{state.text}</p>
      <noscript><p className="form-status">The form needs JavaScript to send your message.</p></noscript>
    </form>
  );
}
