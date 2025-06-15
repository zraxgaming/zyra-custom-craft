
import React from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff } from "lucide-react";

const Offline: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 transition-all">
    {/* Animated SVG icon for no connection */}
    <div className="animate-pulse-glow mb-4">
      <svg
        width="120"
        height="100"
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mx-auto"
      >
        <ellipse cx="60" cy="90" rx="42" ry="7" fill="#a78bfa" fillOpacity="0.2">
          <animate attributeName="rx" values="42;49;42" dur="2s" repeatCount="indefinite"/>
        </ellipse>
        <WifiOff x={37} y={25} className="h-24 w-24 text-red-400 mx-auto animate-bounce" />
        <circle
          cx="100"
          cy="28"
          r="8"
          fill="#FBBF24"
          className="animate-pulse"
        >
          <animate
            attributeName="r"
            values="8;12;8"
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.2;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        <text x="60" y="70" textAnchor="middle" fontWeight="bold" fontSize="18" fill="#e11d48" style={{ letterSpacing: 2 }}>
          OFFLINE
        </text>
      </svg>
    </div>
    <h1 className="text-4xl font-extrabold text-purple-700 dark:text-purple-200 mb-3 drop-shadow animate-fade-in">
      Oops! No Internet Connection
    </h1>
    <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 text-center max-w-xs animate-fade-in" style={{ animationDelay: "0.25s" }}>
      It looks like you’re offline. <br />
      Please check your connection and try again.
    </p>
    <Button
      className="text-base px-6 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white transition-transform animate-scale-in"
      onClick={() => window.location.reload()}
    >
      Retry Connection
    </Button>
    <a
      href="/"
      className="mt-4 text-sm underline text-purple-500 dark:text-purple-300 hover:text-pink-500 transition-colors animate-fade-in"
      style={{ animationDelay: "0.4s" }}
    >
      Go back to Home
    </a>
  </div>
);

export default Offline;
