
import React from "react";
import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

interface EnhancedLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showMessage?: boolean;
}

export const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({ 
  message = "Loading...",
  size = "md",
  className,
  showMessage = true
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div className="animate-pulse-glow">
        <LoadingSpinner size={size} />
      </div>
      {showMessage && (
        <p className="text-muted-foreground mt-4 animate-fade-in">{message}</p>
      )}
    </div>
  );
};
