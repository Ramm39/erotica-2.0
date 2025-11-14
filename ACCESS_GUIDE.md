# Website Access Guide

## 🚀 Starting the Development Server

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to: **http://localhost:3000**

---

## 📍 All Available Pages & Routes

### Public Pages (No Authentication Required)

#### 1. **Homepage**
- **URL**: `http://localhost:3000/`
- **Description**: Main landing page with featured stories, trending content, and categories
- **Features**: 
  - Browse stories and confessions
  - View trending content
  - Explore categories
  - Sign up/Login buttons

#### 2. **Stories List**
- **URL**: `http://localhost:3000/stories`
- **Description**: Browse all stories with search and filtering
- **Features**:
  - Search stories
  - Filter by tags (multi-select)
  - Filter by category
  - Sort by: Popular, Recent, Most Commented
  - Grid/List view toggle

#### 3. **Story Detail**
- **URL**: `http://localhost:3000/stories/[id]`
- **Example**: `http://localhost:3000/stories/123`
- **Description**: Read a full story with comments
- **Features**:
  - Reading progress tracking
  - Like, bookmark, share, comment
  - Reading mode settings (font size, line height)
  - Comments section

#### 4. **Confessions Feed**
- **URL**: `http://localhost:3000/confessions`
- **Description**: Anonymous confession wall
- **Features**:
  - View all confessions
  - React with: Relatable, Hot, Wild, Supportive
  - Sort by Popular/Recent
  - Post confessions (requires login)

#### 5. **Communities List**
- **URL**: `http://localhost:3000/community`
- **Description**: Browse all communities
- **Features**:
  - View all available communities
  - See member counts
  - Join communities (requires login)

#### 6. **Community Detail**
- **URL**: `http://localhost:3000/community/[slug]`
- **Example**: `http://localhost:3000/community/romance-lovers`
- **Description**: View community details and posts
- **Features**:
  - View community info
  - See all posts
  - Join/Leave community
  - Create posts (if member)

#### 7. **User Profile**
- **URL**: `http://localhost:3000/profile/[username]`
- **Example**: `http://localhost:3000/profile/johndoe`
- **Description**: View user profile
- **Features**:
  - View user's stories
  - View bookmarks (own profile only)
  - View communities
  - View activity

---

### Authentication Pages

#### 8. **Login**
- **URL**: `http://localhost:3000/auth/login`
- **Description**: Sign in to your account
- **Features**:
  - Email/password login
  - "Remember me" option
  - Forgot password link
  - Google OAuth (if configured)
  - "Continue as Guest" option
  - Redirects to attempted page after login

#### 9. **Sign Up**
- **URL**: `http://localhost:3000/auth/signup`
- **Description**: Create a new account
- **Features**:
  - Email/password signup
  - Display name
  - Language preference
  - 18+ age confirmation
  - Terms & Privacy links
  - Google OAuth (if configured)

---

### Authenticated Pages (Requires Login)

#### 10. **Create Story** (Author Only)
- **URL**: `http://localhost:3000/stories/create`
- **Description**: Write and submit a new story
- **Requirements**: User must have `role: 'author'`
- **Features**:
  - Story editor
  - Title, category, tags, language
  - Auto-save drafts
  - Submit for review
  - Character counter

#### 11. **Create Confession**
- **URL**: `http://localhost:3000/confessions/create`
- **Description**: Post an anonymous confession
- **Requirements**: Must be logged in
- **Features**:
  - Anonymous posting
  - Tag suggestions
  - Character limit (50-2000)
  - Auto-moderation checks

#### 12. **Chat / Inbox**
- **URL**: `http://localhost:3000/chat`
- **Description**: Real-time messaging
- **Requirements**: Must be logged in
- **Features**:
  - View all chat threads
  - Message requests section
  - Real-time messaging via Socket.io
  - Typing indicators
  - Online/offline status
  - Accept/Reject message requests

