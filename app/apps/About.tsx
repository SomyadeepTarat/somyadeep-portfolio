import Image from "next/image";
import { profile, skills, copy } from "../data/profile";
import type { AppProps } from "../desktop/registry";
import { Icon } from "../desktop/icons";
export default function About({ onNavigate }: AppProps) {
  return (
    <div className="about-app">
      <aside className="about-sidebar">
        <Image
          src={profile.portrait}
          width={180}
          height={225}
          alt="Portrait of Somyadeep Tarat"
          priority
        />
        <div className="profile-name">{profile.name}</div>
        <p>{profile.role}</p>
        <span className="location">
          <span>⌖</span> {profile.location || copy.about.locationTodo}
        </span>
        <div className="profile-links">
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <Icon name="arrow" size={12} />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Icon name="arrow" size={12} />
          </a>
          <a href={`mailto:${profile.email}`}>
            Email <Icon name="arrow" size={12} />
          </a>
        </div>
      </aside>
      <div className="about-main">
        <span className="eyebrow">{copy.about.eyebrow}</span>
        <h2>{profile.headline}</h2>
        <p>{profile.bio}</p>
        <div className="education-card">
          <span className="section-kicker">{copy.about.education}</span>
          <h3>{profile.education.institution}</h3>
          <p>{profile.education.degree}</p>
          <div>
            <span>{profile.education.dates}</span>
            <strong>CGPA {profile.education.cgpa}</strong>
          </div>
        </div>
        <div className="about-actions">
          <button
            className="primary-button"
            onClick={() => onNavigate("projects")}
          >
            Explore my work <Icon name="arrow" size={13} />
          </button>
          <button className="text-button" onClick={() => onNavigate("resume")}>
            View resume →
          </button>
        </div>
        <details className="skills-disclosure">
          <summary>
            Skills & certification <span>+</span>
          </summary>
          {skills.map((group) => (
            <div className="skill-group" key={group.category}>
              <h3>{group.category}</h3>
              <div className="tags">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
          <div className="certification">
            <span className="section-kicker">Certification</span>
            <h3>{profile.certification.name}</h3>
            <p>{profile.certification.topics}</p>
          </div>
        </details>
      </div>
    </div>
  );
}
