import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

export const Logo = ({ className, showText = true, size = "md", animated = false }: LogoProps) => {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Minimalist M+V Logo with Animation */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          sizeClasses[size],
          animated && "logo-animated"
        )}
      >
        <defs>
          <linearGradient id="logoGradientMV" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(180, 100%, 50%)" />
            <stop offset="50%" stopColor="hsl(200, 100%, 55%)" />
            <stop offset="100%" stopColor="hsl(220, 100%, 60%)" />
          </linearGradient>
          <linearGradient id="logoGradientAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 100%, 60%)" />
            <stop offset="100%" stopColor="hsl(180, 100%, 50%)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background glow circle */}
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          fill="url(#logoGradientMV)" 
          opacity="0.1"
          className={animated ? "animate-pulse-ring" : ""}
        />
        
        {/* M letter - left side */}
        <path
          d="M8 36V12L18 28L24 18"
          stroke="url(#logoGradientMV)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={animated ? "url(#glow)" : undefined}
        />
        
        {/* V letter - right side, interlocked with M */}
        <path
          d="M24 18L30 36L40 12"
          stroke="url(#logoGradientAccent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter={animated ? "url(#glow)" : undefined}
        />
        
        {/* Connection point glow */}
        <circle 
          cx="24" 
          cy="18" 
          r="3" 
          fill="hsl(180, 100%, 50%)"
          opacity="0.9"
          className={animated ? "animate-pulse" : ""}
        />
      </svg>
    </div>
  );
};