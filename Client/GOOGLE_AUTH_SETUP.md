# Google Auth Setup Guide

Follow these steps to enable Sign in with Google for NutriAI.

## 1. Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **Authentication** → **Providers** → **Google** → Enable
3. **Authentication** → **URL Configuration**:
   - **Site URL**: `http://localhost:8080` (dev) or your production URL
   - **Redirect URLs**: Add `http://localhost:8080/` and your production URL (e.g. `https://yourdomain.com/`)
4. Copy the **Callback URL** shown in the Google provider settings (e.g. `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)

## 2. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. **APIs & Services** → **OAuth consent screen**:
   - User Type: **External** → Create
   - App name: `NutriAI`
   - User support email: your email
   - Developer contact: your email
   - Add your email under **Test users** (required while app is in testing)
   - Save
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**:
   - Application type: **Web application**
   - Name: `NutriAI Web`
   - **Authorized redirect URIs** → Add URI: paste the Supabase callback URL from step 1
   - Create
5. Copy **Client ID** and **Client Secret**

## 3. Supabase – Add Credentials

1. Back in Supabase → **Authentication** → **Providers** → **Google**
2. Paste **Client ID** into "Client IDs"
3. Paste **Client Secret** into "Client Secret (for OAuth)"
4. Click **Save**

## 4. Test

1. Run the app: `npm run dev` or `bun run dev`
2. Click "Sign in with Google"
3. Complete the Google sign-in flow
4. You should be redirected back to the app and signed in

---

**Troubleshooting**

- **"Unsupported provider: missing OAuth secret"** → Client Secret is missing or incorrect in Supabase
- **Redirect mismatch** → Ensure the callback URL in Google Cloud exactly matches Supabase’s callback URL
- **"redirect_uri_mismatch"** → Add your app’s URL to Supabase Redirect URLs and use the exact Supabase callback in Google Cloud
