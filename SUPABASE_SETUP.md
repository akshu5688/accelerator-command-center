# Connect the App to Supabase

If you see "No users" in Supabase after logging in, the app is in **demo mode** (localStorage). Connect it to your Supabase project:

## Step 1: Get Supabase credentials

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select **tech637's Project** (or your project)
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 2: Add to Vercel (production)

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (accelerator-command-center)
3. Go to **Settings** → **Environment Variables**
4. Add:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
5. Redeploy: **Deployments** → latest → **Redeploy**

## Step 3: Add locally (development)

1. Create `.env` in the project root (copy from `.env.example`)
2. Set:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart dev server: `npm run dev`

## Step 4: Supabase URL configuration

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL**: `https://your-vercel-app.vercel.app` (or your domain)
- **Redirect URLs**: add `https://your-vercel-app.vercel.app/auth/callback`

In **Authentication** → **Providers** → **Email**:

- Enable **Confirm email**

## Verify

After redeploying, sign up with a new email. The user should appear in Supabase → **Authentication** → **Users**.
