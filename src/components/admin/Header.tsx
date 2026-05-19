import { Menu, Search, Bell } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  isSidebarOpen?: boolean;
  toggleSidebar?: () => void;
}

export default function Header({ isSidebarOpen = true, toggleSidebar }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-3 px-6 flex justify-between items-center z-10 sticky top-0">
      
      {/* Left Area: Hamburger & Logo */}
      <div className="flex items-center gap-4">
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <h1 className="text-xl font-extrabold text-[#0a2351] tracking-wide">
          BERITEST
        </h1>
      </div>

      {/* Right Area: Profile */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-tight">Administrator</p>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
              Super Admin
            </p>
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
