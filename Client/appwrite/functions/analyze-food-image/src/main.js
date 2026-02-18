// Appwrite Cloud Function - AI meal detection
// Set env vars in Appwrite Console: GEMINI_API_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN, or HUGGINGFACE_TOKEN

const INDIAN_DISH_MAP = [
  { keywords: ["dal", "lentil", "daal"], meal_name: "Dal Chawal", calories: 380, protein_g: 14, carbs_g: 62, fat_g: 8 },
  { keywords: ["rice", "chawal", "biryani"], meal_name: "Rice with Curry", calories: 350, protein_g: 10, carbs_g: 65, fat_g: 6 },
  { keywords: ["roti", "chapati", "paratha"], meal_name: "Roti with Sabzi", calories: 320, protein_g: 10, carbs_g: 48, fat_g: 10 },
  { keywords: ["paneer", "cottage cheese"], meal_name: "Paneer Curry", calories: 280, protein_g: 18, carbs_g: 8, fat_g: 20 },
  { keywords: ["idli", "dosa", "sambar"], meal_name: "Idli with Sambar", calories: 220, protein_g: 8, carbs_g: 38, fat_g: 4 },
  { keywords: ["curry", "sabzi", "vegetable"], meal_name: "Indian Curry", calories: 250, protein_g: 8, carbs_g: 30, fat_g: 10 },
  { keywords: ["bread", "naan"], meal_name: "Naan with Curry", calories: 400, protein_g: 12, carbs_g: 55, fat_g: 14 },
];

function captionToMeal(caption) {
  const lower = caption.toLowerCase();
  for (const dish of INDIAN_DISH_MAP) {
    if (dish.keywords.some((k) => lower.includes(k))) {
      return { meal_name: dish.meal_name, calories: dish.calories, protein_g: dish.protein_g, carbs_g: dish.carbs_g, fat_g: dish.fat_g };
    }
  }
  return { meal_name: "Indian Meal", calories: 350, protein_g: 12, carbs_g: 50, fat_g: 10 };
}

function parseAndValidate(text, caption) {
  let parsed = {};
  try {
    parsed = JSON.parse(text);
  } catch {
    const m = text.match(/\{[\s\S]*\}/);
    if (m) parsed = JSON.parse(m[0]);
  }
  let mealName = String(parsed.meal_name || "").trim();
  let calories = Math.round(Number(parsed.calories) || 0);
  let protein_g = Math.round(Number(parsed.protein_g) || 0);
  let carbs_g = Math.round(Number(parsed.carbs_g) || 0);
  let fat_g = Math.round(Number(parsed.fat_g) || 0);

  if ((!mealName || mealName.toLowerCase() === "unknown") && caption) return captionToMeal(caption);
  if (!mealName || mealName.length < 2) {
    if (caption) return captionToMeal(caption);
    throw new Error("Could not identify the dish. Please ensure the food is clearly visible in the image.");
  }
  if (calories <= 0) {
    calories = 350;
    protein_g = protein_g || 12;
    carbs_g = carbs_g || 50;
    fat_g = fat_g || 10;
  }
  return { meal_name: mealName, calories, protein_g, carbs_g, fat_g };
}

async function analyzeWithGemini(apiKey, mimeType, base64Data) {
  const prompt = `Identify the Indian food in this image. Name the dish (e.g. Dal Chawal, Paneer Tikka, Rice with Curry). Estimate calories, protein_g, carbs_g, fat_g for the visible portion.
Return ONLY valid JSON: {"meal_name":"exact dish name","calories":300,"protein_g":12,"carbs_g":45,"fat_g":8}`;
  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ inline_data: { mime_type: mimeType, data: base64Data } }, { text: prompt }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.1 },
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) continue;
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (text) return text;
    } catch (e) {
      /* continue */
    }
  }
  throw new Error("Gemini failed");
}

async function analyzeWithOpenAI(apiKey, mimeType, base64Data) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Data}` } },
          { type: "text", text: "Identify the Indian food in this image. Name the dish. Estimate calories, protein_g, carbs_g, fat_g. Return ONLY valid JSON: {\"meal_name\":\"name\",\"calories\":N,\"protein_g\":N,\"carbs_g\":N,\"fat_g\":N}" },
        ],
      }],
      max_tokens: 256,
      temperature: 0.1,
    }),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json?.error?.message || "OpenAI failed");
  const text = json?.choices?.[0]?.message?.content?.trim() || "";
  if (!text) throw new Error("OpenAI empty");
  return text;
}

async function analyzeWithReplicate(token, imageDataUri) {
  const res = await fetch("https://api.replicate.com/v1/predictions?wait=60", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      version: "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
      input: { image: imageDataUri },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.detail || `Replicate: ${res.status}`);
  const caption = typeof json.output === "string" ? json.output : json.output?.[0] || "";
  if (!caption) throw new Error("Replicate empty");
  return caption;
}

async function analyzeWithHuggingFace(token, imageBytes) {
  const models = ["Salesforce/blip-image-captioning-base", "Salesforce/blip-image-captioning-large"];
  let caption = "";
  for (const model of models) {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" },
      body: imageBytes,
    });
    if (res.status === 410) continue;
    if (res.ok) {
      const d = await res.json();
      caption = d?.[0]?.generated_text || "";
      if (caption) break;
    }
  }
  if (!caption) throw new Error("Hugging Face failed");
  return { text: "", caption };
}

export default async ({ req, res, log, error }) => {
  try {
    const body = req.bodyJson || {};
    const imageBase64 = body.imageBase64;
    if (!imageBase64) {
      return res.json({ error: "imageBase64 is required" });
    }

    let mimeType = "image/jpeg";
    let base64Data = imageBase64;
    if (imageBase64.startsWith("data:")) {
      const match = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }
    const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const imageDataUri = `data:${mimeType};base64,${base64Data}`;

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const replicateToken = process.env.REPLICATE_API_TOKEN;
    const hfToken = process.env.HUGGINGFACE_TOKEN;

    let text = "";
    let caption = "";

    const providers = [
      { name: "Gemini", run: () => geminiKey && analyzeWithGemini(geminiKey, mimeType, base64Data) },
      { name: "OpenAI", run: () => openaiKey && analyzeWithOpenAI(openaiKey, mimeType, base64Data) },
      { name: "Replicate", run: () => replicateToken && analyzeWithReplicate(replicateToken, imageDataUri) },
      { name: "HuggingFace", run: () => hfToken && analyzeWithHuggingFace(hfToken, imageBytes) },
    ];

    for (let i = 0; i < providers.length; i++) {
      const run = providers[i].run();
      if (!run) continue;
      try {
        const result = await run;
        if (i === 2) {
          const meal = captionToMeal(result);
          return res.json(meal);
        }
        if (i === 3) {
          text = result.text;
          caption = result.caption;
        } else {
          text = result;
        }
        const parsed = parseAndValidate(text || "{}", caption);
        return res.json(parsed);
      } catch (e) {
        log(`${providers[i].name} failed: ${e.message}`);
      }
    }

    return res.json({ error: "AI detection failed. Set GEMINI_API_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN, or HUGGINGFACE_TOKEN in Appwrite Function env vars." });
  } catch (err) {
    error(err);
    return res.json({ error: err instanceof Error ? err.message : "Analysis failed" });
  }
};
