import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MacroRing from "@/components/MacroRing";
import MealCard from "@/components/MealCard";
import MealSuggestions from "@/components/MealSuggestions";
import AddMealDialog from "@/components/AddMealDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Flame, Target } from "lucide-react";
import { motion } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [meals, setMeals] = useState<Tables<"meal_logs">[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoadingData(true);

    const [profileRes, mealsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("meal_logs").select("*").eq("user_id", user.id).eq("log_date", new Date().toISOString().split("T")[0]).order("created_at", { ascending: true }),
    ]);

    if (profileRes.data) {
      if (!profileRes.data.onboarding_completed) {
        navigate("/onboarding");
        return;
      }
      setProfile(profileRes.data);
    } else if (profileRes.error?.code === "PGRST116") {
      navigate("/onboarding");
      setLoadingData(false);
      return;
    }
    if (mealsRes.data) setMeals(mealsRes.data);
    setLoadingData(false);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  if (authLoading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-glow w-16 h-16 rounded-full gradient-hero" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to setup...</p>
      </div>
    );
  }

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein_g || 0),
      carbs: acc.carbs + (m.carbs_g || 0),
      fat: acc.fat + (m.fat_g || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const bmi = profile.weight_kg && profile.height_cm
    ? (Number(profile.weight_kg) / Math.pow(Number(profile.height_cm) / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="font-display text-xl font-bold text-foreground">NutriAI</span>
          </div>
          <div className="flex items-center gap-2">
            <AddMealDialog onMealAdded={fetchData} />
            <Button variant="ghost" size="icon" onClick={() => navigate("/onboarding")}>
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            Hello, {profile.full_name || "there"} 👋
          </h1>
          <p className="text-muted-foreground font-body mt-1">
            Here's your nutrition overview for today
          </p>
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "BMI", value: bmi || "—", icon: Target, color: "text-primary" },
            { label: "Goal", value: profile.goal === "lose" ? "Lose" : profile.goal === "gain" ? "Gain" : "Maintain", icon: Flame, color: "text-accent" },
            { label: "Diet", value: profile.dietary_preference || "—", icon: () => <span className="text-lg">🌿</span>, color: "text-secondary" },
            { label: "Activity", value: profile.activity_level || "—", icon: () => <span className="text-lg">🏃</span>, color: "text-primary" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={s.color}><s.icon className="w-5 h-5" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground font-body">{s.label}</p>
                    <p className="font-semibold text-foreground font-body capitalize">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Macro rings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg">Today's Macros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around flex-wrap gap-4">
                <MacroRing label="Calories" current={totals.calories} target={profile.target_calories || 2000} unit=" kcal" color="hsl(var(--primary))" />
                <MacroRing label="Protein" current={totals.protein} target={profile.target_protein || 100} unit="g" color="hsl(var(--secondary))" />
                <MacroRing label="Carbs" current={totals.carbs} target={profile.target_carbs || 250} unit="g" color="hsl(var(--accent))" />
                <MacroRing label="Fat" current={totals.fat} target={profile.target_fat || 60} unit="g" color="hsl(var(--saffron))" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Meals */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-display font-bold text-foreground mb-4">Today's Meals</h2>
            {meals.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <span className="text-4xl">🍽️</span>
                  <p className="text-muted-foreground font-body mt-3">No meals logged yet today</p>
                  <p className="text-sm text-muted-foreground font-body">Click "Log Meal" to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {meals.map((m) => (
                  <MealCard
                    key={m.id}
                    mealType={m.meal_type}
                    mealName={m.meal_name}
                    calories={m.calories || 0}
                    protein={m.protein_g || 0}
                    carbs={m.carbs_g || 0}
                    imageUrl={m.image_url || undefined}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* AI Suggestions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-display font-bold text-foreground mb-4">AI Recommendations</h2>
            <MealSuggestions />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
