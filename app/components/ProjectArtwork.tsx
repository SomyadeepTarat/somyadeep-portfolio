import Image from "next/image";
import { projects } from "../data/profile";
/** Original schematic artwork, not product screenshots. */
export default function ProjectArtwork({
  id,
  cover = false,
}: {
  id: string;
  cover?: boolean;
}) {
  const project = projects.find((p) => p.id === id);
  if (cover)
    return (
      <div className="project-art project-cover" aria-hidden="true">
        <span className="project-cover-number">{project?.number}</span>
        <span className="project-cover-category">{project?.category}</span>
        <span className="project-cover-arrow">↗</span>
      </div>
    );
  if (project?.screenshot)
    return (
      <div className="project-art project-screenshot">
        <Image
          src={project.screenshot}
          width={800}
          height={450}
          alt={`${project.name} screenshot`}
        />
      </div>
    );
  return (
    <div className={`project-art art-${id}`} aria-hidden="true">
      {id === "atlas" ? (
        <>
          <div className="atlas-orbit orbit-one" />
          <div className="atlas-orbit orbit-two" />
          <div className="atlas-orbit orbit-three" />
          <span className="atlas-core">
            a<span>✦</span>
          </span>
          <i className="art-dot dot-one" />
          <i className="art-dot dot-two" />
        </>
      ) : id === "kew" ? (
        <>
          <div className="kew-house">
            <span />
            <span />
            <span />
          </div>
          <div className="kew-ground" />
          <span className="kew-sun" />
          <span className="kew-leaf">⌁</span>
        </>
      ) : id !== "fraudgraph" ? (
        <div className="project-monogram">
          <span>{project?.number}</span>
          <strong>{project?.name}</strong>
          <small>{project?.category}</small>
        </div>
      ) : (
        <svg viewBox="0 0 300 170" fill="none">
          {[
            [40, 85, 110, 40],
            [40, 85, 100, 135],
            [110, 40, 150, 85],
            [100, 135, 150, 85],
            [150, 85, 215, 30],
            [150, 85, 225, 130],
            [215, 30, 265, 80],
            [225, 130, 265, 80],
            [110, 40, 215, 30],
            [100, 135, 225, 130],
          ].map(([x1, y1, x2, y2], i) => (
            <path
              key={i}
              d={`M${x1} ${y1}L${x2} ${y2}`}
              stroke="currentColor"
              opacity=".3"
            />
          ))}
          {[
            [40, 85],
            [110, 40],
            [100, 135],
            [150, 85],
            [215, 30],
            [225, 130],
            [265, 80],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={i === 3 ? 23 : 12}
                fill="currentColor"
                opacity=".1"
              />
              <circle
                cx={cx}
                cy={cy}
                r={i === 3 ? 8 : 4}
                fill="currentColor"
                opacity=".8"
              />
            </g>
          ))}
        </svg>
      )}
      <span className="art-label">CONCEPT STUDY / {id.toUpperCase()}</span>
    </div>
  );
}
