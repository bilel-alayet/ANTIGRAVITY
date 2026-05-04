# ANTIGRAVITY 🎬

A premium, full-stack movie and television discovery platform powered by The Movie Database (TMDB) API and intelligent AI-driven recommendations.

## Overview

**ANTIGRAVITY** is a sophisticated web application that combines extensive entertainment data with cutting-edge AI technology to deliver an unparalleled movie and TV show browsing experience. Users can explore vast catalogs of films and television series, manage personalized favorites, read entertainment news, and interact with an AI concierge for intelligent recommendations and cinematic discussions.

## Key Features

### 🎥 Content Discovery
- **Movie Catalog**: Browse popular, top-rated, upcoming, and now-playing movies
- **TV Series Library**: Explore popular TV shows, top-rated series, currently airing programs, and more
- **Advanced Filtering**: Discover content by genre, category, and custom filters
- **Detailed Information**: View comprehensive metadata including cast, crew, videos, ratings, and recommendations
- **Search Functionality**: Find movies, TV shows, and cast members with full-text search

### 👥 User Management
- **User Authentication**: Secure registration and login system with JWT token-based authentication
- **Password Security**: Bcrypt-encrypted passwords for enhanced security
- **User Profiles**: Personalized user profiles with customizable information

### ⭐ Personalization
- **Favorites Management**: Save and organize favorite movies and TV shows
- **Custom Reviews**: Add personal reviews and ratings to your favorite content
- **Recommendations**: Get curated movie and TV suggestions based on your interests

### 🤖 AI-Powered Features
- **Cine-AI Concierge**: Interactive AI assistant specializing in film recommendations and cinematic discussions
- **Intelligent Conversations**: Powered by Groq's Llama 3.1 model for natural, engaging dialogue
- **Movie Expertise**: AI provides recommendations, plot discussions, cast insights, and entertainment trivia

### 📰 Entertainment News
- **Latest Updates**: Stay informed with the newest entertainment industry news
- **Curated Content**: Relevant articles about movies, TV shows, and celebrity developments

## Tech Stack

### Frontend
- **Framework**: React 18 with modern hooks architecture
- **Build Tool**: Vite 5 (lightning-fast development and production builds)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with interceptors for JWT token management
- **Icons**: Lucide React for comprehensive icon library
- **Styling**: Custom CSS with CSS variables for theming
- **Language**: JavaScript (ES6+ modules)

### Backend
- **Runtime**: Node.js with Express 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests
- **Environment Variables**: dotenv for secure configuration
- **Development**: Nodemon for hot-reloading

### External APIs
- **TMDB (The Movie Database)**: Comprehensive movie and TV data
- **Groq API**: Advanced LLM integration for AI concierge functionality
- **Google Generative AI**: Additional AI capabilities (future expansion)

### Development Tools
- **Linting**: ESLint with React plugins
- **Concurrency**: Concurrently for running multiple dev servers
- **Package Manager**: npm with monorepo structure

## Installation & Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- MongoDB instance (local or cloud)
- TMDB API key
- Groq API key
- (Optional) Google Generative AI API key
- 
### Key API Endpoints
- Authentication Routes (/api/auth)
- POST /register - User registration
- POST /login - User login
- GET /me - Get current user profile
- PUT /profile - Update user profile
- Chat Routes (/api/chat)
- POST / - Send message to AI concierge
- News Routes (/api/news)
- GET / - Fetch latest entertainment news
- Favorites Routes (/api/favorites)
- GET / - Retrieve user's favorite movies
- POST / - Add movie to favorites
- DELETE /:tmdbId - Remove movie from favorites
- PUT /:tmdbId - Update movie review/rating

### Environment Configuration

1. **Server Configuration** (`server/.env`)
```env
MONGODB_URI=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key
GROQ_API_KEY=your_groq_api_key
PORT=5000
# Install all dependencies (root, client, and server)
npm run install-all
# Or install separately
npm install
npm install --prefix client
npm install --prefix server
# Development mode (runs both server and client concurrently)
npm run dev

# Run server only
npm start --prefix server

# Run client only
npm run dev --prefix client

# Production build (client)
npm run build --prefix client

# Preview production build
npm run preview --prefix client
