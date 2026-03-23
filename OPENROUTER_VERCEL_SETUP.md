# OpenRouter + Vercel Setup for Chat Widget

This project uses a secure serverless proxy at `/api/chat`.
The browser never sees your OpenRouter key.

## 1. Add Environment Variables in Vercel

**IMPORTANT:** Go to Vercel Project Settings → Environment Variables and add:

- `OPENROUTER_API_KEY` = your real OpenRouter API key (from https://openrouter.ai/keys)
- `OPENROUTER_MODEL` = `openai/gpt-4o-mini` (or any OpenRouter model slug)
- `SITE_URL` = your deployed website URL (e.g., `https://seelam.app`)
- `SITE_NAME` = `Vamsi Portfolio Chatbot`

Then click Save and Redeploy.

## 2. Verify Deployment Works

After redeploy, check:
1. Visit `https://your-site.vercel.app/api/chat` — should show `{"ok":true,"service":"chat-api"}`
2. Open Vercel Dashboard → Deployments → Latest → Logs tab to check for errors

## 3. Local Testing

### Setup

```powershell
npm install -g vercel
copy .env.example .env.local
# Edit .env.local and add your OPENROUTER_API_KEY
```

### Run

```powershell
vercel dev
```

Opens `http://localhost:3000` with `/api/chat` endpoint available.

## 4. If Chat Shows "Offline"

1. Check browser console (F12 → Console tab) for error messages
2. Check if running from `file://...` — use `vercel dev` instead
3. For deployed version, check Vercel Logs for API errors
4. Verify `OPENROUTER_API_KEY` is set in Vercel Project Settings

## 5. Security Notes

- Keep secrets only in Vercel env vars or `.env.local` (never commit)
- Do not put API keys in `config.js` or `script.js`
- `.env` and `.env.local` are gitignored
