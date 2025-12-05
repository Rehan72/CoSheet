import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, X, Columns2, SheetIcon, Users, Shield, User2Icon, OrigamiIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EventIcon from '../src/assets/icons/confetti_4376478.svg'
import { Calendar } from "lucide-react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const [isOpen, setIsOpen] = useState(true);
   const { pathname } = useLocation()

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Orgination", path: "/orgination", icon: <OrigamiIcon size={18} /> },
    { name: "Organization Hierarchy", path: "/organization-hierarchy", icon: <Users size={18} /> },
    { name: "Admin List", path: "/admin-list", icon: <Users size={18} /> },
    { name: "Defense Mapping", path: "/defense-mapping", icon: <Shield size={18} /> },
    { name: "User List", path: "/user-list", icon: <User2Icon size={18} /> },
    { name: "Co-Sheet", path: "/cosheet", icon: <SheetIcon size={18} /> },
    { name: "Profile", path: "/profile", icon: <User size={18} /> },
    { name: "Event", path: "/event", icon:<Calendar size={18} /> },
    
  ];

  // Animation variants
  const sidebarVariants = {
    open: { width: 256 },
    closed: { width: 64 }
  };

  const textVariants = {
    open: { 
      opacity: 1,
      width: "auto",
      transition: { delay: 0.1, duration: 0.2 }
    },
    closed: { 
      opacity: 0,
      width: 0,
      transition: { duration: 0.15 }
    }
  };

  const iconVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    active: { scale: 1.15 }
  };

  const collapseButtonVariants = {
    open: { rotate: 0 },
    closed: { rotate: 180 }
  };

  return (
    <>
      {/* Mobile backdrop with animation */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar with smooth width animation */}
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className={`fixed lg:static z-50 top-0 left-0 h-full 
          backdrop-blur-md bg-white/60 dark:bg-gray-800/80 border-r border-gray-200 dark:border-gray-700
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Mobile Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-gray-800 dark:text-gray-200"
          >
            Menu
          </motion.h2>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg backdrop-blur-sm bg-white/70 dark:bg-gray-700/70 border border-white/20 dark:border-gray-600/20 shadow-md hover:shadow-lg hover:bg-blue-400/20 hover:text-blue-500 transition-all duration-300"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Collapse Toggle Button */}
        <div className={`flex ${isOpen ? 'justify-end' : 'justify-center'} p-3 border-b border-gray-200 dark:border-gray-700`}>
          <motion.button
            variants={collapseButtonVariants}
            initial={false}
            animate={isOpen ? "open" : "closed"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-lg backdrop-blur-sm bg-white/70 dark:bg-gray-700/70 border border-white/20 dark:border-gray-600/20 shadow-md hover:shadow-lg hover:bg-blue-400/20 hover:text-blue-500 transition-all duration-300"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Columns2 size={20} className="text-blue-600/60" />
          </motion.button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-2">
          {menu.map((item) => {
            // Check if current pathname matches or starts with the menu item path for nested routes
            // Also handle special cases like add/edit pages that should be associated with their parent menu
            let active = pathname === item.path || pathname.startsWith(item.path + '/');

            // Special case: Add pages should be associated with their parent list pages
            if (!active) {
              if (item.path === 'admin-list' && (pathname.startsWith('/add-admin') || pathname.startsWith('/admin-list/add-admin'))) {
                active = true;
              } else if (item.path === 'orgination' && pathname.startsWith('/orgination/')) {
                active = true;
              } else if (item.path === 'organization-hierarchy' && (pathname.startsWith('/organization-hierarchy/') || pathname === '/organization-hierarchy')) {
                active = true;
              }
            }

            return (
              <motion.div
                key={item.path}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`
                    flex items-center rounded-lg
                    group relative backdrop-blur-sm overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isOpen 
                      ? `gap-3 px-3 py-3 ${active 
                          ? "bg-blue-400/20 text-blue-500 shadow-lg border border-blue-200/50" 
                          : "bg-white/70 dark:bg-gray-700/70 shadow-md border border-white/20 dark:border-gray-600/20 text-gray-600 dark:text-gray-400 hover:bg-blue-400/20 hover:text-blue-500 hover:shadow-lg"}`
                      : `justify-center p-3 ${active 
                          ? "bg-blue-400/20 text-blue-500 shadow-lg border border-blue-200/50" 
                          : "bg-white/70 dark:bg-gray-700/70 shadow-md border border-white/20 dark:border-gray-600/20 text-gray-600 dark:text-gray-400 hover:bg-blue-400/20 hover:text-blue-500 hover:shadow-lg"}`
                    }
                  `}
                  title={!isOpen ? item.name : ""}
                >
                  {/* Icon with animation */}
                  <motion.span 
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    animate={active ? "active" : ""}
                    className="flex justify-center"
                  >
                    {item.icon}
                  </motion.span>

                  {/* Text with proper width animation */}
                  <motion.span
                    variants={textVariants}
                    initial={false}
                    animate={isOpen ? "open" : "closed"}
                    className={`whitespace-nowrap font-medium overflow-hidden ${
                      active ? 'font-semibold' : ''
                    }`}
                  >
                    {item.name}
                  </motion.span>

                  {/* Active indicator for collapsed state */}
                  {!isOpen && active && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full shadow-lg" 
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
        
      </motion.aside>
    </>
  );
}

export default Sidebar;