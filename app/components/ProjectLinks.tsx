import { type Project } from "../data/profile";
export default function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="project-links">
      {(project.github || project.live) && (
        <div className="about-actions">
          {project.github && (
            <a
              className="primary-button"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              className="text-button"
              href={project.live}
              target="_blank"
              rel="noreferrer"
            >
              Live demo ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}
