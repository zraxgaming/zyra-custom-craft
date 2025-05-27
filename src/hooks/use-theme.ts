
import { useContext } from "react";
import { useTheme as useThemeContext } from "@/components/theme/ThemeProvider";

export const useTheme = () => {
  const context = useThemeContext();
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
