import { createContext, useState, ReactNode, useEffect } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(()=>{
  const saved = localStorage.getItem("appTheme");
  return saved ? saved : "light";
  });


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = `bg-background text-foreground transition-colors duration-300`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}