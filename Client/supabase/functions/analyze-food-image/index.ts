const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const INDIAN_DISH_MAP: Array<{ keywords: string[]; meal_name: string; calories: number; protein_g: number; carbs_g: number; fat_g: number }> = [
  { keywords: ["dal", "lentil", "daal"], meal_name: "Dal Chawal", calories: 380, protein_g: 14, carbs_g: 62, fat_g: 8 },
  { keywords: ["rice", "chawal", "biryani"], meal_name: "Rice with Curry", calories: 350, protein_g: 10, carbs_g: 65, fat_g: 6 },
  { keywords: ["roti", "chapati", "paratha"], meal_name: "Roti with Sabzi", calories: 320, protein_g: 10, carbs_g: 48, fat_g: 10 },
  { keywords: ["paneer", "cottage cheese"], meal_name: "Paneer Curry", calories: 280, protein_g: 18, carbs_g: 8, fat_g: 20 },
  { keywords: ["idli", "dosa", "sambar"], meal_name: "Idli with Sambar", calories: 220, protein_g: 8, carbs_g: 38, fat_g: 4 },
  { keywords: ["curry", "sabzi", "vegetable"], meal_name: "Indian Curry", calories: 250, protein_g: 8, carbs_g: 30, fat_g: 10 },
  { keywords: ["bread", "naan"], meal_name: "Naan with Curry", calories: 400, protein_g: 12, carbs_g: 55, fat_g: 14 },
];

function captionToMeal(caption: string): { meal_name: string; calories: number; protein_g: number; carbs_g: number; fat_g: number } {
  const lower = caption.toLowerCase();
  for (const dish of INDIAN_DISH_MAP) {
    if (dish.keywords.some((k) => lower.includes(k))) {
      return { meal_name: dish.meal_name, calories: dish.calories, protein_g: dish.protein_g, carbs_g: dish.carbs_g, fat_g: dish.fat_g };
    }
  }
  return { meal_name: "Indian Meal", calories: 350, protein_g: 12, carbs_g: 50, fat_g: 10 };
}

function parseAndValidate(text: string, caption?: string): { meal_name: string; calories: number; protein_g: number; carbs_g: number; fat_g: number } {
  let parsed: Record<string, unknown> = {};
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

  if ((!mealName || mealName.toLowerCase() === "unknown") && caption) {
    const fromCaption = captionToMeal(caption);
    return fromCaption;
  }
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

const GEMINI_MODELS = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];

async function analyzeWithGemini(apiKey: string, mimeType: string, base64Data: string): Promise<string> {
  const prompt = `Identify the Indian food in this image. Name the dish (e.g. Dal Chawal, Paneer Tikka, Rice with Curry). Estimate calories, protein_g, carbs_g, fat_g for the visible portion.
Return ONLY valid JSON: {"meal_name":"exact dish name","calories":300,"protein_g":12,"carbs_g":45,"fat_g":8}`;
  let lastErr: Error | null = null;
  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: mimeType, data: base64Data } },
                { text: prompt },
              ],
            }],
            generationConfig: { maxOutputTokens: 512, temperature: 0.1 },
          }),
        }
      );
      const json = await res.json();
      if (!res.ok || json.error) {
        lastErr = new Error(json.error?.message || `Gemini ${model}: ${res.status}`);
        continue;
      }
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
      if (!text) {
        lastErr = new Error(`Gemini ${model} blocked or empty: ${json?.candidates?.[0]?.finishReason || "No response"}`);
        continue;
      }
      return text;
    } catch (e) {
      lastErr = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastErr || new Error("Gemini failed for all models");
}

const HF_IMAGE_MODELS = [
  "Salesforce/blip-image-captioning-base",
  "Salesforce/blip-image-captioning-large",
  "nlpconnect/vit-gpt2-image-captioning",
  "Microsoft/git-large-coco",
];

