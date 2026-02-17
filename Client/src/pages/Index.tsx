import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowRight, Brain, Leaf, Shield, BarChart3, Utensils } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";

const features = [
  { icon: Brain, title: "AI-Powered Plans", desc: "Personalized nutrition recommendations using intelligent algorithms" },
  { icon: Leaf, title: "Indian Diet Focus", desc: "Built around real Indian food items and dietary patterns" },
  { icon: BarChart3, title: "Track Daily Macros", desc: "Monitor calories, protein, carbs & fat intake effortlessly" },
  { icon: Utensils, title: "Smart Meal Logging", desc: "Log meals with photos and get next meal suggestions" },
  { icon: Shield, title: "Explainable AI", desc: "Understand why each recommendation is made for you" },
];

const Index = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleSignInWithGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <span className="font-display text-xl font-bold text-foreground">NutriAI</span>
          </div>
          <Button onClick={handleSignInWithGoogle} variant="outline" className="font-body gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium font-body mb-6">
                🇮🇳 Made for Indian Diets
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight text-foreground mb-6">
                Your AI-Powered{" "}
                <span className="text-gradient">Nutrition</span>{" "}
                Companion
              </h1>
              <p className="text-lg text-muted-foreground font-body mb-8 max-w-lg">
                Get personalized Indian diet plans based on your health goals, BMI, and preferences. 
                Track meals, monitor macros, and let AI guide your nutrition journey.
              </p>
              <Button
                size="lg"
                onClick={handleSignInWithGoogle}
                className="gradient-hero text-primary-foreground font-body text-lg px-8 py-6 gap-2 shadow-warm hover:scale-105 transition-transform"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-elevated">
                <img src={heroFood} alt="Indian food spread" className="w-full h-80 lg:h-[420px] object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-elevated">
                <p className="text-sm font-body text-muted-foreground">Daily Goal</p>
                <p className="text-2xl font-bold text-primary font-body">2,100 <span className="text-sm text-muted-foreground">kcal</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-4">
              Why NutriAI?
            </h2>
            <p className="text-muted-foreground font-body max-w-md mx-auto">
              A smarter approach to Indian nutrition, powered by AI
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg gradient-hero flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="gradient-hero rounded-2xl p-12 md:p-16 shadow-elevated"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground mb-4">
              Start Your Nutrition Journey Today
            </h2>
            <p className="text-primary-foreground/80 font-body mb-8 max-w-md mx-auto">
              Join thousands of Indians making smarter food choices with AI-powered recommendations.
            </p>
            <Button
              size="lg"
              onClick={handleSignInWithGoogle}
              className="bg-card text-foreground hover:bg-card/90 font-body text-lg px-8 py-6 gap-2"
            >
              Sign in with Google <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-body">
            © 2026 NutriAI — AI-Based Nutrition Recommendation System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
