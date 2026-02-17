# AI Meal Detection Setup

The meal logging feature tries providers in order until one succeeds: **Gemini** → **OpenAI** → **Replicate** → **Hugging Face**.

## Option 1: Google Gemini (Free tier, may have quota limits)

1. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Set secret: `supabase secrets set GEMINI_API_KEY=your-key`

## Option 2: OpenAI GPT-4o-mini (Recommended – reliable, paid)

1. Get an API key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Set secret: `supabase secrets set OPENAI_API_KEY=sk-xxx`
3. Vision + JSON output – very reliable for food analysis

## Option 3: Replicate (Cheap – ~$0.0002 per run)

1. Sign up at [replicate.com](https://replicate.com) and get an API token
2. Set secret: `supabase secrets set REPLICATE_API_TOKEN=r8_xxx`
3. Uses BLIP for image captioning → Indian dish mapping

## Option 4: Hugging Face (Free, often unreliable)

1. Get a token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Enable **"Make calls to Inference Providers"**
3. Set secret: `supabase secrets set HUGGINGFACE_TOKEN=hf_xxx`

## Deploy

```bash
cd client
supabase link --project-ref nrwwaersfouzfuqfymqn
supabase secrets set OPENAI_API_KEY=sk-xxx   # or GEMINI_API_KEY, REPLICATE_API_TOKEN, etc.
supabase functions deploy analyze-food-image --no-verify-jwt
```

## Recommendation

If Gemini and Hugging Face are failing, use **OpenAI** (most reliable) or **Replicate** (cheap and reliable).
