import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Camera, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AddMealDialogProps {
  onMealAdded: () => void;
}

const AddMealDialog = ({ onMealAdded }: AddMealDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [mealType, setMealType] = useState("breakfast");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mealNameRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const compressImage = (file: File, maxSize = 1024): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  };

  const analyzeWithAI = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    try {
      const base64 = await compressImage(imageFile);

      const { data, error } = await supabase.functions.invoke("analyze-food-image", {
        body: { imageBase64: base64 },
      });

      if (error) throw error;

      if (data?.meal_name && (data?.calories ?? 0) > 0) {
        setMealName(data.meal_name);
        setCalories(String(data.calories ?? 0));
        setProtein(String(data.protein_g ?? 0));
        setCarbs(String(data.carbs_g ?? 0));
        setFat(String(data.fat_g ?? 0));
        toast.success("Meal detected! Review and adjust if needed.");
      } else {
        throw new Error("Detection returned invalid data");
      }
    } catch (err: unknown) {
      console.error(err);
      let msg: string | null = null;
      if (err && typeof err === "object" && "context" in err) {
        const ctx = (err as { context?: { json?: () => Promise<{ error?: string }> } }).context;
        if (ctx?.json) {
          try {
            const body = await ctx.json();
            msg = body?.error ?? null;
          } catch {
            /* ignore */
          }
        }
      }
      if (!msg && err instanceof Error) msg = err.message;
      toast.error(msg || "AI analysis failed. Enter details manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !mealName.trim()) return;
    setLoading(true);

    try {
      let imageUrl: string | null = null;

      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("meal-images")
          .upload(path, imageFile);
        if (!uploadError) {
          const { data } = supabase.storage.from("meal-images").getPublicUrl(path);
          imageUrl = data.publicUrl;
        }
      }

      const { error } = await supabase.from("meal_logs").insert({
        user_id: user.id,
        meal_type: mealType,
        meal_name: mealName.trim(),
        calories: parseInt(calories) || 0,
        protein_g: parseFloat(protein) || 0,
        carbs_g: parseFloat(carbs) || 0,
        fat_g: parseFloat(fat) || 0,
        image_url: imageUrl,
      });

      if (error) throw error;

      toast.success("Meal logged successfully!");
      setOpen(false);
      resetForm();
      onMealAdded();
    } catch (err) {
      toast.error("Failed to log meal");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMealName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setImageFile(null);
    setImagePreview(null);
  };

  const canSubmit = mealName.trim() && (parseInt(calories) || 0) >= 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-hero text-primary-foreground font-body gap-2">
          <Plus className="w-4 h-4" /> Log Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" aria-describedby="log-meal-desc">
        <DialogHeader>
          <DialogTitle className="font-display">Log a Meal</DialogTitle>
          <DialogDescription id="log-meal-desc">
            Upload a photo for AI detection or enter meal details manually.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Image upload - primary */}
          <div>
            <Label className="font-body">Upload meal photo (AI will detect food & nutrition)</Label>
            <div
              className="mt-1 border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => !analyzing && fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {imagePreview ? (
                <div className="relative w-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-40 rounded-lg object-cover" />
                  <div className="flex gap-2 mt-3">
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); analyzeWithAI(); }}
                      disabled={analyzing}
                      className="flex-1 gap-2"
                    >
                      {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {analyzing ? "Analyzing..." : "Detect with AI"}
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}>
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="w-12 h-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-body text-center">Tap to upload a photo of your meal</span>
                  <span className="text-xs text-muted-foreground">AI will identify the food and estimate calories, protein, carbs & fat</span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            or{" "}
            <button
              type="button"
              className="underline hover:text-foreground"
              onClick={() => mealNameRef.current?.focus()}
            >
              enter details manually
            </button>
          </p>

          {/* Meal type */}
          <div>
            <Label className="font-body">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                <SelectItem value="lunch">☀️ Lunch</SelectItem>
                <SelectItem value="dinner">🌙 Dinner</SelectItem>
                <SelectItem value="snack">🍎 Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Editable fields (auto-filled by AI or manual) */}
          <div>
            <Label className="font-body">Meal Name</Label>
            <Input ref={mealNameRef} value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="e.g., Dal Chawal, Paneer Tikka" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <Label className="font-body text-xs">Calories</Label>
              <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="kcal" />
            </div>
            <div>
              <Label className="font-body text-xs">Protein (g)</Label>
              <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} placeholder="g" />
            </div>
            <div>
              <Label className="font-body text-xs">Carbs (g)</Label>
              <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="g" />
            </div>
            <div>
              <Label className="font-body text-xs">Fat (g)</Label>
              <Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="g" />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading || !canSubmit} className="w-full gradient-hero text-primary-foreground font-body">
            {loading ? "Logging..." : "Add Meal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMealDialog;
