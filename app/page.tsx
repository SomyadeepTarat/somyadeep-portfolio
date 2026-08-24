"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ShootingStar from "./components/ShootingStar";
import ParallaxLayers from "./components/ParallaxLayers";
import OrbitSystem from "./components/OrbitSystem";
import TerminalContactForm from "./components/TerminalContactForm";
import { projects } from "./data/projects";

const CosmicCanvas = dynamic(() => import("./components/CosmicCanvas"), { ssr: false });

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dossier, setDossier] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const [reduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let value = 0;
    const timer = window.setInterval(() => {
      value += Math.ceil(Math.random() * 9);
      if (value >= 100) { value = 100; window.clearInterval(timer); window.setTimeout(() => setLoaded(true), 350); }
      setProgress(value);
    }, prefersReduced ? 18 : 55);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loaded || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });
      gsap.to(".hero-word.one", { xPercent: -8, scrollTrigger: { trigger: ".hero", scrub: 1, start: "top top", end: "bottom top" } });
      gsap.to(".hero-word.two", { xPercent: 9, scrollTrigger: { trigger: ".hero", scrub: 1, start: "top top", end: "bottom top" } });
    });
    return () => { ctx.revert(); lenis.destroy(); gsap.ticker.remove(update); };
  }, [loaded, reduced]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setDossier(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const jump = (id: string) => { document.querySelector(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" }); setMenu(false); };

  return (
    <main>
      <CosmicCanvas reduced={reduced} />
      <ParallaxLayers />
      <div className="grain" aria-hidden="true" />
      <div className={`loader ${loaded ? "is-gone" : ""}`}><Image src="/assets/st-monogram.webp" width={72} height={72} alt="" priority /><p>CALIBRATING SINGULARITY</p><div><span style={{ width: `${progress}%` }} /></div><b>{String(progress).padStart(3, "0")}</b></div>

      <header className="nav">
        <button className="brand" onClick={() => jump("#top")}><Image src="/assets/st-monogram.webp" width={35} height={35} alt="ST" priority /><span>SOMYADEEP TARAT<br /><small>NEW DELHI · IN</small></span></button>
        <nav className={menu ? "open" : ""}>{[["Work", "#work"], ["Trajectory", "#trajectory"]].map(([label, href]) => <button key={href} onClick={() => jump(href)}>{label}</button>)}<button className="contact-pill" onClick={() => jump("#contact")}>Initiate contact ↗</button></nav>
        <button className="menu" aria-label="Toggle menu" onClick={() => setMenu(!menu)}>{menu ? "CLOSE" : "MENU"}</button>
      </header>

      <section className="hero" id="top">
        <ShootingStar />
        <p className="eyebrow">STUDENT DEVELOPER <i /> ASPIRING ENTREPRENEUR</p>
        <h1><span className="hero-word one">SOMYA</span><span className="hero-word outline">DEEP</span><span className="hero-word two">TARAT</span></h1>
        <div className="hero-bottom"><p>I build intelligent systems at the edge of<br />software, data and ambitious ideas.</p><button onClick={() => jump("#origin")}>ENTER THE FIELD <span>↓</span></button><small>COORDINATES<br />28.6139° N · 77.2090° E</small></div>
      </section>

      <section className="section origin" id="origin">
        <div className="section-mark">01 / ORIGIN</div>
        <div className="origin-copy" data-reveal><p className="kicker">THE PERSON BEHIND THE SIGNAL</p><h2>Curiosity in orbit.<br /><em>Execution at the core.</em></h2><p>I’m Somyadeep, a developer and builder studying at VIT. I turn complex problems into focused digital products—combining machine learning, thoughtful interfaces and an entrepreneurial instinct.</p><div className="coordinates"><span>BASED IN</span><strong>New Delhi, India</strong><span>CURRENT VECTOR</span><strong>Engineering × Entrepreneurship</strong></div></div>
        <div className="portrait-wrap" data-reveal><div className="orbit o1" /><div className="orbit o2" /><Image src="/assets/somyadeep-cosmic-portrait.jpg" width={1122} height={1402} sizes="(max-width: 820px) 90vw, 42vw" style={{ width: "100%", height: "auto" }} alt="Portrait of Somyadeep Tarat" /><span>SUBJECT / ST-01</span></div>
      </section>

      <section className="section work" id="work">
        <div className="section-mark">02 / SELECTED MISSIONS</div>
        <div className="work-head" data-reveal><p className="kicker">PROJECT ARCHIVE</p><h2>Systems designed<br />to create <em>gravity.</em></h2><p>Three applied explorations across finance, graph intelligence and AI-native business infrastructure.</p></div>
        <OrbitSystem projects={projects} onOpen={setDossier} />
      </section>

      <section className="section trajectory" id="trajectory">
        <div className="section-mark">03 / TRAJECTORY</div><div className="trajectory-title" data-reveal><p className="kicker">EXPERIENCE & EDUCATION</p><h2>A path defined by<br /><em>forward motion.</em></h2></div>
        <div className="timeline" data-reveal>
          <article><span>2023 — PRESENT</span><h3>Vellore Institute of Technology</h3><p>B.Tech · Computer Science and Engineering</p></article>
          <article><span>INDUSTRY</span><h3>Muzigal</h3><p>Engineering and product experience in a fast-moving music education ecosystem.</p></article>
          <article><span>INDUSTRY</span><h3>Axis Max Life Insurance</h3><p>Applied technology and business thinking inside a large-scale financial organization.</p></article>
          <article><span>COMMUNITY</span><h3>ACM–VIT</h3><p>Technical community, collaboration and leadership through the university chapter.</p></article>
        </div>
      </section>

      <footer className="contact section" id="contact"><p className="kicker">TRANSMISSION CHANNEL OPEN</p><div className="contact-grid"><h2>Have an ambitious idea?<br /><em>Let’s give it gravity.</em></h2><TerminalContactForm /></div><div className="footer-line"><span>© {new Date().getFullYear()} SOMYADEEP TARAT</span><p><a href="https://github.com/SomyadeepTarat" target="_blank" rel="noreferrer">GITHUB ↗</a><a href="https://www.linkedin.com/in/somyadeep-tarat" target="_blank" rel="noreferrer">LINKEDIN ↗</a></p><button onClick={() => jump("#top")}>RETURN TO ORBIT ↑</button></div></footer>

      {dossier !== null && <div className="dossier-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDossier(null); }}><article className="dossier"><button className="close" onClick={() => setDossier(null)}>CLOSE ×</button><p>MISSION DOSSIER / {projects[dossier].code}</p><h2>{projects[dossier].name}</h2><h4>{projects[dossier].type}</h4><p>{projects[dossier].text}</p><div>{projects[dossier].stack.map((item) => <span key={item}>{item}</span>)}</div><a href="https://github.com/SomyadeepTarat" target="_blank" rel="noreferrer">VIEW GITHUB ARCHIVE ↗</a></article></div>}
    </main>
  );
}
