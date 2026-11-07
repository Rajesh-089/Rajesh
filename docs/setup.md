# AgriGuide AI – Setup Guide

Welcome to **AgriGuide AI**, an intelligent agricultural crop advisory and decision-support platform designed for Indian farming conditions.

---

## 1. Prerequisites

Before running the application locally, ensure you have:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Git**
- A **Supabase** account (Free tier at [supabase.com](https://supabase.com))
- A **Google Gemini API Key** (Free tier at [aistudio.google.com](https://aistudio.google.com))
- (Optional) An **OpenWeatherMap API Key** (Free tier at [openweathermap.org](https://openweathermap.org))

---

## 2. Project Architecture

The repository contains:
- `client/`: React + Vite frontend with Tailwind CSS and Lucide icons.
- `server/`: Node.js + Express backend with `@google/genai` and `@supabase/supabase-js`.
- `supabase/`: PostgreSQL migration files and crop catalogue seed scripts.
- `docs/`: Comprehensive API and deployment documentation.

---

## 3. Database Configuration (Supabase)

1. Log into your **Supabase Dashboard** and create a new project (e.g., `agriguide-ai`).
2. Go to the **SQL Editor** tab in the left sidebar.
3. Open `supabase/migrations/20261106_initial_schema.sql` from this repository, paste the contents into the SQL Editor, and click **Run**.
4. Open `supabase/seed.sql`, paste into the SQL Editor, and click **Run** to populate the crop catalogue.
5. In your Supabase Dashboard:
   - Navigate to **Project Settings** -> **API**.
   - Note your **Project URL** (`https://<project-ref>.supabase.co`).
   - Copy the **anon public key**.
   - Copy the **service_role secret key** (Keep this secure; only put it in `server/.env`).

---

## 4. Environment Variables Setup

### Server Environment (`server/.env`)
Create or edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Weather Provider
WEATHER_API_KEY=your-weather-api-key
WEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5

# Security
JWT_AUDIENCE=authenticated
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Environment (`client/.env`)
Create or edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 5. Running the Application

### Option A: Running with Monorepo Commands
From the project root:
```bash
# Terminal 1: Run Backend
npm --prefix server run dev

# Terminal 2: Run Frontend
npm --prefix client run dev
```

### Option B: Running Separately
```bash
# In the server folder:
cd server
npm run dev

# In a separate terminal, in the client folder:
cd client
npm run dev
```

- **Frontend URL**: `http://localhost:5173`
- **Backend API URL**: `http://localhost:5000/api/v1`
- **Health Check Endpoint**: `http://localhost:5000/api/v1/health`
