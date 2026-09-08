"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TerminalContactForm from "./components/TerminalContactForm";
import { projects } from "./data/projects";

const CosmicCanvas = dynamic(() => import("./components/CosmicCanvas"), { ssr: false });
const links = [["Work", "work"], ["About", "about"], ["Trajectory", "trajectory"]];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectVisual({ index }: { index: number }) {
  return <div className={`project-visual visual-${index}`} aria-hidden="true">
    <span className="visual-caption">{["MARKET SIGNAL / NEXT-DAY FORECAST", "NETWORK ANALYSIS / RISK DETECTION", "INTELLIGENCE / REVENUE SYSTEM"][index]}</span>
    {index === 0 ? <svg viewBox="0 0 440 180" fill="none"><defs><linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#b3c9a6" stopOpacity=".23"/><stop offset="1" stopColor="#b3c9a6" stopOpacity="0"/></linearGradient></defs>{[40,80,120,160].map(y=><path key={y} d={`M0 ${y} H440`} stroke="#ffffff0d"/>)}<path d="M0 145 L22 137 L40 148 L62 115 L85 125 L110 92 L133 104 L159 85 L185 101 L211 64 L235 72 L259 40 L283 53 L309 31 L337 49 L365 18 L390 35 L416 12 L440 21 V180 H0Z" fill="url(#chart-fill)"/><path d="M0 145 L22 137 L40 148 L62 115 L85 125 L110 92 L133 104 L159 85 L185 101 L211 64 L235 72 L259 40 L283 53 L309 31 L337 49 L365 18 L390 35 L416 12 L440 21" stroke="#adc69f" strokeWidth="2"/><path d="M309 0V180" stroke="#adc69f55" strokeDasharray="4 5"/></svg> : index === 1 ? <svg viewBox="0 0 440 180"><g stroke="#b2a4cb50">{[[60,80,150,42],[60,80,137,140],[150,42,137,140],[150,42,232,86],[137,140,232,86],[232,86,320,30],[232,86,330,142],[320,30,390,86],[330,142,390,86],[320,30,330,142],[232,86,390,86]].map((p,i)=><line key={i} x1={p[0]} y1={p[1]} x2={p[2]} y2={p[3]}/>)}</g>{[[60,80],[150,42],[137,140],[232,86],[320,30],[330,142],[390,86]].map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r={i===3?24:13} fill={i===3?"#bdadcb20":"#17151d"} stroke="#b2a4cb66"/><circle cx={p[0]} cy={p[1]} r={i===3?6:3} fill="#c6b8dc"/></g>)}</svg> : <div className="pipeline"><span>Discover<small>01 / SOURCE</small></span><i>→</i><span>Understand<small>02 / RESEARCH</small></span><i>→</i><span>Connect<small>03 / OUTREACH</small></span></div>}
    <span className="visual-footnote">CONCEPT VISUALIZATION</span>
  </div>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("top");
  const [dossier, setDossier] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-15% 0px -55% 0px" });
    document.querySelectorAll("main > section[id]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dossier === null) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; returnFocus.current?.focus(); };
  }, [dossier]);

  const openProject = (index: number) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setDossier(index);
  };
  const closeProject = () => { dialog.current?.close(); setDossier(null); };
  const project = dossier !== null ? projects[dossier] : null;

  return <>
    <a className="skip-link" href="#work">Skip to selected work</a>
    <header className="nav">
      <a className="brand" href="#top" aria-label="Somyadeep Tarat, home"><span className="monogram">st<span>.</span></span><span>SOMYADEEP TARAT<small>DEVELOPER & BUILDER</small></span></a>
      <nav id="main-navigation" aria-label="Main navigation" className={menu ? "open" : ""} onKeyDown={e => { if(e.key === "Escape") { setMenu(false); menuButton.current?.focus(); } }}>
        {links.map(([label,id]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined} onClick={() => setMenu(false)}>{label}</a>)}
        <a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Let’s talk <Arrow /></a>
      </nav>
      <button ref={menuButton} className="menu-button" aria-controls="main-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? "Close ×" : "Menu +"}</button>
    </header>
    <main>
      <section className="hero" id="top">
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span className="status-dot" /> A CURIOUS MIND. AN EXPANDING UNIVERSE.</p>
          <h1>Building at the<br />edge of <em>what’s<br className="desktop-break" /> possible.</em></h1>
          <p className="hero-description">I’m Somyadeep Tarat. A developer exploring the intersection of intelligent systems, thoughtful products, and ambitious ideas.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore my work <span aria-hidden="true">↓</span></a><a className="text-link" href="#about">The person behind it <Arrow /></a></div>
          <div className="hero-location"><span className="crosshair" aria-hidden="true">⊕</span> NEW DELHI, INDIA <span className="location-line" /> 28.6139° N · 77.2090° E</div>
        </div>
        <div className="hero-scene"><CosmicCanvas paused={paused} /><div className="scene-coordinate">FIG. 001 <span>THE SINGULARITY</span></div><div className="scene-controls"><span>DRAG TO EXPLORE</span><button onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume orbital animation" : "Pause orbital animation"}>{paused ? "Play ↗" : "Pause Ⅱ"}</button></div></div>
        <div className="hero-bottom"><span>SOFTWARE ENGINEERING <i>×</i> MACHINE LEARNING <i>×</i> PRODUCT THINKING</span><a href="#work">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a></div>
      </section>

      <section className="section work" id="work">
        <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Ideas, brought<br /><em>down to earth.</em></h2></div><p>A few things I’ve been building.<br />From finding signals in markets to<br />connecting the dots in complex systems.</p></div>
        <div className="projects-grid">{projects.map((item,index) => <article className={`project-card project-${index}`} key={item.code}>
          <button className="project-open" onClick={() => openProject(index)} aria-label={`Explore ${item.name}`}><ProjectVisual index={index}/><div className="project-copy"><div className="project-meta"><span>{item.type}</span><span>{item.year} <Arrow /></span></div><h3>{item.name}</h3><p>{item.text}</p><div className="project-stack">{item.stack.slice(0,3).map(tech=><span key={tech}>{tech}</span>)}{item.stack.length>3 && <span>+{item.stack.length-3}</span>}</div><div className="project-bottom"><span>Explore project</span><span aria-hidden="true">↗</span></div></div></button>
        </article>)}</div>
        <div className="work-note"><span>SMALL EXPERIMENTS. BIGGER POSSIBILITIES.</span><a className="text-link" href="https://github.com/SomyadeepTarat" target="_blank" rel="noreferrer">More on GitHub <Arrow /></a></div>
      </section>

      <section className="section about" id="about">
        <div className="portrait-panel"><Image src="/assets/somyadeep-cosmic-portrait.jpg" width={1122} height={1402} sizes="(max-width: 760px) 90vw, 38vw" alt="Somyadeep Tarat against a cosmic backdrop" /><div className="portrait-label"><span>THE HUMAN IN THE LOOP</span><span>ST — 01</span></div></div>
        <div className="about-copy"><p className="eyebrow">02 / A LITTLE ABOUT ME</p><h2>Grounded in curiosity.<br /><em>Drawn to the unknown.</em></h2><p>I’m a computer science student at VIT, a developer, and an aspiring entrepreneur. I like taking a complicated problem apart and turning it into something people can actually use.</p><p>My work moves between machine learning, software engineering, and product thinking. The common thread? Understanding how things work, then finding a better way to build them.</p><div className="capabilities"><div><span>01</span><h3>Intelligent systems</h3><p>Machine learning · Data · Graph intelligence</p></div><div><span>02</span><h3>Thoughtful products</h3><p>Full-stack development · APIs · Automation</p></div><div><span>03</span><h3>Builder’s mindset</h3><p>Curiosity · Experimentation · Entrepreneurship</p></div></div></div>
      </section>

      <section className="section trajectory" id="trajectory"><div className="section-heading"><div><p className="eyebrow">03 / TRAJECTORY</p><h2>Always in <em>motion.</em></h2></div><p>The places and people<br />shaping the way I build.</p></div><div className="timeline">
        {[
          ["2023 — PRESENT", "Vellore Institute of Technology", "B.Tech · Computer Science and Engineering", "EDUCATION"],
          ["INDUSTRY", "Muzigal", "Engineering and product experience in music education.", "EXPERIENCE"],
          ["INDUSTRY", "Axis Max Life Insurance", "Technology and business thinking in financial services.", "EXPERIENCE"],
          ["COMMUNITY", "ACM–VIT", "Technical collaboration and leadership at the university chapter.", "COMMUNITY"],
        ].map(([time,name,description,type])=><article key={name}><span className="timeline-time">{time}</span><div><h3>{name}</h3><p>{description}</p></div><span className="timeline-type">{type}</span></article>)}
      </div></section>

      <section className="section contact" id="contact"><div className="contact-copy"><p className="eyebrow"><span className="status-dot"/> 04 / OPEN A CONVERSATION</p><h2>Good things start<br />with a <em>hello.</em></h2><p>Have an interesting problem, a collaboration in mind, or just want to talk about what’s next?</p><a className="contact-email" href="mailto:sayantarat@gmail.com">sayantarat@gmail.com <Arrow /></a><div className="social-links"><a href="https://github.com/SomyadeepTarat" target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href="https://www.linkedin.com/in/somyadeep-tarat" target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div></div><TerminalContactForm /></section>
    </main>
    <footer className="footer"><a className="monogram" href="#top" aria-label="Back to top">st<span>.</span></a><span>© {new Date().getFullYear()} SOMYADEEP TARAT</span><span>BUILT WITH CURIOSITY. ALWAYS EVOLVING.</span><a href="#top">BACK TO TOP ↑</a></footer>
    <dialog ref={dialog} className="project-dialog" onCancel={closeProject} onClose={() => setDossier(null)} onClick={event => { if(event.target===event.currentTarget) { const rect=event.currentTarget.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) closeProject(); } }} aria-labelledby="project-title">
      {project && <><div className="dialog-bar"><span>PROJECT NOTES / {project.code}</span><button onClick={closeProject} autoFocus aria-label="Close project details">×</button></div><p className="eyebrow">{project.type} · {project.year}</p><h2 id="project-title">{project.name}</h2><p className="dialog-description">{project.text}</p><h3>Technical focus</h3><p>{project.focus}</p><h3>Built with</h3><div className="project-stack">{project.stack.map(tech=><span key={tech}>{tech}</span>)}</div><p className="dialog-note">Explore my GitHub profile for repositories and ongoing work.</p><a className="button primary" href="https://github.com/SomyadeepTarat" target="_blank" rel="noreferrer">Visit GitHub profile <Arrow /></a></>}
    </dialog>
  </>;
}
