"use client";

import { useEffect, useRef } from "react";

const TRAIL_LENGTH = 10;

export default function CometCursor() {
  const trail = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef({ x: -100, y: -100 });
  const points = useRef(Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 })));
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    document.body.classList.add("comet-cursor-enabled");
    const move = (event: MouseEvent) => { pointer.current = { x: event.clientX, y: event.clientY }; };
    let frame = 0;
    const render = () => {
      points.current[0].x += (pointer.current.x - points.current[0].x) * 0.5;
      points.current[0].y += (pointer.current.y - points.current[0].y) * 0.5;
      for (let index = 1; index < TRAIL_LENGTH; index += 1) {
        points.current[index].x += (points.current[index - 1].x - points.current[index].x) * 0.42;
        points.current[index].y += (points.current[index - 1].y - points.current[index].y) * 0.42;
      }
      trail.current.forEach((node, index) => {
        if (node) node.style.transform = `translate3d(${points.current[index].x}px, ${points.current[index].y}px, 0) scale(${1 - index / (TRAIL_LENGTH + 2)})`;
      });
      frame = requestAnimationFrame(render);
    };
    window.addEventListener("mousemove", move, { passive: true });
    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
      document.body.classList.remove("comet-cursor-enabled");
    };
  }, []);

  return <div className="comet-cursor" aria-hidden="true">{Array.from({ length: TRAIL_LENGTH }, (_, index) => <span key={index} className={index === 0 ? "comet-head" : "comet-trail"} ref={(node) => { trail.current[index] = node; }} />)}</div>;
}
