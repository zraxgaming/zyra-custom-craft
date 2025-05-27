
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/use-site-config";

const MaintenanceBanner = () => {
  const { data: siteConfig } = useSiteConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (siteConfig?.maintenance_mode === "true") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [siteConfig]);

  if (!isVisible || siteConfig?.maintenance_mode !== "true") {
    return null;
  }

  const message = siteConfig?.maintenance_message || 
    'We are currently performing maintenance. Some features may be temporarily unavailable.';

  return (
    <div className="relative z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg border-b-2 border-orange-300 dark:border-orange-700">
        <div className="container mx-auto px-4 py-2">
          <Alert className="border-0 bg-transparent shadow-none p-0">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AlertTriangle className="h-5 w-5 text-white animate-bounce" />
                  <div className="absolute -top-1 -right-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                <Wrench className="h-4 w-4 text-white animate-spin-slow" />
              </div>
              
              <div className="flex-1 mx-4">
                <AlertDescription className="text-center">
                  <div className="text-white font-medium text-sm animate-text-shimmer">
                    🚧 MAINTENANCE IN PROGRESS 🚧
                  </div>
                  <div className="text-orange-100 text-xs animate-fade-in">
                    {message}
                  </div>
                </AlertDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-white hover:bg-white/20 transition-all duration-300 rounded-lg p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </div>
        
        <div className="h-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 animate-pulse"></div>
      </div>
    </div>
  );
};

export default MaintenanceBanner;
