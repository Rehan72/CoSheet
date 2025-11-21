import React from "react";
import { Menu, Bell, LogOut, User } from "lucide-react";
import ThemeToggle from "./Theme-Toggle";
import { useAuthStore } from "./stores";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";


function Header({ setSidebarOpen }) {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
console.log(user);

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

        <button className="p-2 rounded-lg hover:bg-blue-400/20 hover:text-blue-500 dark:hover:bg-blue-300 transition-colors">
          <Bell size={22} className="text-blue-600/60 dark:text-blue-800" />
        </button>

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="p-2 rounded-lg hover:bg-blue-400/20 hover:text-blue-500 dark:hover:bg-blue-300 transition-colors">
      <User size={22} className="text-blue-600/60 dark:text-blue-800" />
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-56 overflow-visible"
  >
    <DropdownMenuLabel className="!overflow-visible">
      <div className="flex items-center gap-2">
        {user?.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User size={16} className="text-gray-500" />
        )}
        <div>
          <p className="text-sm font-medium">{user?.username}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuItem onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

      </div>
    </header>
  );
}

export default Header;