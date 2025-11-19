import React from "react";
import { Menu, Bell, User, MoonStar, Sun, Monitor } from "lucide-react";
import { useTheme } from "./context/ThemePrivider";
import ThemeToggle from "./Theme-Toggle";

function Header({ setSidebarOpen }) {
  const { theme, setTheme } = useTheme();
  
  const handleThemeToggle = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const newTheme = themes[nextIndex];
    setTheme(newTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Sun size={22} className="text-yellow-500" />;
      case "system":
        return <Monitor size={22} className="text-gray-700 dark:text-gray-300" />;
      default:
        return <MoonStar size={22} className="text-blue-600/60" />;
    }
  };

  const getThemeTitle = () => {
    switch (theme) {
      case "dark":
        return "Switch to system theme";
      case "system":
        return "Switch to light theme";
      default:
        return "Switch to dark theme";
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between sticky top-0 z-30">
      
      <button 
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={28} className="text-gray-700 dark:text-gray-300" />
      </button>

      <h1 className="text-xl font-semibold text-blue-500/90 hover:text-blue-600  dark:text-blue-500">
        Dashboard 
      </h1>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* <button 
          onClick={handleThemeToggle}
          className="p-2 rounded-lg hover:bg-blue-400/20 hover:text-blue-500 dark:hover:bg-gray-700 transition-colors"
          title={getThemeTitle()}
        >
          {getThemeIcon()}
        </button> */}
        
        <button className="p-2 rounded-lg hover:bg-blue-400/20 hover:text-blue-500 dark:hover:bg-blue-300 transition-colors">
          <Bell size={22} className="text-blue-600/60 dark:text-blue-800" />
        </button>
        
        <button className="p-2 rounded-lg hover:bg-blue-400/20 hover:text-blue-500 dark:hover:bg-blue-300 transition-colors">
          <User size={22} className="text-blue-600/60 dark:text-blue-800" />
        </button>
      </div>
    </header>
  );
}

export default Header;