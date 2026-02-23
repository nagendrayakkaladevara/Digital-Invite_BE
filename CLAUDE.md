# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot reload via ts-node-dev)
npm run dev

# Production build (compiles src/ → dist/)
npm run build

# Run production build
npm start

# Clean compiled output
npm run clean
```

There is no test suite configured in this project.

## Architecture

This is a **TypeScript + Express + MongoDB** backend deployed as a serverless app on Vercel.

### Entry Points

- **Local dev**: `src/index.ts` — starts an Express HTTP server on `PORT` (default 5000)
- **Vercel/serverless**: `api/` directory is used by Vercel's serverless runtime; `src/app.ts` exports the Express `app` as the default export for this

### Request Flow

```
POST /api/ai/chat
  → src/routes/index.ts   (mounts /ai subrouter)
  → src/routes/ai.ts      (validates body: { model, question })
  → src/services/aiService.ts  (dispatches to Gemini or Sarvam API)
  → src/models/AIChatHistory.ts  (persists Q&A to MongoDB)
  → returns { success, data: { question, response, model, id, createdAt } }
```

### AI Service (`src/services/aiService.ts`)

Two AI providers are supported, selected by the `model` field in the request body:

| model value | Provider | Env var |
|---|---|---|
| `gemini`, `gemini-3-flash-preview` | Google Gemini (`@google/genai`) | `GEMINI_API_KEY` |
| `sarvam`, `sarvam-m` | Sarvam AI (REST API) | `SARVAM_API_KEY` |

Both providers receive a system prompt from `src/config/weddingContext.ts` that makes the AI act as a wedding assistant for Sai Nagendra & Sushma's wedding (March 2026).

### MongoDB Connection (`src/config/db.ts`)

Uses a module-level cache (`global.mongoose`) to reuse connections across serverless function invocations — the standard pattern for Mongoose on Vercel/Lambda. `connectDB()` is called via Express middleware on every request in `app.ts`, and directly before server start in `index.ts`.

### Data Model

`AIChatHistory` (MongoDB collection) stores every Q&A pair with fields: `question`, `response`, `aiModel`, `createdAt`.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```
PORT=5000
MONGODB_URI=<MongoDB connection string>
GEMINI_API_KEY=<Google Gemini API key>
SARVAM_API_KEY=<Sarvam AI API key>
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api` | API info |
| POST | `/api/ai/chat` | AI chat (body: `{ model, question }`) |

## Adding Wedding Context

All wedding-specific information (event schedule, venue, locations) lives in `src/config/weddingContext.ts`. The `WEDDING_INFO` object and `getWeddingSystemPrompt()` function are the only places to update when wedding details change.
