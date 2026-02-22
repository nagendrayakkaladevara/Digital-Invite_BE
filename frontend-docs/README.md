# Marriage API – Frontend Documentation

Base URL (development): `http://localhost:5000`

All API routes use **JSON** for request and response bodies. Set `Content-Type: application/json` for requests.

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api` | API welcome |
| POST | `/api/ai/chat` | Get AI response (Gemini or Sarvam) |

---

## 1. Health Check

**`GET /health`**

Check if the server is running.

**Request body:** None

**Response:** `200 OK`

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 2. API Welcome

**`GET /api`**

Simple API info endpoint.

**Request body:** None

**Response:** `200 OK`

```json
{
  "message": "Marriage API v1"
}
```

---

## 3. AI Chat

**`POST /api/ai/chat`**

Send a question and receive an AI-generated response. Supports Gemini and Sarvam models.

### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**

| Field   | Type   | Required | Description |
|---------|--------|----------|-------------|
| `model` | string | Yes      | Model identifier. See [Supported models](#supported-models). |
| `question` | string | Yes   | The user's question. Must be non-empty. |

**Example:**
```json
{
  "model": "gemini",
  "question": "What can you do?"
}
```

### Supported Models

| Value | Provider |
|-------|----------|
| `gemini` | Google Gemini |
| `gemini-3-flash-preview` | Google Gemini |
| `sarvam` | Sarvam AI |
| `sarvam-m` | Sarvam AI |

### Success Response

**Status:** `200 OK`

```json
{
  "success": true,
  "data": {
    "question": "What can you do?",
    "response": "I can help with...",
    "model": "gemini",
    "id": "6748a1b2c3d4e5f6a7b8c9d0",
    "createdAt": "2025-02-22T10:30:00.000Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |
| `data.question` | string | Echo of the sent question |
| `data.response` | string | AI-generated answer |
| `data.model` | string | Model used |
| `data.id` | string | MongoDB document ID |
| `data.createdAt` | string | ISO 8601 timestamp |

### Error Responses

#### `400` Bad Request – Missing or invalid fields

**Missing `model`:**
```json
{
  "error": "model is required and must be a string"
}
```

**Missing `question`:**
```json
{
  "error": "question is required and must be a string"
}
```

**Empty question:**
```json
{
  "error": "question cannot be empty"
}
```

**Unknown model:**
```json
{
  "error": "Unknown model: \"xyz\". Supported: gemini, gemini-3-flash-preview, sarvam, sarvam-m"
}
```

#### `500` Internal Server Error

AI provider error:
```json
{
  "error": "Failed to get AI response",
  "details": "Error message (only in development)"
}
```

#### `503` Service Unavailable

API keys not configured:
```json
{
  "error": "AI service temporarily unavailable",
  "details": "GEMINI_API_KEY is not configured in environment variables"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200  | Success |
| 400  | Bad Request (validation / invalid model) |
| 500  | Internal Server Error |
| 503  | Service Unavailable (e.g. missing API keys) |

---

## Example: JavaScript/TypeScript

```typescript
// AI Chat
const response = await fetch('http://localhost:5000/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gemini',
    question: 'What can you do?',
  }),
});

const data = await response.json();

if (!response.ok) {
  console.error(data.error);
  return;
}

console.log(data.data.response);
```

---

## Example: cURL

```bash
# Health check
curl http://localhost:5000/health

# AI Chat
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"model": "gemini", "question": "What can you do?"}'
```
