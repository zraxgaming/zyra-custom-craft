
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-105"
      aria-label="Toggle theme"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === 'dark' 
          ? 'rotate-90 scale-0' 
          : 'rotate-0 scale-100'
      }`} />
      <Moon className={`absolute inset-0 h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
        theme === 'dark' 
          ? 'rotate-0 scale-100' 
          : '-rotate-90 scale-0'
      }`} />
      
      <span className="sr-only">
        Switch to {theme === 'dark' ? 'light' : 'dark'} mode
      </span>
    </Button>
  );
};

export default ThemeToggle;
