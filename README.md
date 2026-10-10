# MyPortfolio — MERN Portfolio (Assignment 2)

React (Vite) client + Node/Express backend + MongoDB (Mongoose) with REST APIs and JWT authentication.

## Structure
```
MyPortfolio/
├── client/                 # Assignment 1 React app (http://localhost:5173)
├── server/
│   ├── config/db.js        # Mongoose connection
│   ├── models/             # Contact, Project, Qualification, User
│   ├── controllers/        # CRUD + auth logic
│   ├── routes/             # /api/* routers
│   └── middleware/         # JWT auth, admin check, validation
├── server.js               # Express entry point (http://localhost:5000)
├── postman_collection.json # Import into Postman / Thunder Client
├── .env.example
└── package.json            # "dev" runs client + server together
```

## Setup
1. Install MongoDB locally (or use MongoDB Atlas) — database name: `Portfolio`.
2. `copy .env.example .env` (Windows) / `cp .env.example .env`, then edit `MONGODB_URI` and `JWT_SECRET`.
3. Install everything: `npm run install-all`
4. Run client + backend together: `npm run dev`
   - Client: http://localhost:5173  ·  API: http://localhost:5000 (welcome JSON)

## REST API
| Resource | Routes | Access |
|---|---|---|
| `/api/contacts` | GET, GET/:id, POST, PUT/:id, DELETE/:id | POST public; others need JWT |
| `/api/projects` | same five | GET public; writes need JWT |
| `/api/qualifications` | same five | GET public; writes need JWT |
| `/api/users` | same five | all need JWT |
| `/api/auth` | POST `/signup`, POST `/signin`, GET `/signout`, GET `/me` | signout/me need JWT |

`DELETE /api/<resource>` (delete all) requires an **admin** JWT **and** `ALLOW_DELETE_ALL=true` in `.env` — use only for testing. The first user to sign up becomes `admin`.

Send the token as `Authorization: Bearer <token>`.

## Models
- **contacts**: firstName, lastName, phone, email, message
- **projects / qualifications**: title, completion, description
- **users**: name, email, passwordHash (bcrypt, never returned), created, updated, role

## Sign-out design
JWTs are stateless: sign-out means the client deletes the token; `GET /api/auth/signout` just confirms. Tokens expire after `JWT_EXPIRES_IN` (default 1d).

## Testing
Import `postman_collection.json`. Run **Sign up** → **Sign in** (token saved automatically) → the CRUD requests. Screenshot each request/response/status.
