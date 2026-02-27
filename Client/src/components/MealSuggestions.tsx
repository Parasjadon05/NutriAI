import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { recipes } from "@/data/recipes";

interface Suggestion {
  name: string;
  calories: number;
  protein: number;
  description: string;
}

const vegMealNames = [
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

const nonVegMealNames = [
  "Chicken Curry",
  "Egg Bhurji",
  "Fish Fry",
  "Mutton Biryani",
  "Chicken Tikka",
  "Egg Paratha",
  "Prawn Curry",
  "Chicken Pulao",
  "Fish Curry",
  "Keema Matar",
  "Chicken Salad",
  "Egg Rice",
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

const generateRandomSuggestions = (dietaryPreference?: string | null): Suggestion[] => {
  const isNonVeg = dietaryPreference === "non-vegetarian";
  const mealNames = isNonVeg ? nonVegMealNames : vegMealNames;
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

interface MealSuggestionsProps {
  dietaryPreference?: string | null;
}

const MealSuggestions = ({ dietaryPreference }: MealSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Suggestion | null>(null);

  useEffect(() => {
    setSuggestions(generateRandomSuggestions(dietaryPreference));
  }, [dietaryPreference]);

  const recipe = selectedRecipe ? recipes[selectedRecipe.name] : null;

  if (suggestions.length === 0) return null;

  return (
    <>
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Sparkles className="w-5 h-5 text-primary" />
            Suggested Next Meals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedRecipe(s)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left cursor-pointer"
            >
              <div>
                <p className="font-semibold text-sm text-foreground font-body">{s.name}</p>
                <p className="text-xs text-muted-foreground font-body">{s.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary font-body">{s.calories} kcal</p>
                <p className="text-xs text-secondary font-body">{s.protein}g protein</p>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{selectedRecipe?.name}</DialogTitle>
          </DialogHeader>
          {selectedRecipe && (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <span className="font-semibold text-primary">{selectedRecipe.calories} kcal</span>
                <span className="text-secondary">{selectedRecipe.protein}g protein</span>
              </div>
              {recipe ? (
                <>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Ingredients</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Method</h4>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                      {recipe.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Recipe not available.</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealSuggestions;
