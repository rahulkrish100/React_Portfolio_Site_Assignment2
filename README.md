# MyPortfolio — Full-Stack MERN Portfolio (Assignment 3)

React (Vite) client + Node/Express REST API + MongoDB (Mongoose), with JWT authentication,
protected routes and role-based authorization (`admin` vs `user`).

## Structure
```
├── client/                      # React app (http://localhost:5173)
│   └── src/
│       ├── lib/api.js           # fetch wrapper: base URL, Bearer token, error handling
│       ├── lib/validators.js    # client-side validation (mirrors server rules)
│       ├── lib/useApiList.js    # list loading hook (loading / error state)
│       ├── context/AuthContext.jsx   # sign-up / sign-in / sign-out, current user + role
│       ├── components/
│       │   ├── ProtectedRoute.jsx    # signed-in and admin-only route guards
│       │   ├── RecordForm.jsx        # config-driven validated form
│       │   ├── ResourceManager.jsx   # list + create / edit / delete UI
│       │   └── Status.jsx            # loading, alerts, empty states
│       ├── config/resources.js       # fields for projects, qualifications, contacts
│       └── pages/               # Home, About, Projects, Education, Services, Contact,
│                                # SignIn, SignUp, Messages, Admin, NotFound
├── server/
│   ├── config/db.js             # Mongoose connection
│   ├── config/seedAdmin.js      # creates/syncs the admin from .env on startup
│   ├── models/                  # Contact, Project, Qualification, User
│   ├── controllers/             # CRUD + auth logic
│   ├── routes/                  # /api/* routers
│   ├── middleware/              # requireAuth (JWT), requireAdmin, validation
│   └── scripts/                 # hash-password.js, seed.js
├── server.js                    # Express entry point (http://localhost:5000)
├── postman_collection.json      # API tests (admin, regular user, rejected requests)
└── .env.example                 # every setting, placeholders only
```

## Setup
1. Install MongoDB locally (or use MongoDB Atlas). Database name: `Portfolio`.
2. Install dependencies: `npm run install-all`
3. Create your environment file: `cp .env.example .env` (Windows: `copy .env.example .env`)
4. Generate the admin password hash: `npm run hash-password`
   (type the password at the hidden prompt; paste the printed `ADMIN_PASSWORD_HASH='…'` line into `.env`)
5. Set `JWT_SECRET` to a long random string:
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
6. Seed the admin and sample content: `npm run seed`
7. Run client + API together: `npm run dev`
   - Client: http://localhost:5173 · API: http://localhost:5000

In development Vite proxies `/api` to port 5000, so `client/.env` is optional. For a deployed
client set `VITE_API_URL` (see `client/.env.example`).

## Authentication and authorization

### Accounts and roles
| Role | How it is created | Can do |
|---|---|---|
| `admin` | Seeded from `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`) on every server start and by `npm run seed` | Everything: create, update, delete projects, qualifications and contacts; manage users |
| `user` | Public sign-up (`POST /api/auth/signup` or the **Sign up** page) | View projects, qualifications and contact messages; no changes |

- Sign-up **always** creates a `user`; a `role` field in the request body is ignored.
- The admin password is never stored in plain text: `.env` holds only a bcrypt hash, and the
  seeder refuses anything that is not a bcrypt hash. Rotate it by generating a new hash and restarting.
- `.env` is git-ignored. Only `.env.example` (placeholders) is committed.

### API access rules
| Endpoint | Public | Signed-in user | Admin |
|---|---|---|---|
| `GET /api/projects`, `GET /api/qualifications` (+ `/:id`) | ✓ | ✓ | ✓ |
| `POST / PUT / DELETE` projects & qualifications | 401 | 403 | ✓ |
| `POST /api/contacts` (website contact form) | ✓ | ✓ | ✓ |
| `GET /api/contacts` (+ `/:id`) | 401 | ✓ | ✓ |
| `PUT / DELETE /api/contacts/:id` | 401 | 403 | ✓ |
| `/api/users/*` | 401 | 403 | ✓ |
| `POST /api/auth/signup`, `POST /api/auth/signin` | ✓ | ✓ | ✓ |
| `GET /api/auth/me`, `GET or POST /api/auth/signout` | 401 | ✓ | ✓ |

`401` = missing, invalid or expired token. `403` = valid token but not an administrator.
`DELETE /api/<resource>` (delete all) additionally needs `ALLOW_DELETE_ALL=true`; leave it `false`.

Send the token as `Authorization: Bearer <token>`.

### Frontend routes
| Route | Access |
|---|---|
| `/`, `/about`, `/projects`, `/education`, `/services`, `/contact`, `/signin`, `/signup` | Public |
| `/messages` | Signed-in users (read-only for `user`; edit/delete for `admin`) |
| `/admin` | Admin only (create / edit / delete projects, qualifications, contacts). Regular users see *Access denied* |

Route guards in React only control what is shown. The API enforces every rule independently,
so hiding a button is never the only protection.

### Token storage
After sign-in or sign-up the client stores `{ token, user }` in **`localStorage`** under the key
`portfolio.auth` (`client/src/lib/api.js`):

- **Why:** the session survives page refreshes and the token is easy to attach as a Bearer header.
- **Checks:** on load the client discards an expired token and re-validates the token with
  `GET /api/auth/me` (which also refreshes the role). Any `401` from the API clears the session,
  and a timer signs the user out the moment the token expires.
- **Trade-off:** `localStorage` is readable by JavaScript, so an XSS bug could expose the token.
  Mitigations: React escapes all rendered data (no `dangerouslySetInnerHTML`), no third-party
  scripts, and tokens are short-lived (`JWT_EXPIRES_IN`, default 1 day). An HttpOnly cookie
  would remove this risk but needs CSRF protection; that's out of scope for this assignment.
- Only the user's own token and public profile (name, email, role) are stored. No passwords or
  server secrets ever reach the browser.

### Sign-out design
JWTs are **stateless**: the server keeps no session list, so there is nothing to delete on the server.
Sign-out works like this:
1. The client calls `POST /api/auth/signout` (`GET` is also accepted). The server confirms.
2. The client deletes `portfolio.auth` from `localStorage` and clears the in-memory user,
   even if the request fails. Without the token, later requests are anonymous and protected
   routes return `401`.
3. Any copy of the token stays technically valid until it expires, which is why the expiry is short.
   Immediate server-side revocation would need a token deny-list (or short access tokens plus
   refresh tokens). That's left out to keep the design stateless.

## Data models
- **contacts**: firstName, lastName, phone, email, message (+ timestamps)
- **projects / qualifications**: title, completion (date), description (+ timestamps)
- **users**: name, email, passwordHash (bcrypt, never returned), role, created, updated

## Testing with Postman
Import `postman_collection.json`. In Postman's collection variables set `adminEmail` and
`adminPassword` as **current values** (they stay local; don't commit or screenshot them),
then run the folders in order:

1. **Auth**: sign up a regular user, sign in as user and as admin (tokens saved automatically)
2. **Authorization checks**: requests with no token (`401`) and as a regular user (`403`)
3–5. **Projects / Qualifications / Contacts**: full admin CRUD plus regular-user read-only checks
6. **Users**: admin-only listing (verifies no password hashes are returned)
7. **Sign out**

Every request has a test asserting the expected status code. If you rerun the collection,
change `userEmail` first, or *Sign up* returns `409 Email already registered`.
