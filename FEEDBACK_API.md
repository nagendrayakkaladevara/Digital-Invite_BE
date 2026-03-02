# Feedback API - Frontend Integration Guide

## Overview

Base path: **`/api/feedback`**

---

## Endpoints

### 1. Submit Feedback

**`POST /api/feedback`**

Submits user feedback (description and/or contact number).

#### Request Headers

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |

#### Request Body

| Field | Type | Required | Max Length |
|-------|------|----------|------------|
| `description` | string | No | 2000 chars |
| `number` | string | No | 50 chars |

```json
{
  "description": "Your feedback text here",
  "number": "Optional contact number"
}
```

#### Success Response (201)

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "description": "Your feedback text here",
    "number": "Optional contact number",
    "createdAt": "2025-03-02T12:00:00.000Z"
  }
}
```

#### Error Responses

| Status | Body |
|--------|------|
| 500 | `{ "error": "Failed to save feedback" }` |
| 429 | Rate limit exceeded (20 requests per 15 min per IP) |

---

### 2. List Feedback (Admin)

**`GET /api/feedback`**

Retrieves paginated feedback entries. Use for admin dashboards.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max: 50) |

#### Example Request

```
GET /api/feedback?page=1&limit=20
```

#### Success Response (200)

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "description": "Feedback text",
      "number": "Contact number",
      "createdAt": "2025-03-02T12:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 42
}
```

#### Error Response

| Status | Body |
|--------|------|
| 500 | `{ "error": "Failed to retrieve feedback" }` |

---

## Data Model

| Field | Type | Required | Max Length |
|-------|------|----------|------------|
| `description` | string | No | 2000 |
| `number` | string | No | 50 |
| `createdAt` | string (ISO 8601) | Auto | - |

---

## Important Notes

1. **Rate limiting** – `POST` is limited to 20 requests per 15 minutes per IP
2. **Body size** – Max JSON body size is 10KB
3. **Validation** – Both fields are optional; whitespace-only values are ignored
4. **CORS** – Allowed methods: `GET`, `POST`
5. **Base URL** – Use your API base URL (e.g. `https://your-api.com/api/feedback`)

---

## Example Integration

### Submit Feedback (JavaScript/React)

```javascript
const submitFeedback = async ({ description, number }) => {
  const res = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, number }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to submit');
  return json.data;
};
```

### Fetch Feedback List (Admin)

```javascript
const getFeedbackList = async (page = 1, limit = 20) => {
  const params = new URLSearchParams({ page, limit });
  const res = await fetch(`${API_BASE_URL}/api/feedback?${params}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to fetch');
  return json;
};
```
