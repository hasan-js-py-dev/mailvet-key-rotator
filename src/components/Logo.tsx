import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className, showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Minimalist M+V Logo */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size])}
      >
        <defs>
          <linearGradient id="logoGradientMV" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(270, 100%, 65%)" />
            <stop offset="50%" stopColor="hsl(280, 100%, 60%)" />
            <stop offset="100%" stopColor="hsl(220, 100%, 60%)" />
          </linearGradient>
          <linearGradient id="logoGradientAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 100%, 60%)" />
            <stop offset="100%" stopColor="hsl(180, 100%, 50%)" />
          </linearGradient>
        </defs>
        
        {/* Background glow circle */}
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          fill="url(#logoGradientMV)" 
          opacity="0.1"
        />
        
        {/* M letter - left side */}
        <path
          d="M8 36V12L18 28L24 18"
          stroke="url(#logoGradientMV)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* V letter - right side, interlocked with M */}
        <path
          d="M24 18L30 36L40 12"
          stroke="url(#logoGradientAccent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Connection point glow */}
        <circle 
          cx="24" 
          cy="18" 
          r="3" 
          fill="hsl(180, 100%, 50%)"
          opacity="0.8"
        />
      </svg>

    </div>
  );
};
