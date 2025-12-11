import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, showText = true, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Logo SVG - M and V interlocked with envelope hint */}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(sizeClasses[size])}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(272 70% 43%)" />
            <stop offset="50%" stopColor="hsl(243 64% 54%)" />
            <stop offset="100%" stopColor="hsl(204 100% 50%)" />
          </linearGradient>
        </defs>
        {/* Envelope shape with M and V */}
        <path
          d="M4 14L24 26L44 14V38C44 40.2091 42.2091 42 40 42H8C5.79086 42 4 40.2091 4 38V14Z"
          fill="url(#logoGradient)"
          opacity="0.2"
        />
        <path
          d="M4 10C4 7.79086 5.79086 6 8 6H40C42.2091 6 44 7.79086 44 10V14L24 26L4 14V10Z"
          fill="url(#logoGradient)"
        />
        {/* M letter */}
        <path
          d="M12 18L18 28L24 18L24 34"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M12 18L12 34"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* V letter */}
        <path
          d="M28 18L34 34L40 18"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Checkmark accent */}
        <circle cx="38" cy="38" r="8" fill="hsl(355 78% 56%)" />
        <path
          d="M34 38L37 41L42 35"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={cn("font-display font-bold gradient-text", textSizeClasses[size])}>
          MailVet
        </span>
      )}
    </div>
  );
};
