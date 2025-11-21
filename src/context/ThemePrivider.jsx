import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "app-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    // If nothing is stored or stored value is invalid, use default light theme
    if (!stored || (stored !== "light" && stored !== "dark" && stored !== "system")) {
      localStorage.setItem(storageKey, defaultTheme);
      return defaultTheme;
    }
    return stored;
  });
  
  

  useEffect(() => {
    const root = window.document.documentElement;
    const themeToApply = theme || "light";

    root.classList.remove("light", "dark");

    if (themeToApply === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(themeToApply);
    localStorage.setItem("app-theme", themeToApply);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}


export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
