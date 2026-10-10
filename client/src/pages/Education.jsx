// Education view: relevant educational and professional qualifications,
// including dates and credentials earned.
const EDUCATION = [
  {
    years: '2023 – 2026',
    credential: 'BSc (Hons) Computer Science',
    institution: 'Trinity Institute of Technology',
    details: 'Focus on software engineering, algorithms, and web development.',
  },
  {
    years: '2022',
    credential: 'Full-Stack Web Development Certificate',
    institution: 'Online Professional Academy',
    details: 'Intensive program covering React, Node.js, REST APIs, and cloud deployment.',
  },
  {
    years: '2021',
    credential: 'Foundations of Mathematics & Physics',
    institution: 'Cambridge Preparatory College',
    details: 'Coursework in calculus, mechanics, and optics, forming the basis for later analytical work.',
  },
]

function Education() {
  return (
    <section className="education">
      <h1>Education</h1>
      <ol className="timeline">
        {EDUCATION.map((item) => (
          <li key={item.credential}>
            <span className="timeline-year">{item.years}</span>
            <div>
              <h2>{item.credential}</h2>
              <p className="institution">{item.institution}</p>
              <p>{item.details}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default Education
