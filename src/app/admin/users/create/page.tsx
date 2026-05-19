"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";


export default function CreateUserPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Create User:", { fullName, email, password, batch });
    // TODO: integrate with API
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      
      
      <div className="flex-1 px-8 pt-8 max-w-5xl mx-auto w-full">
        {/* Breadcrumbs */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/users" className="hover:text-slate-600 transition-colors">Users</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Tambah User Baru</span>
        </nav>

        {/* Page Header Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Tambah User Baru</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Masukkan detail informasi kandidat untuk membuat akun baru.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@company.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full px-4 py-3 pr-12 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Password must be at least 8 characters with a mix of letters and numbers.
              </p>
            </div>


            {/* Batch Selection */}
            <div>
              <label htmlFor="batch" className="block text-xs font-bold text-slate-700 mb-2">
                Batch Selection
              </label>
              <select
                id="batch"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors text-slate-700 appearance-none"
                required
              >
                <option value="" disabled>Pilih Batch</option>
                <option value="batch-1">Batch 01 - Cloud Architect</option>
                <option value="batch-2">Batch 05 - UX Designer</option>
                <option value="batch-3">Batch 12 - Data Science</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end gap-4">
              <Link
                href="/admin/users"
                className="px-6 py-2.5 border border-slate-200 text-[#0a2351] text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batalkan
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#65d354] hover:bg-[#52ba43] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
              >
                Buat User Baru
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