#### 13. **Author Dashboard**
- **URL**: `http://localhost:3000/profile/[username]/author`
- **Example**: `http://localhost:3000/profile/johndoe/author`
- **Description**: Manage your stories as an author
- **Requirements**: User must have `role: 'author'`
- **Features**:
  - View all your stories
  - Drafts management
  - Pending stories
  - Published stories
  - Story statistics (views, likes, comments)
  - Edit stories

---

### Admin Pages (Admin Only)

#### 14. **Admin Panel**
- **URL**: `http://localhost:3000/admin`
- **Description**: Content moderation and site management
- **Requirements**: User must have `role: 'admin'`
- **Features**:
  - **Pending Stories Tab**: Approve/Reject stories
  - **Reports Tab**: Review reported content
  - **Users Tab**: User management (coming soon)
  - **Analytics Tab**: Site analytics (coming soon)

---

## 🔐 How to Access Admin Panel

### Option 1: Through User Menu (If Admin)
1. **Login** with an admin account
2. Click on your **avatar** in the header (top right)
3. Select **"Admin Panel"** from the dropdown menu

### Option 2: Direct URL
- Navigate directly to: `http://localhost:3000/admin`
- **Note**: You must be logged in with an admin account, otherwise you'll be redirected to homepage

### Creating an Admin Account

To test the admin panel, your backend needs to:
1. Create a user with `role: 'admin'` in the database
2. Or provide an endpoint to promote users to admin

**Example Admin User Object:**
```json
{
  "id": "admin_id",
  "username": "admin",
  "email": "admin@example.com",
  "displayName": "Admin User",
  "role": "admin"
}
```

---

## 🎯 Quick Access URLs

| Page | URL |
|------|-----|
| Homepage | `http://localhost:3000/` |
| Stories | `http://localhost:3000/stories` |
| Confessions | `http://localhost:3000/confessions` |
| Communities | `http://localhost:3000/community` |
| Chat | `http://localhost:3000/chat` |
| Login | `http://localhost:3000/auth/login` |
| Sign Up | `http://localhost:3000/auth/signup` |
| Admin Panel | `http://localhost:3000/admin` |

---

## 🔑 User Roles & Permissions

### Guest (Not Logged In)
- ✅ Browse stories
- ✅ Read stories
- ✅ View confessions
- ✅ View communities
- ❌ Cannot like/comment/bookmark
- ❌ Cannot create content
- ❌ Cannot chat

### User (Logged In)
- ✅ All guest permissions
- ✅ Like, comment, bookmark
- ✅ Post confessions
- ✅ Join communities
- ✅ Chat with other users
- ❌ Cannot create stories (need author role)

### Author (role: 'author')
- ✅ All user permissions
- ✅ Create and submit stories
- ✅ Access author dashboard
- ✅ View story statistics
- ❌ Cannot moderate content

### Admin (role: 'admin')
- ✅ All author permissions
- ✅ Access admin panel
- ✅ Approve/reject stories
- ✅ Review reports
- ✅ Manage users (coming soon)

---

## 🐛 Troubleshooting

### Page Not Loading
- Check if dev server is running: `npm run dev`
- Check browser console for errors
- Verify backend API is running (if using real backend)

### Admin Panel Not Accessible
- Ensure you're logged in
- Verify your user has `role: 'admin'` in the database
- Check browser console for errors
- Try logging out and logging back in

### Authentication Issues
- Clear browser cookies
- Check `.env.local` file has correct API URL
- Verify backend authentication endpoints are working

### Socket.io Connection Issues
- Check `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
- Verify Socket.io server is running
- Check browser console for connection errors

---

## 📝 Notes

- All pages are responsive and work on mobile devices
- Dark mode is default; toggle available in header
- Guest users will be prompted to sign up when trying to perform authenticated actions
- Some features require backend API to be fully functional
- Socket.io features (chat) require Socket.io server to be running

---

**Happy Exploring! 🎉**

