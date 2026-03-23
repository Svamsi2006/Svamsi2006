# OpenRouter + Vercel Setup for Chat Widget

This project now uses a secure serverless proxy at `/api/chat`.
The browser never sees your OpenRouter key.

## 1. Add environment variables in Vercel

In Vercel: Project Settings -> Environment Variables

Add:
- `OPENROUTER_API_KEY` = your real OpenRouter API key
- `OPENROUTER_MODEL` = `openai/gpt-4o-mini` (or any OpenRouter model slug)
- `SITE_URL` = your deployed website URL (optional)
- `SITE_NAME` = any label for tracking (optional)

## 2. Redeploy

After saving env vars, trigger a redeploy from Vercel so `/api/chat` can read them.

## 3. Local testing (optional)

1. Copy `.env.example` to `.env`
2. Fill in values
3. Run `vercel dev`
4. Open the site and test chat

## 4. Security notes

- Keep secrets only in Vercel env vars
- Do not put API keys in `config.js`
- `.env` is already gitignored in this repo