async function analyzeWithHuggingFace(token: string, imageBytes: Uint8Array): Promise<{ text: string; caption: string }> {
  let caption = "";
  for (const model of HF_IMAGE_MODELS) {
    const captionRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" },
      body: imageBytes,
    });
    if (captionRes.status === 410) continue;
    if (captionRes.status === 503) {
      await new Promise((r) => setTimeout(r, 3000));
      const retry = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/octet-stream" },
        body: imageBytes,
      });
      if (retry.ok) {
        const d = await retry.json();
        caption = d?.[0]?.generated_text || "";
        if (caption) break;
      }
    } else if (captionRes.ok) {
      const captionData = await captionRes.json();
      caption = captionData?.[0]?.generated_text || (typeof captionData === "string" ? captionData : "");
      if (caption) break;
    }
  }
  if (!caption) throw new Error("AI detection failed. Set GEMINI_API_KEY in Supabase secrets (see AI_MEAL_DETECTION_SETUP.md) or enter meal manually.");

  try {
    const jsonPrompt = `Food: "${caption}". Give Indian dish name and nutrition. Reply with ONLY valid JSON: {"meal_name":"name","calories":N,"protein_g":N,"carbs_g":N,"fat_g":N}`;
    const textRes = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: jsonPrompt, parameters: { max_new_tokens: 120, return_full_text: false } }),
    });
    if (textRes.ok) {
      const textData = await textRes.json();
      let text = "";
      if (typeof textData === "string") text = textData;
      else if (Array.isArray(textData) && textData[0]?.generated_text) text = textData[0].generated_text;
      else if (textData?.generated_text) text = textData.generated_text;
      if (text) return { text, caption };
    }
  } catch {
    /* fall through to caption-based */
  }
  return { text: "", caption };
}

const REPLICATE_BLIP_VERSION = "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746";

async function analyzeWithReplicate(token: string, imageDataUri: string): Promise<string> {
  const res = await fetch("https://api.replicate.com/v1/predictions?wait=60", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: REPLICATE_BLIP_VERSION,
      input: { image: imageDataUri },
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.detail || `Replicate: ${res.status}`);
  const caption = typeof json.output === "string" ? json.output : json.output?.[0] || "";
  if (!caption) throw new Error("Replicate BLIP returned empty caption");
  return caption;
}

async function analyzeWithOpenAI(apiKey: string, mimeType: string, base64Data: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Data}` },
            },
            {
              type: "text",
              text: "Identify the Indian food in this image. Name the dish (e.g. Dal Chawal, Paneer Tikka). Estimate calories, protein_g, carbs_g, fat_g. Return ONLY valid JSON: {\"meal_name\":\"name\",\"calories\":N,\"protein_g\":N,\"carbs_g\":N,\"fat_g\":N}",
            },
          ],
        },
      ],
      max_tokens: 256,
      temperature: 0.1,
    }),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json?.error?.message || `OpenAI: ${res.status}`);
  const text = json?.choices?.[0]?.message?.content?.trim() || "";
  if (!text) throw new Error("OpenAI returned empty response");
  return text;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const replicateToken = Deno.env.get("REPLICATE_API_TOKEN");
    const hfToken = Deno.env.get("HUGGINGFACE_TOKEN");

    let text = "";
    let caption = "";
    const imageDataUri = `data:${mimeType};base64,${base64Data}`;

    const tryParse = () => parseAndValidate(text || "{}", caption);

    const providers: Array<{ run: () => Promise<unknown> | null }> = [
      { run: () => (geminiKey ? analyzeWithGemini(geminiKey, mimeType, base64Data) : null) },
      { run: () => (openaiKey ? analyzeWithOpenAI(openaiKey, mimeType, base64Data) : null) },
      { run: () => (replicateToken ? analyzeWithReplicate(replicateToken, imageDataUri) : null) },
      { run: () => (hfToken ? analyzeWithHuggingFace(hfToken, imageBytes) : null) },
    ];

    const names = ["Gemini", "OpenAI", "Replicate", "HuggingFace"];
    for (let i = 0; i < providers.length; i++) {
      const run = providers[i].run();
      if (!run) continue;
      try {
        const result = await run;
        if (i === 2) {
          caption = result as string;
          const meal = captionToMeal(caption);
          return new Response(JSON.stringify(meal), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        if (i === 3) {
          const hf = result as { text: string; caption: string };
          text = hf.text;
          caption = hf.caption;
        } else {
          text = result as string;
        }
        const parsed = tryParse();
        return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        console.warn(`${names[i]} failed:`, e);
      }
    }

    throw new Error(
      "AI detection failed. Set one of these in Supabase secrets: GEMINI_API_KEY, OPENAI_API_KEY, REPLICATE_API_TOKEN, or HUGGINGFACE_TOKEN. See AI_MEAL_DETECTION_SETUP.md"
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
