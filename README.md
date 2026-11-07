# AgriGuide AI – AI-Powered Agriculture Crop Advisory Assistant

🌱 **AgriGuide AI** is a production-grade, full-stack agricultural decision-support platform designed for Indian farming communities, agricultural students, and agronomists. It converts land characteristics, soil chemical profiles (NPK & pH), weather insights, and seasonal factors into hyper-localized, actionable crop recommendations using Google Gemini AI and Supabase PostgreSQL.

---

## 🌟 Key Features

1. **Intelligent Crop Suitability Recommendations**:
   - Matches soil type, pH, NPK levels, regional season (Kharif, Rabi, Zaid), and water availability against agricultural crop biology.
   - Powered by official `@google/genai` SDK using strict structured JSON schemas.
   - Returns ranked options with suitability scores, soil compatibility notes, and agricultural limitations.

2. **Fertilizer & Nutrient Advisory**:
   - Calculates stage-by-stage nutrient requirements based on soil deficiencies, target crop, and organic/chemical preferences.

3. **Irrigation & Weather Scheduling**:
   - Offers dynamic water management advice accounting for crop growth phase, soil water retention, and rainfall forecasts.

4. **Pest & Plant Disease Diagnostics**:
   - Evaluates crop symptoms to suggest potential pests or pathogens, Integrated Pest Management (IPM) measures, and safety warnings.

5. **AI Agricultural Chatbot**:
   - Real-time agricultural decision assistant answering questions in English, Kannada, and Hindi.

6. **Farmer Profile & Multi-Parcel Land Management**:
   - Full CRUD support for farm plots with soil records and measurement conversions (acres, hectares, gunthas).

7. **Advisory History & Review**:
   - Automatically stores all generated advisories with full details, printable views, and deletion controls.

8. **Enterprise Security & Isolation**:
   - Supabase Row Level Security (RLS) guarantees complete data isolation between farmers.
   - Zero exposure of AI API keys or database service-role secrets in frontend code.
   - Comprehensive server-side Zod input sanitization and rate limiting.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, React Hook Form, Zod.
- **Backend**: Node.js, Express.js (ES Modules), Helmet, CORS, Express Rate Limit, Morgan.
- **Database & Auth**: Supabase PostgreSQL 15+, Supabase Auth, Row Level Security (RLS).
- **AI Integration**: Google Gemini API via official `@google/genai` SDK (`gemini-2.5-flash`).
- **Weather Service**: OpenWeatherMap API abstraction with error-safe fallbacks.

---

## 📁 Repository Structure

```text
agriguide-ai/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable UI & agricultural components
│   │   ├── pages/       # Complete routed pages (Landing, Dashboard, Advisory, etc.)
│   │   ├── context/     # Supabase Auth and Language state providers
│   │   ├── services/    # Backend API client integration
│   │   ├── schemas/     # Frontend Zod validation schemas
│   │   └── i18n/        # Multilingual strings (English, Kannada, Hindi)
│   └── package.json
├── server/              # Node.js + Express backend
│   ├── src/
│   │   ├── config/      # Environment, Gemini & Supabase clients
│   │   ├── controllers/ # Request handlers for lands, advisories, chat
│   │   ├── services/    # Gemini AI service, Weather service, Supabase service
│   │   ├── middleware/  # Auth verification, rate limiting, error handling
│   │   ├── routes/      # Express API routers under /api/v1
│   │   ├── schemas/     # Zod request & Gemini output schemas
│   │   └── prompts/     # Agronomic system & task prompts
│   └── package.json
├── supabase/            # PostgreSQL migrations & seed data
├── docs/                # Setup, API documentation & deployment guides
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Execute `supabase/migrations/20261106_initial_schema.sql` in the Supabase SQL Editor.
3. Execute `supabase/seed.sql` to populate the crop catalogue.

### 2. Configure Environment Variables
Copy `.env.example` in both `server` and `client`:
- In `server/.env`: Provide `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.
- In `client/.env`: Provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### 3. Install & Run
```bash
# In server directory:
cd server
npm install
npm run dev

# In a new terminal, in client directory:
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.
See [docs/setup.md](docs/setup.md) for detailed step-by-step instructions.
