# Flute Music

Flute Music is a full-stack music web app built with a Next.js frontend and an Express + MongoDB backend. It lets users browse songs and albums, search music, and play audio inside a persistent in-app player. The project also includes admin pages for uploading singles and albums, with media stored in Firebase Storage and metadata stored in MongoDB.

## What This Project Does

- Plays music through a shared Redux-powered audio player.
- Shows a home page with featured songs and albums.
- Lists songs from local JSON data and albums from MongoDB.
- Supports search across songs and albums through the Express API.
- Includes admin tools for uploading singles and albums.
- Uses both deployed backend endpoints and local Next.js API routes.

## Monorepo Structure

```text
react-vt/
├─ frontend/   Next.js 16 app router application
└─ backend/    Express server with MongoDB models and REST endpoints
```

## Tech Stack

### Frontend

- Next.js 16
- React 18
- TypeScript
- Redux Toolkit
- TanStack Query
- Tailwind CSS
- Radix UI
- Embla Carousel
- Firebase Storage

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- CORS
- dotenv

## Main Features

### User-facing

- Home page with carousel-based featured content
- Song list page backed by local JSON seed data
- Album listing page backed by MongoDB data
- Album detail pages with nested tracks
- Search page with debounced search requests
- Global drawer-style audio player with previous/next/play/pause controls

### Admin-facing

- Upload single songs with image + audio
- Upload album cover + multiple tracks
- View uploaded server-side songs
- Read and delete stored documents through Next.js API routes

## Architecture Overview

This repository currently uses two backend patterns:

1. `backend/` runs an Express API connected to MongoDB.
2. `frontend/src/app/api/*` exposes Next.js route handlers that also connect to MongoDB.

In addition, some frontend features call the deployed Express server directly through hardcoded URLs:

- `https://flute-backend.onrender.com/get-urls/albums`
- `https://flute-backend.onrender.com/api/search`
- `https://flute-backend.onrender.com/save-urls/albums`
- `https://flute-backend.onrender.com/save-urls/urls`

That means local development is currently mixed:

- Search and album browsing depend on the deployed Express backend unless those URLs are changed.
- Some admin detail pages use local Next.js API routes under `/api/...`.

## Important Routes

### Frontend pages

- `/` home page
- `/songlist` local songs list
- `/album` album browser
- `/album/[albumId]` album details
- `/search` song and album search
- `/about` placeholder data-fetching page
- `/login` login UI
- `/signup` signup UI
- `/admin` admin landing page
- `/admin/singles` upload single songs
- `/admin/albumadmin` upload albums
- `/admin/serveraudio` list uploaded songs from local API
- `/admin/serveraudio/[audioId]` uploaded song detail page

### Express API routes

- `POST /save-urls/:collection`
- `GET /get-urls/:collection`
- `DELETE /delete/:collection/:id`
- `GET /api/all-data`
- `GET /api/search?q=...&collection=...`

### Next.js API routes

- `POST /api/save-urls/[collection]`
- `GET /api/get-urls/[collection]`
- `GET /api/get-urls/[collection]/[id]`
- `DELETE /api/delete-url-by-id/[collection]/[id]`

## Data Model

The project works with these MongoDB collections:

- `albums`
- `songs`
- `artists`
- `urls`

Typical album shape:

```json
{
  "title": "Album title",
  "imageSrc": ["https://..."],
  "songs": [
    {
      "title": "Track title",
      "audioSrc": "https://..."
    }
  ],
  "timestamp": "2026-03-26T00:00:00.000Z"
}
```

## Environment Variables

### Frontend

Create `frontend/.env.local`:

```env
MONGO_URI=your_mongodb_connection_string
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_value
```

Used for:

- `MONGO_URI`: Next.js API route handlers in `frontend/src/app/api/*`
- `NEXT_PUBLIC_FIREBASE_*`: media uploads from admin pages

### Backend

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
APP_URL=http://localhost:5000
```

## Local Development

There is no root workspace script yet, so run the two apps separately.

### 1. Install dependencies

```bash
cd frontend
pnpm install
```

```bash
cd backend
pnpm install
```

### 2. Start the frontend

```bash
cd frontend
pnpm dev
```

Frontend runs on `http://localhost:3000`.

### 3. Start the backend

```bash
cd backend
node index.js
```

The backend package currently does not define a `dev` script. If you want auto-reload during development, use:

```bash
cd backend
npx nodemon index.js
```

## How The App Flows

### Playback

- Audio state is stored in Redux.
- The global player is mounted in the root layout.
- Selecting a song updates the playlist and opens the drawer player.

### Search

- The search page debounces user input.
- TanStack Query calls the Express `/api/search` endpoint.
- Results are normalized before being passed into the player state.

### Uploads

- Admin pages upload image/audio files to Firebase Storage.
- Public download URLs are then saved to MongoDB through API calls.

## Folder Guide

### `frontend/src/app`

- App Router pages
- layout/providers/store setup
- local API route handlers

### `frontend/src/components`

- app shell
- sidebar
- audio player
- carousel components
- reusable UI primitives

### `frontend/src/features/audio`

- Redux audio slice
- playback types

### `frontend/src/services`

- client-side API helpers for albums and search

### `frontend/src/lib`

- MongoDB connection helper
- dynamic Mongoose model loader

### `backend/`

- Express entry server
- schema/model definitions
- search and CRUD endpoints

## Current Project Notes

- `frontend/README.md` originally contained the default Next.js starter text.
- The login and signup pages are currently UI-only and are not wired to authentication.
- Some frontend code expects deployed backend URLs instead of a configurable local API base URL.
- The Express server contains duplicated `POST /save-urls/:collection` logic and could be cleaned up later.
- The frontend and backend use slightly different data expectations in some places, so keeping the README explicit is important for contributors.

## Recommended Next Improvements

- Add a root `package.json` with workspace scripts for running both apps together.
- Move hardcoded backend URLs into environment variables.
- Consolidate around either the Express API or the Next.js API layer.
- Add authentication if login/signup should become functional.
- Add validation and tests for upload and search flows.

## License

No license file is currently included in this repository.
