"use client";

import Link from "next/link";

interface UserHeaderProps {
  activeTab: "Course" | "Schedule";
}

export default function UserHeader({ activeTab }: UserHeaderProps) {
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
      <div className="flex items-center gap-4 relative">
        {/* Profile Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-100 flex items-center justify-center text-slate-400">
          <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
