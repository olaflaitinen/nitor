# NITOR API Documentation

**Version:** 1.0.0
**Base URL:** `http://localhost:8080/api`
**Authentication:** JWT Bearer Token

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [User Profile](#user-profile-endpoints)
  - [Content Management](#content-management-endpoints)
  - [Social Features](#social-features-endpoints)
  - [CV Management](#cv-management-endpoints)
  - [Notifications](#notification-endpoints)
  - [Search](#search-endpoints)
  - [Admin](#admin-endpoints)
- [WebSocket](#websocket-support)
- [AI Service](#ai-service-integration)

---

## Overview

The NITOR API is a RESTful web service that provides programmatic access to the academic social network platform. The API follows REST principles and returns JSON-formatted responses.

### API Characteristics

- **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **JSON Format**: All requests and responses use JSON
- **JWT Authentication**: Secure token-based authentication
- **Rate Limited**: Protection against abuse
- **Versioned**: API version in URL path
- **CORS Enabled**: Cross-origin resource sharing support
- **OpenAPI/Swagger**: Interactive documentation at `/swagger-ui.html`

---

## Authentication

### JWT Token Authentication

NITOR uses JSON Web Tokens (JWT) for authentication. Tokens must be included in the `Authorization` header of all authenticated requests.

```http
Authorization: Bearer <access_token>
```

### Token Types

| Token Type | Duration | Purpose |
|------------|----------|---------|
| **Access Token** | 24 hours | API authentication |
| **Refresh Token** | 7 days | Generate new access tokens |

### Token Refresh Flow

1. Access token expires after 24 hours
2. Client sends refresh token to `/api/auth/refresh`
3. Server issues new access token and refresh token
4. Old refresh token is invalidated (rotation)

### Security Features

- **Token Rotation**: Automatic refresh token rotation
- **IP Binding**: Optional IP-based token validation
- **Expiration**: Automatic token expiration
- **Revocation**: Manual token revocation support

---

## Rate Limiting

NITOR implements rate limiting to protect the API from abuse.

### Rate Limits

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Content Creation | 10 requests | 1 hour |
| File Upload | 20 requests | 1 hour |
| General API | 100 requests | 1 minute |
| Search | 60 requests | 1 minute |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Rate Limit Response

When rate limit is exceeded:

```json
{
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "timestamp": "2024-11-24T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid email format",
  "path": "/api/auth/register"
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

---

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "researcher@university.edu",
  "password": "SecurePassword123!",
  "fullName": "Dr. Jane Smith",
  "institution": "MIT",
  "handle": "janesmith"
}
```

**Response (201):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "d7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "researcher@university.edu",
    "fullName": "Dr. Jane Smith",
    "handle": "janesmith",
    "verified": false
  }
}
```

#### POST /api/auth/login
Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "researcher@university.edu",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "d7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2...",
  "tokenType": "Bearer",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "researcher@university.edu",
    "fullName": "Dr. Jane Smith",
    "handle": "janesmith",
    "nitorScore": 850,
    "verified": true
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "d7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new_refresh_token...",
  "tokenType": "Bearer",
  "expiresIn": 86400
}
```

#### POST /api/auth/logout
Invalidate current tokens.

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response (204):** No content

#### POST /api/auth/oauth2/callback/{provider}
OAuth 2.0 callback endpoint for social login.

**Supported Providers:** `google`, `github`, `linkedin`

**Request:**
```json
{
  "code": "authorization_code_from_provider",
  "state": "random_state_string"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "d7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2...",
  "tokenType": "Bearer",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "researcher@gmail.com",
    "fullName": "Dr. Jane Smith",
    "avatarUrl": "https://lh3.googleusercontent.com/...",
    "emailVerified": true
  },
  "needsOnboarding": true
}
```

---

### User Profile Endpoints

#### GET /api/profiles/{userId}
Retrieve user profile information.

**Response (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "researcher@university.edu",
  "fullName": "Dr. Jane Smith",
  "handle": "janesmith",
  "institution": "MIT",
  "academicTitle": "Associate Professor",
  "discipline": "Computer Science",
  "bio": "Researcher in AI and Machine Learning",
  "avatarUrl": "https://storage.nitor.io/avatars/...",
  "orcid": "0000-0002-1825-0097",
  "nitorScore": 850,
  "verified": true,
  "profileVisibility": "PUBLIC",
  "followersCount": 234,
  "followingCount": 189,
  "publicationsCount": 45,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### PUT /api/profiles/{userId}
Update user profile.

**Request:**
```json
{
  "fullName": "Dr. Jane A. Smith",
  "bio": "Updated bio text",
  "institution": "Stanford University",
  "academicTitle": "Professor",
  "discipline": "Artificial Intelligence"
}
```

**Response (200):** Updated profile object

---

### Content Management Endpoints

#### POST /api/content
Create new content (post or article).

**Request:**
```json
{
  "type": "ARTICLE",
  "title": "Novel Approach to Neural Networks",
  "body": "Abstract: This paper presents...",
  "abstract": "Brief summary of the paper...",
  "keywords": ["AI", "Neural Networks", "Deep Learning"],
  "visibility": "PUBLIC",
  "tags": ["research", "AI"]
}
```

**Response (201):**
```json
{
  "id": "content-uuid",
  "authorId": "user-uuid",
  "type": "ARTICLE",
  "title": "Novel Approach to Neural Networks",
  "body": "Abstract: This paper presents...",
  "likesCount": 0,
  "commentsCount": 0,
  "repostsCount": 0,
  "viewsCount": 0,
  "createdAt": "2024-11-24T10:30:00Z"
}
```

#### GET /api/content/{contentId}
Retrieve specific content by ID.

#### GET /api/content/feed
Get personalized content feed.

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 20)
- `sort` (default: createdAt,desc)

**Response (200):**
```json
{
  "content": [
    {
      "id": "content-uuid",
      "author": {
        "id": "user-uuid",
        "fullName": "Dr. Jane Smith",
        "handle": "janesmith",
        "avatarUrl": "https://...",
        "verified": true
      },
      "type": "POST",
      "body": "Exciting breakthrough in quantum computing!",
      "likesCount": 45,
      "commentsCount": 12,
      "createdAt": "2024-11-24T09:00:00Z"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8
}
```

#### PUT /api/content/{contentId}
Update existing content.

#### DELETE /api/content/{contentId}
Delete content.

**Response (204):** No content

#### POST /api/content/{contentId}/like
Like content.

**Response (200):**
```json
{
  "liked": true,
  "likesCount": 46
}
```

#### DELETE /api/content/{contentId}/like
Unlike content.

#### POST /api/content/{contentId}/repost
Repost content to your profile.

**Response (201):**
```json
{
  "repostId": "repost-uuid",
  "originalContentId": "content-uuid",
  "createdAt": "2024-11-24T10:35:00Z"
}
```

---

### Social Features Endpoints

#### POST /api/follows/{userId}
Follow a user.

**Response (201):**
```json
{
  "followerId": "your-user-id",
  "followedId": "user-id",
  "createdAt": "2024-11-24T10:40:00Z"
}
```

#### DELETE /api/follows/{userId}
Unfollow a user.

#### GET /api/follows/{userId}/followers
Get user's followers.

**Response (200):**
```json
{
  "followers": [
    {
      "id": "user-uuid",
      "fullName": "Dr. John Doe",
      "handle": "johndoe",
      "institution": "Harvard",
      "avatarUrl": "https://...",
      "followedAt": "2024-11-20T15:30:00Z"
    }
  ],
  "totalCount": 234
}
```

#### GET /api/follows/{userId}/following
Get users that this user follows.

#### POST /api/connections/send/{userId}
Send connection request.

#### POST /api/connections/accept/{requestId}
Accept connection request.

#### POST /api/connections/reject/{requestId}
Reject connection request.

#### GET /api/connections
Get all connections.

#### POST /api/comments
Create comment on content.

**Request:**
```json
{
  "contentId": "content-uuid",
  "body": "Great research! Have you considered...",
  "parentCommentId": null
}
```

**Response (201):**
```json
{
  "id": "comment-uuid",
  "authorId": "user-uuid",
  "contentId": "content-uuid",
  "body": "Great research! Have you considered...",
  "likesCount": 0,
  "createdAt": "2024-11-24T10:45:00Z"
}
```

---

### CV Management Endpoints

#### POST /api/cv/experience
Add work experience to CV.

**Request:**
```json
{
  "position": "Associate Professor",
  "institution": "MIT",
  "department": "Computer Science",
  "startDate": "2020-09-01",
  "endDate": null,
  "current": true,
  "description": "Teaching and research in AI and ML"
}
```

#### POST /api/cv/education
Add education to CV.

**Request:**
```json
{
  "degree": "Ph.D.",
  "field": "Computer Science",
  "institution": "Stanford University",
  "startDate": "2015-09-01",
  "endDate": "2020-06-01",
  "gpa": 4.0
}
```

#### POST /api/cv/publication
Add publication to CV.

**Request:**
```json
{
  "title": "Deep Learning for Natural Language Processing",
  "authors": ["Jane Smith", "John Doe"],
  "venue": "NeurIPS 2023",
  "publicationType": "CONFERENCE",
  "year": 2023,
  "doi": "10.1234/neurips.2023.12345",
  "citations": 15
}
```

#### GET /api/cv/{userId}
Get user's complete CV.

**Response (200):**
```json
{
  "userId": "user-uuid",
  "experiences": [...],
  "education": [...],
  "publications": [...],
  "skills": [...],
  "awards": [...],
  "projects": [...]
}
```

---

### Notification Endpoints

#### GET /api/notifications
Get user's notifications.

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 20)
- `unreadOnly` (default: false)

**Response (200):**
```json
{
  "notifications": [
    {
      "id": "notification-uuid",
      "type": "LIKE",
      "actorId": "user-uuid",
      "actorName": "Dr. John Doe",
      "actorAvatar": "https://...",
      "targetType": "CONTENT",
      "targetId": "content-uuid",
      "message": "Dr. John Doe liked your post",
      "read": false,
      "createdAt": "2024-11-24T10:50:00Z"
    }
  ],
  "unreadCount": 5,
  "totalCount": 127
}
```

#### PUT /api/notifications/{notificationId}/read
Mark notification as read.

#### PUT /api/notifications/read-all
Mark all notifications as read.

---

### Search Endpoints

#### GET /api/search/users
Search for users.

**Query Parameters:**
- `q` (required): Search query
- `page` (default: 0)
- `size` (default: 20)

**Response (200):**
```json
{
  "users": [
    {
      "id": "user-uuid",
      "fullName": "Dr. Jane Smith",
      "handle": "janesmith",
      "institution": "MIT",
      "discipline": "Computer Science",
      "avatarUrl": "https://...",
      "nitorScore": 850,
      "verified": true
    }
  ],
  "totalResults": 45
}
```

#### GET /api/search/content
Search for content.

**Query Parameters:**
- `q` (required): Search query
- `type`: Content type filter (POST, ARTICLE, PREPRINT)
- `page` (default: 0)
- `size` (default: 20)

---

### Admin Endpoints

#### GET /api/admin/stats
Get platform statistics (Admin only).

**Response (200):**
```json
{
  "totalUsers": 12500,
  "activeUsers": 8900,
  "totalContent": 45600,
  "totalComments": 125300,
  "reportsCount": 23
}
```

#### POST /api/admin/users/{userId}/verify
Verify user profile (Admin only).

#### POST /api/admin/users/{userId}/deactivate
Deactivate user account (Admin only).

#### GET /api/admin/reports
Get moderation reports (Admin only).

---

## WebSocket Support

NITOR provides real-time notifications via WebSocket using STOMP protocol.

### Connection

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect(
  { Authorization: `Bearer ${accessToken}` },
  (frame) => {
    console.log('Connected:', frame);

    // Subscribe to user notifications
    stompClient.subscribe('/user/queue/notifications', (message) => {
      const notification = JSON.parse(message.body);
      console.log('New notification:', notification);
    });
  }
);
```

### Events

| Topic | Description |
|-------|-------------|
| `/user/queue/notifications` | User-specific notifications |
| `/topic/feed` | Global feed updates |

---

## AI Service Integration

NITOR integrates with Google Gemini 2.5 Pro for AI-powered features.

### AI Endpoints

#### POST /api/ai/refine-text
Refine and improve academic text.

**Request:**
```json
{
  "text": "This is my draft text that needs improvement..."
}
```

**Response (200):**
```json
{
  "refinedText": "The improved version of your text..."
}
```

#### POST /api/ai/generate-abstract
Generate abstract from paper content.

**Request:**
```json
{
  "title": "Novel Approach to Neural Networks",
  "notes": "Key points and findings from the paper..."
}
```

**Response (200):**
```json
{
  "abstract": "This paper presents a novel approach..."
}
```

#### POST /api/ai/enhance-bio
Enhance profile biography.

**Request:**
```json
{
  "text": "Current bio text",
  "context": "bio"
}
```

**Response (200):**
```json
{
  "enhancedText": "Improved professional bio..."
}
```

### Additional AI Features

NITOR includes 51 AI-powered features. See [AI Service Documentation](AI_SERVICE.md) for complete list.

---

## Best Practices

### Request Guidelines

1. **Authentication**: Always include valid JWT token
2. **Content-Type**: Set to `application/json` for POST/PUT requests
3. **Error Handling**: Implement proper error handling for all status codes
4. **Rate Limiting**: Respect rate limits and implement exponential backoff
5. **Pagination**: Use pagination for large result sets
6. **Validation**: Validate data before sending requests

### Example Request (cURL)

```bash
curl -X POST \
  http://localhost:8080/api/content \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "POST",
    "body": "Exciting new research findings!",
    "visibility": "PUBLIC"
  }'
```

### Example Request (JavaScript/Axios)

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});

// Create content
try {
  const response = await api.post('/content', {
    type: 'POST',
    body: 'Exciting new research findings!',
    visibility: 'PUBLIC'
  });
  console.log('Content created:', response.data);
} catch (error) {
  console.error('Error:', error.response.data);
}
```

---

## Support

For API support and questions:

- **Documentation**: [https://docs.nitor.io](https://docs.nitor.io)
- **OpenAPI/Swagger**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **GitHub Issues**: [https://github.com/olaflaitinen/nitor/issues](https://github.com/olaflaitinen/nitor/issues)
- **Email**: api-support@nitor.io

---

## Changelog

See [CHANGELOG.md](../CHANGELOG.md) for API version history and breaking changes.

---

**NITOR API v1.0.0** • Production Ready • [Back to Documentation](../README.md)
