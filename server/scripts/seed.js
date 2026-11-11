// One-off seeding:  npm run seed
//  1. Creates / syncs the administrator account from .env
//  2. Adds sample projects and qualifications ONLY if those collections are empty
require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('../config/db')
const seedAdmin = require('../config/seedAdmin')
const Project = require('../models/Project')
const Qualification = require('../models/Qualification')

const PROJECTS = [
  {
    title: 'TaskOrbit: Team Planner',
    completion: '2025-04-30',
    description:
      'An interactive web app that visualizes project tasks and dependencies as connected nodes, letting teams see how work flows and where bottlenecks form. Role: sole developer (data model and React front end). Outcome: used by a student project team to track task dependencies.',
  },
  {
    title: 'Spectra: Colour Analysis Tool',
    completion: '2025-08-15',
    description:
      'A browser-based tool that splits an uploaded image into its dominant colour bands and generates an accessible colour palette for designers. Role: front-end lead on a three-person team. Outcome: adopted by two student design teams, cutting palette selection from hours to minutes.',
  },
  {
    title: 'Ledgerline',
    completion: '2025-12-01',
    description:
      'A lightweight personal finance tracker with category budgeting, monthly summaries, and CSV export, built with a component-driven React architecture. Role: full-stack developer. Outcome: a portfolio-ready app demonstrating state management and form validation.',
  },
]

const QUALIFICATIONS = [
  {
    title: 'BSc (Hons) Computer Science — Trinity Institute of Technology',
    completion: '2026-06-30',
    description: 'Focus on software engineering, algorithms, and web development.',
  },
  {
    title: 'Full-Stack Web Development Certificate — Online Professional Academy',
    completion: '2022-12-15',
    description: 'Intensive program covering React, Node.js, REST APIs, and cloud deployment.',
  },
  {
    title: 'Foundations of Mathematics & Physics — Cambridge Preparatory College',
    completion: '2021-06-30',
    description: 'Coursework in calculus, mechanics, and optics, forming the basis for later analytical work.',
  },
]

async function seedIfEmpty(Model, docs, label) {
  const count = await Model.countDocuments()
  if (count > 0) return console.log(`${label}: ${count} existing record(s), sample data skipped`)
  await Model.insertMany(docs)
  console.log(`${label}: inserted ${docs.length} sample record(s)`)
}

;(async () => {
  await connectDB()
  await seedAdmin()
  await seedIfEmpty(Project, PROJECTS, 'projects')
  await seedIfEmpty(Qualification, QUALIFICATIONS, 'qualifications')
  await mongoose.disconnect()
})().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
