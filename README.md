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

## Project Structure

```
src/
├── config/     # DB connection, etc.
├── models/     # Mongoose models
├── routes/     # API route handlers
└── index.ts    # Entry point
```
