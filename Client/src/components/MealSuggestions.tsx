import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Suggestion {
  name: string;
  calories: number;
  protein: number;
  description: string;
}

const mealNames = [
  "Moong Dal Chilla",
  "Paneer Bhurji",
  "Sprouts Salad",
  "Ragi Dosa",
  "Dal Chawal",
  "Vegetable Pulao",
  "Chana Masala",
  "Palak Paneer",
  "Idli with Sambar",
  "Poha",
  "Upma",
  "Dahi Chaat",
];

const descriptions = [
  "Balanced meal with good macros",
  "High protein option",
  "Light and nutritious",
  "Filling and satisfying",
  "Quick and healthy choice",
  "Nutrient-dense option",
  "Well-rounded meal",
  "Energy-boosting selection",
];

const shuffle = <T,>(arr: T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const generateRandomSuggestions = (): Suggestion[] => {
  const seen = new Set<string>();
  const suggestions: Suggestion[] = [];
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffledNames = shuffle(mealNames);
  const shuffledDescs = shuffle(descriptions);

  for (let i = 0; i < 4; i++) {
    let calories = rand(120, 350);
    let protein = rand(6, 22);
    let key = `${calories}-${protein}`;
    let attempts = 0;
    while (seen.has(key) && attempts++ < 20) {
      calories = rand(120, 350);
      protein = rand(6, 22);
      key = `${calories}-${protein}`;
    }
    seen.add(key);
    suggestions.push({
      name: shuffledNames[i],
      calories,
      protein,
      description: shuffledDescs[i % shuffledDescs.length],
    });
  }
  return suggestions;
};

const MealSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    setSuggestions(generateRandomSuggestions());
  }, []);

  if (suggestions.length === 0) return null;

  return (
  <Card className="shadow-card">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-lg font-display">
        <Sparkles className="w-5 h-5 text-primary" />
        Suggested Next Meals
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {suggestions.map((s, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <div>
            <p className="font-semibold text-sm text-foreground font-body">{s.name}</p>
            <p className="text-xs text-muted-foreground font-body">{s.description}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-primary font-body">{s.calories} kcal</p>
            <p className="text-xs text-secondary font-body">{s.protein}g protein</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
  );
};

export default MealSuggestions;
