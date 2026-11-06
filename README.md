# Kunal Singh – Portfolio

React + Vite frontend, Supabase backend (Postgres, Auth, Realtime).

## Setup
1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env` and fill in the project URL and publishable key.
3. `npm install && npm run dev`
4. Sign up on the site with `kunalsingh886312@gmail.com` to get /admin access (edit `admin_emails` to change).

## Deploy
Import the repo into Vercel or Netlify, add the two `VITE_` env vars, build command `npm run build`, output `dist`.
In Supabase → Auth → URL Configuration, set Site URL to the deployed domain.
