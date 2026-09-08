"use client";

import { FormEvent, useState } from "react";

export default function TerminalContactForm() {
  const [draftOpened, setDraftOpened] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !message) return;
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nReply to: ${name} <${email}>`);
    window.location.href = `mailto:sayantarat@gmail.com?subject=${subject}&body=${body}`;
    setDraftOpened(true);
  };
  return <div className="terminal"><div className="terminal-bar"><span className="status-dot"/><span>YOUR NEXT IDEA STARTS HERE</span><span aria-hidden="true">↗</span></div><form onSubmit={submit}>
    <div className="form-row"><label>Your name<input name="name" autoComplete="name" placeholder="Alex Taylor" maxLength={100} required /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="alex@example.com" maxLength={254} required /></label></div>
    <label>What’s on your mind?<textarea name="message" rows={4} placeholder="Tell me a little about your idea…" maxLength={3000} required /></label>
    <button className="button primary" type="submit">Compose an email <span aria-hidden="true">↗</span></button><p className="form-note" role="status">{draftOpened ? "Your email app was requested. Send the draft there to complete your message. If it didn’t open, use the email address alongside this form." : "Opens a draft in your email app. You review and send it."}</p>
  </form></div>;
}
