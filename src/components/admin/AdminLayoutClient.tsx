"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar - Controlled by isSidebarOpen */}
      <div 
        className={`transition-all duration-300 ease-in-out border-slate-200 z-20 ${
          isSidebarOpen ? "w-[260px] translate-x-0 border-r" : "w-0 -translate-x-full overflow-hidden border-r-0"
        } shrink-0`}
      >
        <Sidebar className="w-[260px] min-w-[260px]" />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
