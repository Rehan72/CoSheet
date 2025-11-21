import { Sun, MoonStar } from "lucide-react";
import { useUIStore } from "./stores";

export default function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const isDark = theme === "dark";
  
  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };
  
  return (
    <div
      onClick={handleThemeToggle}
      className={`flex items-center cursor-pointer transition-transform duration-500 ${
        isDark ? "rotate-180" : "rotate-0"
      }`}
    >
      {isDark ? (
        <Sun size={22} className="text-yellow-500" />
      ) : (
        <MoonStar size={22} className="text-blue-600/60" />
      )}
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
