"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";

interface UserHeaderProps {
  activeTab: "Course" | "Schedule";
}

export default function UserHeader({ activeTab }: UserHeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Perform logout redirect
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-40 sticky top-0">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/user" className="text-xl font-extrabold text-[#1a365d] tracking-wide">
          BERITEST
        </Link>
        
        {/* Navigation Links */}
        <nav className="flex items-center gap-6">
          <Link
            href="/user"
            className={`text-sm font-bold pb-4 -mb-4 transition-all relative ${
              activeTab === "Course" 
                ? "text-[#1a365d] border-b-2 border-[#1a365d]" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Course
          </Link>
          <Link
            href="/user/schedule"
            className={`text-sm font-bold pb-4 -mb-4 transition-all relative ${
              activeTab === "Schedule" 
                ? "text-[#1a365d] border-b-2 border-[#1a365d]" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Schedule
          </Link>
        </nav>
      </div>

      {/* Right Area: Actions & Profile */}
      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        {/* Profile Avatar Button */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
          aria-label="Profile menu"
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center text-slate-400">
            <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* User Details */}
            <div className="px-4 py-2 border-b border-slate-100">
              <p className="text-xs font-bold text-[#1a365d] tracking-wide uppercase">Peserta</p>
              <p className="text-sm font-semibold text-slate-800 truncate">peserta@beritest.com</p>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profil Saya
              </button>
              <button 
                onClick={() => setIsDropdownOpen(false)}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Pengaturan
              </button>
            </div>

            <hr className="border-slate-100 my-1" />

            {/* Logout Action */}
            <div className="py-1">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Keluar Akun
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

