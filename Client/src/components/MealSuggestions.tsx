import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface Suggestion {
  name: string;
  calories: number;
  protein: number;
  description: string;
}

const defaultSuggestions: Suggestion[] = [
  { name: "Moong Dal Chilla", calories: 180, protein: 12, description: "High protein lentil crepe with veggies" },
  { name: "Paneer Bhurji", calories: 250, protein: 18, description: "Scrambled cottage cheese with spices" },
  { name: "Sprouts Salad", calories: 120, protein: 8, description: "Mixed sprouts with lemon & chaat masala" },
  { name: "Ragi Dosa", calories: 150, protein: 6, description: "Finger millet dosa with coconut chutney" },
];

interface MealSuggestionsProps {
  suggestions?: Suggestion[];
}

const MealSuggestions = ({ suggestions = defaultSuggestions }: MealSuggestionsProps) => (
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

export default MealSuggestions;
