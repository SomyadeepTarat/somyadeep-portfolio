"use client";

import { useEffect, useRef } from "react";

/** Progressive enhancement: content stays readable before JavaScript and without motion. */
export default function MotionEffects() {
  const light = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    let lightFrame = 0;
    const followScroll = () => {
      cancelAnimationFrame(lightFrame);
      lightFrame = requestAnimationFrame(() => {
        const scroll = preference.matches ? 0 : window.scrollY;
        const x = window.innerWidth * (.5 + Math.sin(scroll * .001) * .27);
        const y = window.innerHeight * (.45 + Math.sin(scroll * .0007) * .18);
        if (light.current) light.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    followScroll();
    window.addEventListener("scroll", followScroll, { passive: true });
    window.addEventListener("resize", followScroll, { passive: true });
    preference.addEventListener("change", followScroll);
    const animations = new Set<Animation>();
    const removers: (() => void)[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const stagger = Number((entry.target as HTMLElement).dataset.stagger || 0);
        const animation = entry.target.animate(
          [{ opacity: 0, transform: "translateY(32px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 850, delay: stagger, easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section-heading, .project-card, .portrait-panel, .about-copy, .timeline article, .contact-copy, .terminal").forEach(node => observer.observe(node));

    document.querySelectorAll<HTMLElement>("[data-depth]").forEach(node => {
      let frame = 0;
      const reset = () => {
        cancelAnimationFrame(frame);
        node.style.setProperty("--rotate-x", "0deg");
        node.style.setProperty("--rotate-y", "0deg");
        node.style.setProperty("--light-opacity", "0");
      };
      const move = (event: PointerEvent) => {
        if (preference.matches || !finePointer.matches || event.pointerType === "touch") return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const bounds = node.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
          const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
          node.style.setProperty("--rotate-x", `${(0.5 - y) * 7}deg`);
          node.style.setProperty("--rotate-y", `${(x - 0.5) * 9}deg`);
          node.style.setProperty("--light-x", `${x * 100}%`);
          node.style.setProperty("--light-y", `${y * 100}%`);
          node.style.setProperty("--light-opacity", "1");
        });
      };
      node.addEventListener("pointermove", move, { passive: true });
      node.addEventListener("pointerleave", reset);
      preference.addEventListener("change", reset);
      removers.push(() => { reset(); node.removeEventListener("pointermove", move); node.removeEventListener("pointerleave", reset); preference.removeEventListener("change", reset); });
    });
    const stopAnimations = () => { if (preference.matches) animations.forEach(animation => animation.cancel()); };
    preference.addEventListener("change", stopAnimations);
    return () => { cancelAnimationFrame(lightFrame); window.removeEventListener("scroll", followScroll); window.removeEventListener("resize", followScroll); preference.removeEventListener("change", followScroll); observer.disconnect(); animations.forEach(animation => animation.cancel()); removers.forEach(remove => remove()); preference.removeEventListener("change", stopAnimations); };
  }, []);
  return <div ref={light} className="traveling-light" aria-hidden="true" />;
}
