# InnovaTube - YouTube Video Search Application

A full-stack web application that allows users to search YouTube videos, save favorites, and manage their video collection with a beautiful, responsive interface.

## 🚀 Features

### Authentication

- ✅ User registration with validation
- ✅ Secure login system
- ✅ JWT-based authentication
- ✅ Password encryption with bcrypt
- ✅ Google reCAPTCHA v3 integration
- ✅ Password recovery via secure token (SMTP / dev console fallback)

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

### DevOps & Developer Experience

- ✅ Fully containerized with Docker
- ✅ Hot-reloading in development
- ✅ Easy environment setup with Docker Compose

### Deployment

- ✅ Vercel for frontend deployment
- ✅ Railway for backend and database deployment

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

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Environment**: Linux (Alpine) base images

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

### 🐳 Run with Docker (Recommended)

The easiest way to run the application is using Docker Compose.

1.  Ensure you have **Docker** and **Docker Compose** installed.
2.  Create a `.env` file in the root directory (Project root) containing the necessary environment variables. This file will be used by Docker Compose.
3.  Run the following command:

```bash
docker-compose up --build
```

Access the application at:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Manual Setup

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

## 🌍 Live Demo

- Frontend: https://innovatube-wine.vercel.app/
- Backend API: https://innovatube-backend.up.railway.app/api
- Health check: https://innovatube-backend.up.railway.app/health

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

## 🔑 Password Reset Flow

The application includes a secure password reset mechanism based on time-limited tokens.

### How it works

1. The user requests a password reset by providing their email.
2. If the email exists, the backend generates a random reset token.
3. The token is stored **hashed** in the database along with an expiration time (10 minutes).
4. A reset link is generated using the frontend URL and sent via email.
5. The user sets a new password using the token.
6. After a successful reset:
   - The token is invalidated
   - The password is securely hashed
   - A new JWT is issued automatically

### Email Delivery

Email sending is handled through an SMTP configuration defined via environment variables.

For development environments **without SMTP credentials**, the reset link is logged directly to the backend console.  
This allows the full reset flow to be tested locally without relying on external email services.

This approach keeps the application production-ready while maintaining a smooth local development experience.

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

### Optional (SMTP Configuration)

| Variable     | Description          | Required |
| ------------ | -------------------- | -------- |
| `SMTP_HOST`  | SMTP server host     | No       |
| `SMTP_PORT`  | SMTP server port     | No       |
| `SMTP_USER`  | SMTP username        | No       |
| `SMTP_PASS`  | SMTP password        | No       |
| `FROM_NAME`  | Email sender name    | No       |
| `FROM_EMAIL` | Email sender address | No       |

If SMTP variables are not provided, password reset emails will be logged to the backend console instead.

### Frontend (.env.local)

| Variable                         | Description        | Required |
| -------------------------------- | ------------------ | -------- |
| `NEXT_PUBLIC_API_URL`            | Backend API URL    | Yes      |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA site key | Yes      |

## Thanks!

Thanks for checking out my project! If you have any questions or need assistance, feel free to reach out.
