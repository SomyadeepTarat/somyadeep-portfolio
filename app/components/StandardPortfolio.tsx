import ProjectLinks from "./ProjectLinks";
import Image from "next/image";
import {
  profile,
  experience,
  projects,
  featuredProjectIds,
  skills,
  leadership,
  copy,
} from "../data/profile";
import ProjectArtwork from "./ProjectArtwork";
import { Icon } from "../desktop/icons";
export default function StandardPortfolio() {
  return (
    <main className="standard-portfolio" id="portfolio-content">
      <a className="skip-link" href="#experience">
        Skip to experience
      </a>
      <header className="standard-header">
        <a
          className="standard-brand"
          href="#home"
          aria-label="Somyadeep Tarat home"
        >
          st<span>.</span>
        </a>
        <nav aria-label="Portfolio navigation">
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <section className="standard-hero" id="home">
        <span className="eyebrow">SOMYADEEP TARAT / PERSONAL PORTFOLIO</span>
        <h1>{profile.headline}</h1>
        <p>{profile.bio}</p>
        <div className="standard-hero-actions">
          <a className="primary-button" href="#projects">
            Explore my work <Icon name="arrow" size={14} />
          </a>
          <a href={profile.resume} download>
            Download resume ↓
          </a>
        </div>
        <div className="hero-profile">
          <Image
            src={profile.portrait}
            width={96}
            height={120}
            alt="Somyadeep Tarat"
            priority
          />
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
            <small>{profile.location || copy.about.locationTodo}</small>
          </div>
        </div>
      </section>
      <section className="standard-section" id="about">
        <span className="eyebrow">01 / ABOUT</span>
        <h2>Always a student.</h2>
        <div className="standard-education">
          <span className="section-kicker">{profile.education.location}</span>
          <h3>{profile.education.institution}</h3>
          <p>{profile.education.degree}</p>
          <div>
            <span>{profile.education.dates}</span>
            <strong>CGPA {profile.education.cgpa}</strong>
          </div>
        </div>
      </section>
      <section className="standard-section" id="experience">
        <span className="eyebrow">02 / EXPERIENCE</span>
        <h2>{copy.experience.title}</h2>
        <p className="section-description">{copy.experience.intro}</p>
        <div className="standard-experience">
          {experience.map((e) => (
            <article key={e.id} id={`experience-${e.id}`}>
              <div className="experience-top">
                <span className={`company-avatar large ${e.id}`}>
                  {e.initials}
                </span>
                <span>{e.dates}</span>
              </div>
              <h3>{e.company}</h3>
              <p className="standard-role">
                {e.role} · {e.location}
              </p>
              <ul className="highlights">
                {e.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
              <div className="tags">
                {e.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <h3 className="subsection-heading">{copy.experience.leadership}</h3>
        <div className="standard-leadership">
          {leadership.map((l) => (
            <article key={l.organization}>
              <span className="section-kicker">{l.role}</span>
              <h3>{l.organization}</h3>
              <p>{l.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="standard-section" id="projects">
        <span className="eyebrow">03 / SELECTED WORK</span>
        <h2>{copy.projects.title}</h2>
        <p className="section-description">{copy.projects.intro}</p>
        <nav
          id="projects-highlights"
          className="project-highlights"
          aria-label="Project highlights"
        >
          <h3>Highlights</h3>
          <div>
            {projects
              .filter((p) => featuredProjectIds.includes(p.id))
              .map((p) => (
                <a key={p.id} href={`#projects-${p.id}`}>
                  {p.name} <span aria-hidden="true">↗</span>
                </a>
              ))}
          </div>
        </nav>
        <div className="standard-projects uniform-projects">
          {projects.map((p) => (
            <article key={p.id} id={`projects-${p.id}`}>
              <ProjectArtwork id={p.id} cover />
              <div className="standard-project-copy">
                <span className="section-kicker">
                  {p.number} / {p.category}
                </span>
                <h3>{p.name}</h3>
                <h4>{p.subtitle}</h4>
                <p>{p.description}</p>
                <div className="tags">
                  {p.stack.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <details>
                  <summary>
                    {copy.projects.details} <span>+</span>
                  </summary>
                  <ul className="highlights">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </details>
                <ProjectLinks project={p} />
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="standard-section" id="skills">
        <span className="eyebrow">04 / TOOLKIT</span>
        <h2>Tools for the task.</h2>
        <div className="standard-skills">
          {skills.map((s) => (
            <div key={s.category}>
              <h3>{s.category}</h3>
              <div className="tags">
                {s.items.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="standard-certification">
          <Icon name="resume" size={25} />
          <div>
            <span className="section-kicker">CERTIFICATION</span>
            <h3>{profile.certification.name}</h3>
            <p>{profile.certification.topics}</p>
          </div>
        </div>
      </section>
      <section className="standard-section standard-resume" id="resume">
        <div>
          <span className="eyebrow">05 / RESUME</span>
          <h2>{copy.resume.title}</h2>
          <p>{copy.resume.description}</p>
        </div>
        <a className="primary-button" href={profile.resume} download>
          Download PDF ↓
        </a>
        <small>{copy.resume.note}</small>
      </section>
      <section className="standard-section standard-contact" id="contact">
        <span className="eyebrow">06 / SAY HELLO</span>
        <h2>{copy.about.contact}</h2>
        <p>{copy.about.contactBody}</p>
        <a className="email-link" href={`mailto:${profile.email}`}>
          {profile.email} <Icon name="arrow" size={19} />
        </a>
        <div className="standard-socials">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={`tel:${profile.phone.replace(/\s/g, "")}`}>
            {profile.phone}
          </a>
        </div>
      </section>
      <footer className="standard-footer">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </main>
  );
}
