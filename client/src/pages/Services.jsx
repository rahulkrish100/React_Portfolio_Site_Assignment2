import ProjectIcon from '../components/ProjectIcon.jsx'

// Services view: describes the services offered, each with an icon.
const SERVICES = [
  {
    icon: 'orbit',
    title: 'Web Application Development',
    description:
      'Building responsive, accessible web applications with React, from initial component architecture through to deployment.',
  },
  {
    icon: 'prism',
    title: 'Front-End Consulting',
    description:
      'Reviewing existing interfaces for usability and performance, and recommending practical, incremental improvements.',
  },
  {
    icon: 'ledger',
    title: 'Mobile-Friendly Prototyping',
    description:
      'Rapidly prototyping mobile-responsive layouts and interactive flows to validate ideas before full development.',
  },
]

function Services() {
  return (
    <section className="services">
      <h1>Services</h1>
      <div className="service-grid">
        {SERVICES.map((service) => (
          <article className="service-card" key={service.title}>
            <ProjectIcon name={service.icon} size={70} />
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
