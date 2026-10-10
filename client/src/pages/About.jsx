// About view: name, profile image, short biography, and a link
// to a downloadable PDF résumé.
function About() {
  return (
    <section className="about">
      <div className="about-grid">
        <img
          src="/profile_pic.jpg"
          alt="Michael Johnson"
          className="profile-photo"
        />
        <div>
          <h1>Michael Johnson</h1>
          <p className="role">Full-Stack Developer &amp; Lifelong Learner</p>
          <p>
            I'm a developer with a strong analytical background, applied to
            building clean, functional web applications. I enjoy reasoning
            from first principles when designing software &mdash; starting
            from a clear problem statement and building up to a working,
            well-tested solution.
          </p>
          <p>
            Outside of formal coursework, I maintain an interest in UI
            design, applied problem-solving, and open-source tooling. I'm
            currently focused on strengthening my front-end engineering
            skills, particularly with React and modern deployment
            workflows.
          </p>
          <a
            href="/resume.pdf"
            className="btn-secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Résumé (PDF)
          </a>
        </div>
      </div>
    </section>
  )
}

export default About
