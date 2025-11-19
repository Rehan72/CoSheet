import { Moon, Sun } from "lucide-react";
import { useTheme } from "./context/ThemePrivider";
import { MoonStar } from "lucide-react";

export default function ThemeToggle() {
  
   

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };
  return (
   // <Tooltip content={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} animation="scale" duration={200} theme={theme}
   // arrow={false} placement={'top'}
   // className="bg-gray-500 text-white px-2 py-1 rounded-md shadow-lg z-50"
   // >
    <div
      onClick={() => handleThemeToggle()}
      className={`flex items-center cursor-pointer  transition-transform duration-500 ${
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
   //  {/* </Tooltip> */}
  );
}
