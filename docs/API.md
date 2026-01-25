# Keepo Clone - API Reference

## Overview

The API is built using Next.js API Routes (App Router). All endpoints are prefixed with `/api`.

---

## Authentication Endpoints

Authentication is handled by NextAuth.js.

### `GET /api/auth/[...nextauth]`

NextAuth.js catch-all route for:

- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get session
- `/api/auth/providers` - List providers
- `/api/auth/callback/[provider]` - OAuth callback

---

## User API

### `GET /api/user`

Get current authenticated user profile.

**Response:**

```json
{
  "id": "cuid",
  "email": "user@example.com",
  "name": "John Doe",
  "image": "https://...",
  "subscription": {
    "plan": "FREE",
    "status": "ACTIVE"
  }
}
```

### `PATCH /api/user`

Update current user profile.

**Request Body:**

```json
{
  "name": "New Name",
  "image": "https://..."
}
```

### `DELETE /api/user`

Delete current user account and all associated data.

---

## Page API

### `GET /api/pages`

Get all pages for authenticated user.

**Response:**

```json
{
  "pages": [
    {
      "id": "cuid",
      "username": "johndoe",
      "displayName": "John Doe",
      "published": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### `POST /api/pages`

Create a new page.

**Request Body:**

```json
{
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": "Welcome to my page"
}
```

**Response:** `201 Created`

```json
{
  "id": "cuid",
  "username": "johndoe",
  ...
}
```

### `GET /api/pages/[pageId]`

Get page by ID (authenticated, for editing).

### `PATCH /api/pages/[pageId]`

Update page.

**Request Body:**

```json
{
  "displayName": "Updated Name",
  "bio": "Updated bio",
  "theme": { "palette": "sunset" },
  "published": true
}
```

### `DELETE /api/pages/[pageId]`

Delete page.

---

## Block API

### `GET /api/pages/[pageId]/blocks`

Get all blocks for a page.

**Response:**

```json
{
  "blocks": [
    {
      "id": "cuid",
      "type": "LINK",
      "order": 0,
      "visible": true,
      "content": {
        "url": "https://example.com",
        "label": "My Website"
      }
    }
  ]
}
```

### `POST /api/pages/[pageId]/blocks`

Create a new block.

**Request Body:**

```json
{
  "type": "LINK",
  "content": {
    "url": "https://example.com",
    "label": "My Website"
  }
}
```

### `PATCH /api/pages/[pageId]/blocks/[blockId]`

Update a block.

### `DELETE /api/pages/[pageId]/blocks/[blockId]`

Delete a block.

### `PUT /api/pages/[pageId]/blocks/reorder`

Reorder blocks.

**Request Body:**

```json
{
  "blockIds": ["id1", "id2", "id3"]
}
```

---

## Public Page API

### `GET /api/p/[username]`

Get public page data for rendering.

**Response:**

```json
{
  "page": {
    "username": "johndoe",
    "displayName": "John Doe",
    "bio": "Welcome!",
    "avatar": "https://...",
    "theme": { ... }
  },
  "blocks": [
    {
      "id": "cuid",
      "type": "LINK",
      "content": { ... }
    }
  ]
}
```

### `POST /api/p/[username]/view`

Track page view (called client-side).

**Request Body:**

```json
{
  "visitorId": "fingerprint",
  "referrer": "https://instagram.com"
}
```

### `POST /api/p/[username]/click`

Track block click.

**Request Body:**

```json
{
  "blockId": "cuid",
  "visitorId": "fingerprint"
}
```

---

## Analytics API

### `GET /api/analytics/[pageId]`

Get analytics for a page (requires Plus subscription).

**Query Parameters:**

- `period`: `7d` | `30d` | `90d` | `all`

**Response:**

```json
{
  "summary": {
    "totalViews": 1234,
    "uniqueVisitors": 890,
    "totalClicks": 456
  },
  "viewsByDay": [{ "date": "2024-01-01", "views": 50 }],
  "clicksByBlock": [
    { "blockId": "cuid", "label": "My Website", "clicks": 100 }
  ],
  "topReferrers": [{ "referrer": "instagram.com", "count": 500 }],
  "topCountries": [{ "country": "BR", "count": 800 }]
}
```

---

## Subscription API

### `POST /api/subscription/checkout`

Create Stripe checkout session.

**Request Body:**

```json
{
  "plan": "PLUS_MONTHLY" | "PLUS_ANNUAL"
}
```

**Response:**

```json
{
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

### `POST /api/subscription/portal`

Create Stripe customer portal session (manage subscription).

**Response:**

```json
{
  "portalUrl": "https://billing.stripe.com/..."
}
```

### `POST /api/webhooks/stripe`

Stripe webhook handler (internal).

Handles events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

---

## Username Validation API

### `GET /api/username/check`

Check if username is available.

**Query Parameters:**

- `username`: string

**Response:**

```json
{
  "available": true,
  "suggestions": ["johndoe1", "johndoe_", "john_doe"]
}
```

---

## Image Upload API

### `POST /api/upload`

Upload an image (avatar or block image).

**Request:** `multipart/form-data`

- `file`: Image file
- `type`: `avatar` | `block`

**Response:**

```json
{
  "url": "https://cdn.example.com/image.jpg"
}
```

---

## Form Submission API

### `POST /api/forms/submit`

Submit a form block's data.

**Request Body:**

```json
{
  "blockId": "cuid",
  "data": {
    "email": "visitor@example.com",
    "message": "Hello!"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You must be logged in to perform this action"
  }
}
```

### Error Codes

| Code                    | HTTP Status | Description                              |
| ----------------------- | ----------- | ---------------------------------------- |
| `UNAUTHORIZED`          | 401         | Not authenticated                        |
| `FORBIDDEN`             | 403         | Not authorized for this resource         |
| `NOT_FOUND`             | 404         | Resource not found                       |
| `VALIDATION_ERROR`      | 400         | Invalid request data                     |
| `CONFLICT`              | 409         | Resource already exists (e.g., username) |
| `RATE_LIMITED`          | 429         | Too many requests                        |
| `SUBSCRIPTION_REQUIRED` | 403         | Plus subscription required               |
| `INTERNAL_ERROR`        | 500         | Server error                             |

---

## Rate Limiting

| Endpoint Type       | Rate Limit   |
| ------------------- | ------------ |
| Authentication      | 10 req/min   |
| API (authenticated) | 100 req/min  |
| Public page         | 1000 req/min |
| Webhooks            | Unlimited    |

---

## Internationalization

API responses include translated messages when applicable:

**Request Header:**

```
Accept-Language: pt-BR
```

**Error Response:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Página não encontrada"
  }
}
```
