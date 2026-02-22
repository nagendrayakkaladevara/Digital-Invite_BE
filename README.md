# Marriage Backend API

Express + TypeScript + MongoDB backend project.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   copy .env.example .env
   ```

3. Update `.env` with your MongoDB URI (e.g. `mongodb://localhost:27017/marriage` or Atlas connection string).

## Scripts

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Build for production
- `npm start` - Run production build
- `vercel dev` - Run locally with Vercel (simulates serverless)

## Deploy to Vercel

This project is configured for Vercel's serverless platform:

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   - Push to GitHub and [import the project on Vercel](https://vercel.com/new)
   - Or run `vercel` in the project root

3. **Set environment variables** in Vercel Dashboard → Project → Settings → Environment Variables:
   - `MONGODB_URI` – MongoDB connection string
   - `GEMINI_API_KEY` – Gemini API key (for AI chat)
   - `SARVAM_API_KEY` – Sarvam API key (for AI chat)

4. Your API will be available at `https://your-project.vercel.app`:
   - `GET /health` – Health check
   - `GET /api` – API info
   - `POST /api/ai/chat` – AI chat endpoint

## Project Structure

```
src/
├── config/     # DB connection, etc.
├── models/     # Mongoose models
├── routes/     # API route handlers
└── index.ts    # Entry point
```
