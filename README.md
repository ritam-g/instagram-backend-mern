# Instagram Clone (Full-Stack MERN)

A premium, full-stack Instagram clone built with the MERN stack (MongoDB, Express, React, Node.js). Features include a responsive UI with glassmorphism, smooth GSAP animations, image uploading via ImageKit, and optimized backend pagination.

## ✨ Premium Features
- **Modern UI/UX**: Premium glassmorphism design with a dark/light theme.
- **Micro-Animations**: Power by **GSAP** for smooth scroll reveals and interaction feedback.
- **Infinite Scroll**: Seamless feed browsing with skeleton loaders for a top-tier UX.
- **Image Uploads**: Fast and secure image hosting via **ImageKit.io**.
- **Performance Optimized**: Backend pagination and optimized database indexing.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (V4), Sass, GSAP, React Icons.
- **Backend**: Node.js, Express.js (v5), Mongoose.
- **Storage**: MongoDB Atlas, ImageKit.io.
- **Auth**: JWT-based authentication with cookie-based session management.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- ImageKit.io Account

### Installation

1. **Clone the repo**
   ```bash
   git clone <repo-url>
   cd instagram-backend-mern
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   # Create a .env file with your mongo URI, JWT_SECRET, and IMAGE_KIT keys
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   # Create a .env file with VITE_API_URL=http://localhost:3000
   npm run dev
   ```

## 📐 Architecture
Detailed diagrams can be found in the [Architecture Guide](architecture_diagrams.md).

## 📄 License
ISC
