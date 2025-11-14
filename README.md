# Erotica 2.0 - Frontend Application

A modern, full-featured frontend application for a story-sharing platform built with Next.js, React, TypeScript, and Tailwind CSS.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Key Features Implementation](#key-features-implementation)
- [Component Library](#component-library)
- [Routing](#routing)
- [State Management](#state-management)
- [Styling & Theming](#styling--theming)
- [Accessibility](#accessibility)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Backend Integration Guide](#backend-integration-guide)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This is a comprehensive frontend application for an adult content platform that allows users to:
- Read and share stories
- Post anonymous confessions
- Join communities
- Chat with other users
- Manage their author profiles
- Administer content moderation

The application is built with modern web technologies, follows best practices, and is fully responsive and accessible.

## ✨ Features

### Core Features
- **Authentication**: Email/password signup and login with guest mode support
- **Stories**: Browse, read, create, and manage stories with reading progress tracking
- **Confessions**: Anonymous confession wall with reactions
- **Communities**: Join communities and participate in discussions
- **Chat**: Real-time messaging with message request system
- **Profiles**: User profiles with stories, bookmarks, and activity
- **Author Dashboard**: Story creation, drafts, and statistics
- **Admin Panel**: Content moderation and user management

### Advanced Features
- **Reading Progress**: Automatic progress tracking and resume functionality
- **For You Feed**: Personalized story recommendations
- **Multi-Tag Search**: Advanced search with tag filtering
- **Real-time Updates**: Socket.io integration for live chat and notifications
- **Theme Toggle**: Dark/light mode support
- **Responsive Design**: Mobile-first, works on all devices
- **Accessibility**: WCAG AA compliant

## 🛠 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Socket.io Client
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: react-hot-toast
- **HTTP Client**: Fetch API (custom wrapper)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/           # Header, Footer
│   ├── story/           # Story-related components
│   ├── confession/      # Confession components
│   ├── community/       # Community components
│   └── chat/            # Chat components
├── contexts/            # React contexts (Auth, Theme, Notifications)
├── hooks/               # Custom React hooks
├── lib/                 # API client, Socket.io setup
├── pages/               # Next.js pages/routes
├── styles/              # Global styles
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see Backend Integration Guide)

### Installation

1. **Clone the repository**
   ```bash
   cd "Erotica 2.0"
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration (see Environment Variables section)

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Firebase (Optional - if using Firebase Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id

# Error Tracking (Optional)
SENTRY_DSN=your_sentry_dsn
```

## 🔌 API Integration

### API Client

The application uses a centralized API client located at `src/lib/api.ts`. All API calls go through this client which:
- Handles authentication tokens automatically
- Manages request/response formatting
- Provides type-safe methods for all endpoints

### Expected API Endpoints

The frontend expects the following REST API endpoints:

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Stories
- `GET /api/stories` - List stories (with query params: tags, page, sort, category)
- `GET /api/stories/:id` - Get story details
- `POST /api/stories` - Create story (auth required)
- `POST /api/stories/:id/like` - Like/unlike story
- `POST /api/stories/:id/bookmark` - Bookmark story
- `GET /api/stories/:id/comments` - Get story comments
- `POST /api/stories/:id/comments` - Create comment

#### Confessions
- `GET /api/confessions` - List confessions (query params: sort, page)
- `POST /api/confessions` - Create confession
- `POST /api/confessions/:id/react` - React to confession

#### Communities
- `GET /api/communities` - List communities
- `GET /api/communities/:slug` - Get community details
- `POST /api/communities/:slug/join` - Join community

#### Chat
- `GET /api/chats` - List chat threads
- `GET /api/chats/:threadId/messages` - Get messages
- `POST /api/chats/request` - Send message request
- `POST /api/chats/request/:id/accept` - Accept request
- `POST /api/chats/request/:id/reject` - Reject request

#### User
- `GET /api/users/:username` - Get user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/me/bookmarks` - Get bookmarks
- `POST /api/users/me/progress` - Save reading progress
- `GET /api/users/me/progress/:storyId` - Get reading progress

#### Feed
- `GET /api/feed/for-you` - Get personalized feed

#### Tags
- `GET /api/tags` - Get tags (query param: query)

#### Reports
- `POST /api/reports` - Report content

#### Admin
- `GET /api/admin/stories/pending` - Get pending stories
- `POST /api/admin/stories/:id/approve` - Approve story
- `POST /api/admin/stories/:id/reject` - Reject story
- `GET /api/admin/reports` - Get reports

### API Response Format

All API responses should follow this format:

```typescript
// Success response
{
  data: T,  // The actual data
  message?: string
}

// Paginated response
{
  data: T[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error response
{
  error: string,
  message: string
}
```

### Authentication

The frontend expects JWT tokens to be returned from login/signup endpoints:
```json
{
  "user": { ... },
  "token": "jwt_token_here"
}
```

Tokens are stored in cookies (via `js-cookie`). The API client automatically includes the token in the `Authorization` header for authenticated requests.

## 🔄 Socket.io Integration

### Connection

Socket.io connection is initialized in `src/lib/socket.ts`. The client:
- Connects automatically after user authentication
- Sends auth token in connection handshake
- Handles reconnection with exponential backoff

### Socket Events

#### Client → Server
- `send_message` - Send a message
- `message_request` - Send message request
- `accept_request` - Accept message request
- `reject_request` - Reject message request
- `typing` - Send typing indicator

#### Server → Client
- `message_received` - New message received
- `message_request_received` - New message request
- `message_accepted` - Message request accepted
- `presence_update` - User online/offline status
- `typing` - User is typing

### Implementation

Socket events are handled through the `socketEvents` helper in `src/lib/socket.ts`. Components use these helpers to send/receive real-time updates.

## 🎨 Key Features Implementation

### Reading Progress

Reading progress is tracked automatically:
- Scroll position saved every 5% or every 10 seconds
- Stored in localStorage for guests
- Synced to API for authenticated users
- Progress bar shown on story cards
- "Continue reading" feature on homepage

Implementation: `src/hooks/useReadingProgress.ts`

### Multi-Tag Search

- Tag input with autocomplete suggestions
- Tags displayed as removable chips
- AND logic for filtering (all selected tags must match)
- Debounced search (300ms)
- Tag suggestions from `/api/tags?query=...`

### For You Feed

- Personalized recommendations based on user interactions
- Falls back to trending for guests
- Uses `/api/feed/for-you` endpoint
- Client sends telemetry to `/api/telemetry` (to be implemented)

### Message Request System

1. User sends message request with preview
2. Recipient sees request in "Message Requests" section
3. Recipient can Accept (opens chat) or Reject (blocks future requests)
4. Real-time updates via Socket.io

## 🧩 Component Library

All reusable UI components are in `src/components/ui/`:

- **Button**: Multiple variants (primary, ghost, danger, secondary)
- **Input**: Form input with label and error handling
- **Textarea**: Multi-line text input
- **Modal**: Accessible modal dialog
- **Card**: Container component with variants
- **Avatar**: User avatar with fallback initials
- **Tag**: Tag chip with remove option
- **Badge**: Status badge component
- **Skeleton**: Loading placeholder

All components:
- Are fully typed with TypeScript
- Support dark/light themes
- Are keyboard accessible
- Include proper ARIA labels

## 🛣 Routing

Next.js file-based routing:

- `/` - Homepage
- `/stories` - Stories list
- `/stories/[id]` - Story detail
- `/stories/create` - Create story (author only)
- `/confessions` - Confessions feed
- `/confessions/create` - Create confession
- `/community` - Communities list
- `/community/[slug]` - Community detail
- `/chat` - Chat inbox
- `/profile/[username]` - User profile
- `/admin` - Admin panel (admin only)
- `/auth/login` - Login page
- `/auth/signup` - Signup page

## 📊 State Management

### React Query
- Used for server state (API data)
- Automatic caching and refetching
- Optimistic updates for better UX

### Context API
- **AuthContext**: User authentication state
- **ThemeContext**: Theme (dark/light) state
- **NotificationContext**: Notification state

### Local State
- Component-level state with `useState`
- Form state with React Hook Form

## 🎨 Styling & Theming

### Tailwind CSS

Custom theme configuration in `tailwind.config.js`:
- Primary colors: Red (#D40032)
- Background: Black (#000000)
- Text: Light gray (#F2F2F2)
- Custom fonts: Inter (UI), Playfair Display (headings)

### Theme Toggle

- Dark mode is default
- Light mode available via toggle in header
- Theme persisted in localStorage
- CSS variables for easy theme switching

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

Mobile-first approach throughout.

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Skip to content link
- Focus indicators
- Color contrast ratios meet WCAG AA
- Screen reader friendly

## ⚡ Performance Optimizations

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component (for avatars)
- **Lazy Loading**: Comments and sidebars
- **Infinite Scroll**: For feeds and lists
- **Debouncing**: Search and tag inputs
- **Caching**: React Query with stale-while-revalidate
- **SSR/SSG**: Server-side rendering for SEO

## 🧪 Testing

### Setup

```bash
npm test
```

### Test Structure

- Unit tests: Component logic
- Integration tests: API interactions
- E2E tests: Critical user flows (to be implemented)

### Testing Tools

- Jest
- React Testing Library
- Cypress (for E2E - to be configured)

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all environment variables are set in your deployment platform.

## 🔗 Backend Integration Guide

### For Backend Developers

This section provides detailed information for backend developers integrating with this frontend.

#### 1. API Base URL

Set `NEXT_PUBLIC_API_URL` to your backend API base URL:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

#### 2. CORS Configuration

Your backend must allow requests from the frontend domain:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

#### 3. Authentication

**Login/Signup Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "username",
    "email": "email@example.com",
    "displayName": "Display Name",
    "avatar": "https://...",
    "bio": "Bio text",
    "language": "en",
    "role": "user"
  },
  "token": "jwt_token_string"
}
```

**Token Storage:**
- Frontend stores token in cookie named `token`
- Token sent in `Authorization: Bearer <token>` header
- Token should be HttpOnly cookie (recommended) or regular cookie

**Token Refresh:**
- Implement refresh token mechanism
- Frontend will call `/api/auth/me` to validate token
- Return 401 on expired token, frontend will redirect to login

#### 4. Socket.io Setup

**Connection:**
- Frontend connects to `NEXT_PUBLIC_SOCKET_URL`
- Sends token in connection handshake:
  ```javascript
  socket.connect({
    auth: { token: "jwt_token" }
  })
  ```

**Event Handlers:**
Implement these server-side event handlers:
- `send_message`: Handle message sending
- `message_request`: Handle message requests
- `accept_request`: Handle request acceptance
- `reject_request`: Handle request rejection
- `typing`: Handle typing indicators

**Emit Events:**
Server should emit:
- `message_received` - When message is received
- `message_request_received` - When request is received
- `message_accepted` - When request is accepted
- `presence_update` - User online/offline status
- `typing` - Typing indicator

#### 5. File Uploads

Currently, the frontend doesn't support file uploads. If you need to add avatar uploads:
- Use `multipart/form-data` for file uploads
- Endpoint: `POST /api/users/me/avatar`
- Return updated user object with new avatar URL

#### 6. Pagination

All list endpoints should support pagination:
```
GET /api/stories?page=1&limit=20
```

Response format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### 7. Error Handling

**Error Response Format:**
```json
{
  "error": "Error code",
  "message": "Human-readable error message"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

Frontend will display error messages to users via toast notifications.

#### 8. Rate Limiting

Implement rate limiting on your backend:
- Message sending: X messages per minute
- Story creation: X stories per day
- Comment posting: X comments per minute

Return `429 Too Many Requests` when limit exceeded.

#### 9. Content Moderation

**Story Submission:**
- Stories submitted with `status: "pending"`
- Admin approves/rejects via `/api/admin/stories/:id/approve` or `/reject`
- Frontend shows pending status in author dashboard

**Reports:**
- Users can report content via `POST /api/reports`
- Admin views reports in admin panel
- Implement moderation queue

#### 10. Real-time Features

**Presence:**
- Track user online/offline status
- Emit `presence_update` when status changes
- Frontend displays online indicator in chat

**Notifications:**
- Send notifications for:
  - New comments on stories
  - Message requests
  - Story approval/rejection
  - Likes/bookmarks

#### 11. Search & Filtering

**Stories Endpoint:**
```
GET /api/stories?tags=romance,forbidden&category=romance&sort=popular&page=1
```

**Query Parameters:**
- `tags`: Comma-separated tag list (AND logic)
- `category`: Single category filter
- `sort`: `popular`, `recent`, `most_commented`
- `page`: Page number
- `limit`: Items per page (default: 20)

#### 12. Data Validation

Backend should validate:
- Email format
- Password strength (min 6 chars)
- Content length limits
- Tag count limits
- Required fields

Return validation errors in format:
```json
{
  "error": "ValidationError",
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

#### 13. Testing Your Integration

1. **Start your backend server**
2. **Update `.env.local`** with your API URL
3. **Run frontend**: `npm run dev`
4. **Test flows**:
   - Signup/Login
   - Create story
   - Post confession
   - Send message request
   - Chat functionality

#### 14. Common Issues

**CORS Errors:**
- Ensure CORS is properly configured
- Check `Access-Control-Allow-Credentials: true` for cookie auth

**Authentication Issues:**
- Verify token format (JWT)
- Check token expiration
- Ensure token is sent in Authorization header

**Socket.io Connection:**
- Verify Socket.io server is running
- Check CORS settings for Socket.io
- Ensure auth token is sent in handshake

**API Response Format:**
- Ensure all responses match expected format
- Check error response structure

## 🐛 Troubleshooting

### Common Issues

1. **API calls failing**
   - Check `NEXT_PUBLIC_API_URL` is set correctly
   - Verify backend is running
   - Check CORS configuration

2. **Socket.io not connecting**
   - Verify `NEXT_PUBLIC_SOCKET_URL` is set
   - Check backend Socket.io server is running
   - Check browser console for connection errors

3. **Authentication not working**
   - Verify token is being stored in cookies
   - Check token format matches backend expectations
   - Ensure backend returns token in correct format

4. **Styling issues**
   - Clear `.next` cache: `rm -rf .next`
   - Rebuild: `npm run build`

5. **Type errors**
   - Run `npm run type-check`
   - Ensure all types match backend responses

## 📝 Development Notes

### Adding New Features

1. Create components in appropriate directory
2. Add types to `src/types/index.ts`
3. Add API methods to `src/lib/api.ts`
4. Create page in `src/pages/`
5. Update navigation if needed

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind utility classes
- Keep components small and focused
- Add proper error handling

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Team/Contributors]

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ using Next.js and React**

