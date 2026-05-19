"use client";

import { useState } from "react";
import { Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call to be integrated with backend later
    setTimeout(() => {
      setIsLoading(false);
      console.log("Login with:", email, password);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-5">
        <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
          Alamat Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors duration-200"
            placeholder="nama@perusahaan.com"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Kata Sandi
          </label>
          <a href="#" className="text-sm font-semibold text-[#1a365d] hover:text-blue-700 transition-colors">
            Lupa sandi?
          </a>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors duration-200 tracking-widest"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#65d354] hover:bg-[#52ba43] text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-center items-center"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Masuk Sekarang"
        )}
      </button>

      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-500">
          Belum memiliki akun?{" "}
          <a href="#" className="font-semibold text-[#1a365d] hover:text-blue-700 transition-colors">
            Hubungi Admin
          </a>
        </p>
      </div>
    </form>
  );
}
