"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const prompt = "> mission-control:// establish secure uplink_";

export default function TerminalContactForm() {
  const root = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setTyped(prompt));
      return () => cancelAnimationFrame(frame);
    }
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTyped(prompt.slice(0, index));
      if (index >= prompt.length) window.clearInterval(timer);
    }, 38);
    return () => window.clearInterval(timer);
  }, [started]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Portfolio transmission from ${name}`);
    const body = encodeURIComponent(`${message}\n\nReply to: ${name} <${email}>`);
    window.location.href = `mailto:sayantarat@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="terminal" ref={root}>
      <div className="terminal-bar"><span /><span /><span /><b>ST_MISSION_CONTROL</b></div>
      <p className="terminal-prompt" aria-hidden="true">{typed}<i /></p>
      <form onSubmit={submit}>
        <label><span>&gt; IDENTIFY YOURSELF</span><input name="name" autoComplete="name" placeholder="your name" required /></label>
        <label><span>&gt; RETURN FREQUENCY</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label><span>&gt; TRANSMISSION</span><textarea name="message" rows={4} placeholder="Tell me about the mission..." required /></label>
        <button type="submit">TRANSMIT MESSAGE ↗</button>
      </form>
    </div>
  );
}
