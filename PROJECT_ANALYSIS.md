# Instagram Clone Project Analysis

## 📋 Project Overview
This is a **full-stack Instagram clone** built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The project is divided into two main directories: `Backend/` (Node.js/Express API server) and `Frontend/` (React SPA with Vite). It features a modern glassmorphism UI, dark/light theme support, infinite scroll feed, image uploads via ImageKit, JWT authentication, and smooth GSAP animations.

**Key Technologies:**
- **Backend**: Node.js, Express.js v5, Mongoose (MongoDB ODM), JWT auth
- **Frontend**: React 19, Vite, Tailwind CSS v4 + Sass, GSAP animations, React Router, React Hot Toast
- **Storage**: MongoDB Atlas, ImageKit.io (image uploads/CDN)
- **Styling**: Glassmorphism effects, responsive design, theme context
- **Other**: Infinite scroll with IntersectionObserver, skeleton loaders, cookie-based sessions

## 🏗️ Project Structure

### Backend (`Backend/`)
```
Backend/
├── src/
│   ├── app.js                 # Main Express app setup (routes, middleware)
│   ├── routes/
│   │   └── auth.route.js      # Auth endpoints (/register, /login)
│   └── ... (post routes, models, controllers, config)
├── public/
│   └── index.html             # API fallback
└── package.json
```
**Main Backend Routes (identified):**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - JWT authentication
- Expected: Post CRUD, profiles, likes/comments

### Frontend (`Frontend/`)
```
Frontend/
├── src/
│   ├── App.jsx                # Root with Auth/Post/Theme providers
│   ├── AppRoutes.jsx          # React Router configuration
│   ├── components/layout/
│   │   └── MainLayout.jsx     # Navigation + content outlet
│   ├── features/
│   │   ├── auth/              # Login/Register + API services
│   │   ├── post/              # Feed, CreatePost, PostProvider
│   │   ├── profile/           # Profile pages + redirect
│   │   ├── landing/           # Home/Landing page
│   │   └── theme/             # Dark/Light theme context
│   ├── hooks/                 # usePost, usePageReveal (GSAP)
│   └── styles/                # globals.css (Tailwind)
├── dist/                      # Vite production build
└── package.json
```

**Frontend Routes:**
```
/ (LandingPage)
/login (Login)
/register (Register)
/feed-page (FeedPage - infinite scroll)
/createpost (CreatePost)
/profile (ProfileRedirect → /profile/me or /:username)
/profile/:username (ProfilePage)
* → / (redirect)
```

## 🚀 Main User Flows

1. **Auth Flow**: Landing → Register/Login → JWT → Protected dashboard
2. **Feed Flow**: Infinite scroll posts with skeletons → Load more on scroll
3. **Post Flow**: Create post with ImageKit upload → Add to feed
4. **Profile Flow**: View own/other profiles
5. **Theme**: Toggle dark/light (localStorage + system pref)

## 🎨 UI Features
- **Glassmorphism**: Blurred, translucent cards (`glass-surface`)
- **Animations**: GSAP page reveals, loading spinners
- **Responsive**: Mobile-first, lg: sidebar nav
- **States**: Skeletons, toasts, empty cards

## 🛠️ Setup (from README.md)
```
Backend: npm install && npm run dev
Frontend: npm install && npm run dev
Env: Mongo URI, JWT_SECRET, ImageKit keys, VITE_API_URL=localhost:3000
```

## 📊 Project Status
✅ **Complete**: Auth, Feed (infinite), Theme, Landing, Profiles (basic), Glass UI  
🔄 **Partial**: Post creation, full CRUD  
❓ **Todo**: Comments, likes, search, notifications

**Analysis based on file structure, routes, README.md, and open tabs (Oct 2024).**
