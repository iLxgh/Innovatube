# InnovaTube - YouTube Video Search Application

A full-stack web application that allows users to search YouTube videos, save favorites, and manage their video collection with a beautiful, responsive interface.

## 🚀 Features

### Authentication

- ✅ User registration with validation
- ✅ Secure login system
- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ Google reCAPTCHA v3 integration
- ✅ Password recovery (placeholder)

### Video Search

- ✅ Search YouTube videos using YouTube Data API v3
- ✅ Real-time search with debouncing (500ms)
- ✅ Pagination support (next/previous pages)
- ✅ Video thumbnails, titles, channels, view counts
- ✅ Direct links to YouTube videos

### Favorites Management

- ✅ Add/remove videos to favorites
- ✅ Search within favorites
- ✅ Persistent favorites storage in MongoDB
- ✅ Real-time favorite status updates

### Security & Performance

- ✅ Rate limiting on API endpoints
- ✅ Request validation with Zod schemas
- ✅ Protected routes with authentication middleware
- ✅ CORS configuration
- ✅ Responsive design (mobile, tablet, desktop)

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **Security**: express-rate-limit, Google reCAPTCHA v3
- **API**: YouTube Data API v3

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Forms**: react-hook-form + Zod
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Notifications**: Sonner (toast notifications)

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- YouTube Data API v3 key
- Google reCAPTCHA v3 site key and secret key

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd InnovaTube
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/innovatube
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### YouTube (Protected)

- `GET /api/youtube/search?q=query&pageToken=token` - Search videos
- `GET /api/youtube/video/:id` - Get video details

### Favorites (Protected)

- `POST /api/favorites` - Add video to favorites
- `DELETE /api/favorites/:videoId` - Remove from favorites
- `GET /api/favorites?search=query` - List favorites with optional search
- `GET /api/favorites/check/:videoId` - Check if video is favorited

## 🎨 Project Structure

```
InnovaTube/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, rate limiting
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # YouTube API service
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Zod schemas
│   │   └── index.ts         # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── dashboard/       # Video search page
    │   ├── favorites/       # Favorites page
    │   ├── login/           # Login page
    │   ├── register/        # Registration page
    │   ├── layout.tsx       # Root layout with providers
    │   └── page.tsx         # Landing page
    ├── components/
    │   ├── ui/              # Shadcn/ui components
    │   ├── Navbar.tsx       # Navigation bar
    │   ├── ProtectedRoute.tsx
    │   └── VideoCard.tsx    # Video display card
    ├── lib/
    │   ├── api.ts           # Axios client
    │   ├── auth-context.tsx # Auth state management
    │   └── utils.ts         # Utility functions
    ├── .env.example
    └── package.json
```

## 🔐 Environment Variables

### Backend (.env)

| Variable               | Description               | Required |
| ---------------------- | ------------------------- | -------- |
| `PORT`                 | Server port               | Yes      |
| `MONGODB_URI`          | MongoDB connection string | Yes      |
| `JWT_SECRET`           | Secret key for JWT        | Yes      |
| `JWT_EXPIRES_IN`       | JWT expiration time       | Yes      |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA secret   | Yes      |
| `YOUTUBE_API_KEY`      | YouTube Data API key      | Yes      |
| `FRONTEND_URL`         | Frontend URL for CORS     | Yes      |

### Frontend (.env.local)

| Variable                         | Description        | Required |
| -------------------------------- | ------------------ | -------- |
| `NEXT_PUBLIC_API_URL`            | Backend API URL    | Yes      |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key | Yes      |

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**

- [ ] Register new user with all validations
- [ ] Login with username
- [ ] Login with email
- [ ] Logout functionality
- [ ] Protected routes redirect to login

**Video Search:**

- [ ] Search for videos
- [ ] View video thumbnails and details
- [ ] Navigate to YouTube video
- [ ] Pagination (next/previous)
- [ ] Debounced search

**Favorites:**

- [ ] Add video to favorites
- [ ] Remove video from favorites
- [ ] View favorites list
- [ ] Search within favorites
- [ ] Favorite status persists after logout/login

## 📝 Git Commit History

1. `feat: configure backend environment and implement authentication system`
2. `feat: integrate YouTube API and implement favorites system`
3. `feat: create authentication UI with Shadcn/ui`
4. `fix: correct homepage JSX structure and gradient classes`
5. `feat: build video search dashboard and favorites UI`

## 🎯 Future Enhancements

- [ ] Docker containerization
- [ ] Deployment to production (Vercel + Railway/Render)
- [ ] Email verification for registration
- [ ] Password reset via email
- [ ] Video playlists
- [ ] Watch history
- [ ] Dark mode
- [ ] Video recommendations
- [ ] Social sharing

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as part of the InnovaTube coding challenge.
