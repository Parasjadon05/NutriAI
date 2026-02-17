import { motion } from "framer-motion";

interface MacroRingProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

const MacroRing = ({ label, current, target, unit, color }: MacroRingProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold font-body text-foreground">{current}</span>
          <span className="text-xs text-muted-foreground">/ {target}{unit}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground font-body">{label}</span>
    </div>
  );
};

export default MacroRing;
