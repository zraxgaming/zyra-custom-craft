
import React from "react";
import { EnhancedLoader } from "./enhanced-loader";

interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 animate-scale-in">
        <EnhancedLoader size="lg" message={message} />
      </div>
    </div>
  );
};
