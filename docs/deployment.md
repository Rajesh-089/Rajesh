# AgriGuide AI – Deployment Guide

This guide details deploying AgriGuide AI to production using **Vercel** (Frontend) and **Render / Railway / Fly.io / VPS** (Backend).

---

## 1. Supabase Production Setup
1. Create a production project in [Supabase](https://supabase.com).
2. Run `supabase/migrations/20261106_initial_schema.sql` in the Supabase SQL editor.
3. Run `supabase/seed.sql` to populate the crop catalogue.
4. Under **Authentication** -> **URL Configuration**:
   - Set **Site URL** to your production frontend URL (e.g., `https://agriguide-ai.vercel.app`).
   - Add your production redirect URLs.

---

## 2. Backend Deployment (Render / Railway / Node.js Host)
1. Push your repository to GitHub.
2. Create a new **Web Service** pointing to the repository.
3. Set the **Root Directory** to `server`.
4. Build Command: `npm install`
5. Start Command: `node src/server.js`
6. Configure Production Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or provided by host via `$PORT`)
   - `CLIENT_URL=https://agriguide-ai.vercel.app`
   - `SUPABASE_URL=https://<your-project-id>.supabase.co`
   - `SUPABASE_ANON_KEY=<your-production-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY=<your-production-service-role-key>`
   - `GEMINI_API_KEY=<your-production-gemini-key>`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `WEATHER_API_KEY=<your-weather-key>`
7. Test the health endpoint: `https://<backend-url>/api/v1/health`.

---

## 3. Frontend Deployment (Vercel)
1. In Vercel, click **Add New Project** and import the GitHub repository.
2. Set **Framework Preset** to `Vite`.
3. Set **Root Directory** to `client`.
4. Configure Environment Variables:
   - `VITE_API_BASE_URL=https://<backend-url>/api/v1`
   - `VITE_SUPABASE_URL=https://<your-project-id>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=<your-production-anon-key>`
5. Deploy.

---

## 4. Post-Deployment Verification Checklist
- [ ] User can register and log in via Supabase Auth.
- [ ] Profile is populated on signup.
- [ ] Land parcel creation succeeds and renders on dashboard.
- [ ] Crop recommendation wizard submits successfully and displays AI ranked recommendations.
- [ ] Advisory history correctly lists previous records and details can be reopened.
- [ ] Chatbot responds to agricultural queries.
- [ ] Rate limits prevent API abuse.
- [ ] RLS policies prevent User A from reading User B's records.
