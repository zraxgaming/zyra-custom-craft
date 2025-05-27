
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = actualTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-lg hover-magnetic group"
      aria-label="Toggle theme"
    >
      <div className="relative">
        <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
          actualTheme === 'dark' 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
        }`} />
        <Moon className={`absolute inset-0 h-[1.2rem] w-[1.2rem] transition-all duration-500 ${
          actualTheme === 'dark' 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
        }`} />
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-md" />
      
      <span className="sr-only">
        Switch to {actualTheme === 'dark' ? 'light' : 'dark'} mode
      </span>
    </Button>
  );
};

export default ThemeToggle;
