import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header (Fixed height, not letting content go inside) */}
      <header className="bg-white dark:bg-gray-400/40 shadow-md z-20 relative">
        <Header setSidebarOpen={setSidebarOpen} />
      </header>

      {/* Body Section */}
      <div className="flex flex-1">

        {/* Sidebar */}
        <aside className="relative z-10">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-400/40 w-full  px-6 py-6 mx-auto">
          <div className="h-full w-full overflow-auto"> {/* ADD this wrapper */}
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
     
        <Footer />
      
    </div>
  );
}

export default Layout;
