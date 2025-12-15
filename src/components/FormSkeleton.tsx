import { motion } from "framer-motion";

export const FormSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-9 w-48 bg-[hsl(270,50%,12%)] rounded-lg" />
        <div className="h-5 w-64 bg-[hsl(270,50%,10%)] rounded" />
      </div>

      {/* Form fields skeleton */}
      <div className="space-y-5">
        {/* Email field */}
        <div className="space-y-2">
          <div className="h-4 w-12 bg-[hsl(270,50%,12%)] rounded" />
          <div className="h-12 w-full bg-[hsl(270,50%,10%)] rounded-md border border-[hsl(270,50%,15%)]" />
        </div>

        {/* Password field */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-[hsl(270,50%,12%)] rounded" />
            <div className="h-4 w-24 bg-[hsl(270,50%,10%)] rounded" />
          </div>
          <div className="h-12 w-full bg-[hsl(270,50%,10%)] rounded-md border border-[hsl(270,50%,15%)]" />
        </div>

        {/* Button skeleton */}
        <div className="h-12 w-full bg-[hsl(267,100%,25%)] rounded-md opacity-50" />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[hsl(270,50%,15%)]" />
        <div className="h-4 w-24 bg-[hsl(270,50%,10%)] rounded" />
        <div className="flex-1 h-px bg-[hsl(270,50%,15%)]" />
      </div>

      {/* Social button skeleton */}
      <div className="h-12 w-full bg-[hsl(270,50%,10%)] rounded-md border border-[hsl(270,50%,15%)]" />

      {/* Shimmer effect overlay */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{ translateX: ["100%", "-100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
        }}
      />
    </div>
  );
};
