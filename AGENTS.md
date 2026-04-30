# Repository Guidelines

## Project Structure & Module Organization

This repository is a two-app music project. `frontend/` contains the Next.js 16 App Router app: pages and API routes in `frontend/src/app`, reusable components in `frontend/src/components`, Redux audio state in `frontend/src/features/audio`, hooks in `frontend/src/hooks`, service helpers in `frontend/src/services`, and MongoDB utilities in `frontend/src/lib`. Static seed data lives in `frontend/src/arrays`; route CSS is under `frontend/src/app/css`.

`backend/` contains the Express/Mongoose server entry point in `backend/index.js`. Both apps keep their own `package.json` and `pnpm-lock.yaml`; run commands from the relevant app directory.

## Build, Test, and Development Commands

Frontend:

- `cd frontend && pnpm install` installs frontend dependencies.
- `cd frontend && pnpm dev` starts Next.js at `http://localhost:3000`.
- `cd frontend && pnpm build` creates a production build.
- `cd frontend && pnpm start` serves the production build.
- `cd frontend && pnpm lint` runs the configured Next.js lint command.

Backend:

- `cd backend && pnpm install` installs API dependencies.
- `cd backend && pnpm start` runs `node index.js`.
- `cd backend && npx nodemon index.js` runs the API with reloads during development.

## Coding Style & Naming Conventions

Use TypeScript and TSX in the frontend. Prefer functional React components, hooks, and the existing `@/*` path aliases from `components.json`. Component files use both PascalCase (`Audioplayer.tsx`) and kebab case (`album-card.tsx`); match nearby code. Keep Tailwind classes in JSX, and reuse UI primitives from `frontend/src/components/ui` before adding controls.

Backend code is plain CommonJS JavaScript. Keep route handlers small, validate request inputs, and avoid duplicating collection-specific logic.

## Testing Guidelines

No test framework or coverage target is configured. For behavioral changes, add focused tests when introducing a test setup, and document the command here. Until then, verify with `pnpm lint`, `pnpm build`, and manual checks of affected routes such as `/`, `/album`, `/search`, and admin upload pages.

## Commit & Pull Request Guidelines

Recent commits use short, imperative summaries such as `Refactor album admin header and UI tweaks`. Follow that style: concise, present-tense, and scoped.

Pull requests should include a brief description, affected frontend/backend areas, required environment variables, manual verification steps, linked issues when available, and screenshots or screen recordings for UI changes.

## Security & Configuration Tips

Do not commit `.env` files or secrets. Frontend local variables belong in `frontend/.env.local`; backend variables belong in `backend/.env`. Keep MongoDB, Firebase, Cloudinary, and deployed API URLs configurable rather than hardcoded in new code.
