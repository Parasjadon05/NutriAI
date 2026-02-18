# NutriAI — AI-Powered Nutrition App for Indian Diets

A full-stack web application that helps users track meals, monitor macros, and get personalized nutrition recommendations. Built with **Appwrite Cloud** for auth, database, storage, and serverless functions.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend:** Appwrite Cloud (Auth, Databases, Storage, Functions)
- **AI:** Gemini, OpenAI GPT-4o-mini, Replicate BLIP, Hugging Face (multi-provider fallback)

## Setup

1. **Clone & install**
   ```bash
   git clone https://github.com/Parasjadon05/NutriAI.git
   cd NutriAI/Client
   npm install
   ```

2. **Configure Appwrite** — See [APPWRITE_SETUP.md](./APPWRITE_SETUP.md) for:
   - Google OAuth
   - Database collections (profiles, meal_logs)
   - Storage bucket (meal-images)
   - Cloud Function (analyze-food-image)

3. **Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Appwrite endpoint, project ID, database ID, function ID
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Project Structure

```
Client/
├── src/
│   ├── components/     # AddMealDialog, MacroRing, MealCard, MealSuggestions
│   ├── contexts/      # AuthContext (Appwrite)
│   ├── integrations/  # appwrite/client.ts
│   └── pages/         # Index, Dashboard, Onboarding
├── appwrite/
│   └── functions/
│       └── analyze-food-image/   # AI meal detection
└── APPWRITE_SETUP.md
```
