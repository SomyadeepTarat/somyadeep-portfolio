"use client";
import { useState, type FormEvent } from "react";
import { profile } from "../data/profile";
import { ui } from "../data/interface";
export default function Mail() {
  const [status, setStatus] = useState<"idle" | "fallback">("idle");
  const [from, setFrom] = useState(""),
    [subject, setSubject] = useState(""),
    [body, setBody] = useState("");
  const fallback = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\nFrom: ${from}`)}`;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("_gotcha")) return;
    window.location.assign(fallback);
    setStatus("fallback");
  }

  return (
    <div className="mail-app utility-app">
      <span className="eyebrow">{ui.welcome.contact}</span>
      <h2>{ui.mail.title}</h2>
      <p>{ui.mail.intro}</p>
      <form onSubmit={submit}>
        <label>
          {ui.mail.to}
          <input readOnly value={profile.email} />
        </label>
        <label>
          {ui.mail.from}
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label>
          {ui.mail.subject}
          <input
            name="subject"
            required
            maxLength={200}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <label>
          {ui.mail.body}
          <textarea
            name="message"
            required
            maxLength={10000}
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <div className="honeypot" aria-hidden="true">
          <input
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-label="Leave empty"
          />
        </div>
        <button className="primary-button">{ui.mail.email} ↗</button>
        <div aria-live="polite">
          {status === "fallback" && (
            <div className="mail-fallback">
              <p>{ui.mail.fallback}</p>
              <a className="text-button" href={fallback}>
                {ui.mail.email} ↗
              </a>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
