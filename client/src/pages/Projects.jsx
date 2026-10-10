import ProjectIcon from '../components/ProjectIcon.jsx'

// Projects view: at least three projects, each with an image, a short
// description, the author's role, and the resulting outcome.
const PROJECTS = [
  {
    icon: 'orbit',
    title: 'TaskOrbit: Team Planner',
    description:
      'An interactive web app that visualizes project tasks and dependencies as connected nodes, letting teams see how work flows and where bottlenecks form.',
    role: 'Sole developer — designed the data model and the React front end.',
    outcome:
      'Delivered a working planner used by a student project team, praised for making task dependencies easy to understand at a glance.',
  },
  {
    icon: 'prism',
    title: 'Spectra: Colour Analysis Tool',
    description:
      'A browser-based tool that splits an uploaded image into its dominant colour bands and generates an accessible colour palette for designers.',
    role: 'Front-end lead on a three-person team; built the image-processing pipeline and UI.',
    outcome:
      'Adopted internally by two student design teams; reduced palette-selection time from hours to minutes.',
  },
  {
    icon: 'ledger',
    title: 'Ledgerline',
    description:
      'A lightweight personal finance tracker with category budgeting, monthly summaries, and CSV export, built with a component-driven React architecture.',
    role: 'Full-stack developer — built both the React client and the underlying data layer.',
    outcome:
      'Shipped as a portfolio-ready application demonstrating state management, form validation, and responsive design.',
  },
]

function Projects() {
  return (
    <section className="projects">
      <h1>Projects</h1>
      <div className="project-grid">
        {PROJECTS.map((project) => (
          <article className="project-card" key={project.title}>
            <ProjectIcon name={project.icon} />
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <p className="project-role">
              <strong>Role:</strong> {project.role}
            </p>
            <p className="project-outcome">
              <strong>Outcome:</strong> {project.outcome}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
