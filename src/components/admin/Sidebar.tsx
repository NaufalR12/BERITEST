"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, GraduationCap, FileQuestion, BarChart, LogOut, TrendingUp } from "lucide-react";

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Courses", path: "/admin/courses", icon: GraduationCap },
    { name: "Questions", path: "/admin/questions", icon: FileQuestion },
    { name: "Reports", path: "/admin/reports", icon: BarChart },
    { name: "Analysis", path: "/admin/analysis", icon: TrendingUp },
  ];

  return (
    <div className={`h-screen bg-[#f1f5fa] flex flex-col flex-shrink-0 sticky top-0 ${className}`}>
      {/* Brand / Logo Area */}
      <div className="px-8 py-8 mb-4">
        <h1 className="text-xl font-extrabold text-[#0a2351] tracking-wide leading-tight">
          ADMIN PORTAL
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">Management Console</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-[#0a2351] text-white"
                  : "text-slate-600 hover:bg-slate-200/50 hover:text-[#0a2351]"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-slate-200/50 hover:text-red-600 rounded-lg text-sm font-semibold transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
