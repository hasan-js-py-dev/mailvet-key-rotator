import { useEffect, useState } from "react";

interface Dot {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export const FallingDots = () => {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    // Generate random dots
    const generateDots = () => {
      const newDots: Dot[] = [];
      const dotCount = 60; // Number of dots

      for (let i = 0; i < dotCount; i++) {
        newDots.push({
          id: i,
          left: Math.random() * 100, // Random horizontal position (%)
          top: Math.random() * 100, // Random starting vertical position (%)
          size: 2 + Math.random() * 2, // Random size between 2-4px
          delay: Math.random() * 15, // Random animation delay
          duration: 15 + Math.random() * 20, // Random duration between 15-35s
          opacity: 0.3 + Math.random() * 0.5, // Random opacity between 0.3-0.8
        });
      }
      setDots(newDots);
    };

    generateDots();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full falling-dot"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${dot.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
