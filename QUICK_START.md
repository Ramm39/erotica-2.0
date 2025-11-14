# 🚀 Quick Start Guide

## ✅ Website is Running!

Your development server is now running. Open your browser and navigate to:

### **http://localhost:3000**

---

## 📍 All Page URLs

### Public Pages (No Login Required)

1. **Homepage**: http://localhost:3000/
2. **Stories List**: http://localhost:3000/stories
3. **Confessions**: http://localhost:3000/confessions
4. **Communities**: http://localhost:3000/community
5. **Login**: http://localhost:3000/auth/login
6. **Sign Up**: http://localhost:3000/auth/signup

### Authenticated Pages (Requires Login)

7. **Create Story**: http://localhost:3000/stories/create (Author role)
8. **Create Confession**: http://localhost:3000/confessions/create
9. **Chat**: http://localhost:3000/chat
10. **Profile**: http://localhost:3000/profile/[username]

### 🔐 Admin Panel

**URL**: http://localhost:3000/admin

**How to Access:**
1. Login with an admin account (user with `role: 'admin'` in database)
2. Click your avatar in the top-right corner
3. Select "Admin Panel" from dropdown
4. OR navigate directly to: http://localhost:3000/admin

**Note**: You need a user with `role: 'admin'` in your backend database to access this page.

---

## 🛠️ If Server is Not Running

Run this command in the terminal:

```bash
cd "/Users/ramshekhada/Desktop/Erotica 2.0"
npm run dev
```

Wait for the message: `✓ Ready in XXXXms`

Then open: **http://localhost:3000**

---

## 🎯 Features to Test

1. **Browse Stories** - Click "Stories" in navigation
2. **View Confessions** - Click "Confessions" in navigation
3. **Sign Up** - Create a new account
4. **Login** - Sign in with your account
5. **Admin Panel** - Access with admin account

---

## ⚠️ Note

Some features require your backend API to be running. If you see loading states or errors, make sure:
- Your backend server is running
- `.env.local` file has correct API URL
- CORS is configured on your backend

---

**Happy Exploring! 🎉**

