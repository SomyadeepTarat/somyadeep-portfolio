"use client";

import { useEffect, useRef } from "react";

export default function ParallaxLayers() {
  const layers = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const speeds = [0.035, 0.075, 0.12];
        layers.current.forEach((layer, index) => {
          if (layer) layer.style.transform = `translate3d(0, ${y * speeds[index]}px, 0)`;
        });
        frame = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => { window.removeEventListener("scroll", update); if (frame) cancelAnimationFrame(frame); };
  }, []);

  return <div className="parallax-space" aria-hidden="true">{["far", "mid", "near"].map((name, index) => <span key={name} className={`parallax-layer ${name}`} ref={(node) => { layers.current[index] = node; }} />)}</div>;
}
