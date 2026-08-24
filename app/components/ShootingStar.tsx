"use client";

import { useEffect, useState } from "react";

export default function ShootingStar() {
  const [shot, setShot] = useState({ key: 0, top: 18, left: 62 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setShot(({ key }) => ({ key: key + 1, top: 8 + Math.random() * 34, left: 44 + Math.random() * 42 }));
        schedule();
      }, 8000 + Math.random() * 12000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return <div className="shooting-star-field" aria-hidden="true"><i key={shot.key} style={{ top: `${shot.top}%`, left: `${shot.left}%` }} /></div>;
}
