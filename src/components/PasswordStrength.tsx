import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
];

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const passedCount = requirements.filter((req) => req.test(password)).length;
  const strength = passedCount / requirements.length;

  const getStrengthColor = () => {
    if (strength <= 0.25) return "bg-red-500";
    if (strength <= 0.5) return "bg-orange-500";
    if (strength <= 0.75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthLabel = () => {
    if (strength <= 0.25) return "Weak";
    if (strength <= 0.5) return "Fair";
    if (strength <= 0.75) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-3 mt-3"
    >
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-[hsl(270,20%,60%)]">Password strength</span>
          <span className={`font-medium ${
            strength <= 0.25 ? "text-red-400" :
            strength <= 0.5 ? "text-orange-400" :
            strength <= 0.75 ? "text-yellow-400" : "text-green-400"
          }`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-1.5 bg-[hsl(270,50%,15%)] rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${getStrengthColor()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${strength * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Requirements list */}
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req, index) => {
          const passed = req.test(password);
          return (
            <motion.div
              key={req.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-1.5 text-xs ${
                passed ? "text-green-400" : "text-[hsl(270,20%,50%)]"
              }`}
            >
              {passed ? (
                <Check className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <X className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span>{req.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
