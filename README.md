# TAC - Try Any Career (MVP)

A full-stack MVP where students explore careers through short lessons, interactive simulations, and mini-games.

## Tech Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui style components, Framer Motion, Recharts
- Backend: Node.js, Express.js, MongoDB + Mongoose, JWT auth, bcrypt password hashing
- Deployment targets: Vercel (frontend), Railway (backend), MongoDB Atlas (database)

## Project Structure

```txt
Project EXPO 2026/
├─ frontend/
│  ├─ app/
│  │  ├─ (auth)/login/page.tsx
│  │  ├─ (auth)/signup/page.tsx
│  │  ├─ dashboard/page.tsx
│  │  ├─ careers/page.tsx
│  │  ├─ career/[id]/page.tsx
│  │  ├─ trial/[career]/page.tsx
│  │  ├─ result/page.tsx
│  │  ├─ profile/page.tsx
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ globals.css
│  │  └─ providers.tsx
│  ├─ components/
│  │  ├─ ui/ (button, card, input, badge, progress, textarea, separator)
│  │  ├─ games/ (all mini-games)
│  │  ├─ app-navbar.tsx
│  │  ├─ auth-provider.tsx
│  │  ├─ protected-route.tsx
│  │  ├─ page-shell.tsx
│  │  └─ trial-game-stage.tsx
│  ├─ lib/
│  │  ├─ api.ts
│  │  ├─ types.ts
│  │  └─ utils.ts
│  ├─ .env.example
│  ├─ components.json
│  ├─ package.json
│  ├─ tailwind.config.ts
│  └─ tsconfig.json
├─ backend/
│  ├─ src/
│  │  ├─ config/ (env.ts, db.ts)
│  │  ├─ middleware/ (auth.ts, notFound.ts, errorHandler.ts)
│  │  ├─ models/ (User, Career, Trial, Progress, Result)
│  │  ├─ data/seedData.ts
│  │  ├─ services/ (seedService.ts, compatibilityService.ts)
│  │  ├─ controllers/ (auth, career, trial, result)
│  │  ├─ routes/ (auth, careers, trials, results)
│  │  ├─ types/express/index.d.ts
│  │  ├─ app.ts
│  │  └─ server.ts
│  ├─ .env.example
│  ├─ package.json
│  └─ tsconfig.json
├─ .gitignore
└─ README.md
```

## Core User Flow Implemented

1. User visits homepage
2. User signs up/logs in (JWT)
3. User explores careers
4. User starts a career trial
5. User completes lessons/tasks/games/quiz/project
6. User gets compatibility report
7. User sees dashboard analytics and suggestions

## Backend Setup (Local)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Required backend `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

## Frontend Setup (Local)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

### Required frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Routes

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Careers
- `GET /api/careers`
- `GET /api/careers/:id` (id or slug)

### Trials + Progress
- `GET /api/trials/:career`
- `GET /api/trials/:career/progress` (protected)
- `POST /api/trials/:career/progress` (protected)

### Results
- `POST /api/results` (protected)
- `GET /api/results` (protected)
- `GET /api/results/latest` (protected)

## Database Models

- `User`: name, email, password, role
- `Career`: title, slug, description, difficulty, icon
- `Trial`: careerId, tasks[] (day-wise lesson/task/game/quiz/project)
- `Progress`: userId, careerId, currentDay, completedDays, taskScore, quizScore, gameScore, status
- `Result`: userId, careerId, score, strengths, weakness, breakdown, suggestedCareers

## Deployment Instructions

## 1) MongoDB Atlas
1. Create a cluster in MongoDB Atlas.
2. Create DB user and allow network access (or Railway/Vercel IP ranges).
3. Copy connection string into backend `MONGODB_URI`.

## 2) Railway (Backend)
1. Push project to GitHub.
2. Create new Railway project from repo.
3. Set root directory to `backend`.
4. Add environment variables:
   - `PORT=5000`
   - `MONGODB_URI=...`
   - `JWT_SECRET=...`
   - `CLIENT_URL=https://<your-vercel-domain>`
5. Start command: `npm run start`
6. Build command: `npm run build`
7. Deploy and copy public backend URL.

## 3) Vercel (Frontend)
1. Import repository into Vercel.
2. Set root directory to `frontend`.
3. Add env var:
   - `NEXT_PUBLIC_API_URL=https://<your-railway-backend>/api`
4. Deploy.
5. Update Railway `CLIENT_URL` to Vercel domain and redeploy backend if needed.

## Notes

- Backend auto-seeds default careers/trials on first startup.
- Mentor booking UI is intentionally a placeholder (no backend logic yet).
- Dashboard and result pages use Recharts for visual reporting.
