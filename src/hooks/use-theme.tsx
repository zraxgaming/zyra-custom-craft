
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return {
      theme: 'light',
      setTheme,
      actualTheme: 'light'
    };
  }

  return {
    theme,
    setTheme,
    actualTheme: resolvedTheme || theme || 'light'
  };
}
