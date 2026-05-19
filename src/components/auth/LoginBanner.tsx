import Image from "next/image";
import { Zap, ShieldCheck, BarChart3 } from "lucide-react";

export default function LoginBanner() {
  return (
    <>
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-blue-100/50 to-transparent rounded-tr-2xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-20 -mb-20" />
      <div className="absolute top-20 right-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-40 -mr-10" />

      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full py-8">
        
        {/* Laptop Image Container */}
        <div className="w-full max-w-sm mb-8 mt-4 rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20 ring-1 ring-black/5">
          <Image
            src="/laptop-banner.png"
            alt="BERITEST Dashboard Preview"
            width={400}
            height={300}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="text-center px-4 max-w-sm mb-12">
          <h3 className="text-xl font-bold text-[#1a365d] mb-3">Efisiensi dalam Seleksi</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Gunakan alat ukur berbasis data untuk menemukan talenta terbaik dengan proses yang adil dan transparan.
          </p>
        </div>

        {/* Features Icons */}
        <div className="flex justify-center gap-12 w-full mt-auto">
          <div className="flex flex-col items-center group cursor-default">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-700 transition-colors">Cepat</span>
          </div>
          
          <div className="flex flex-col items-center group cursor-default">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-700 transition-colors">Aman</span>
          </div>

          <div className="flex flex-col items-center group cursor-default">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 group-hover:bg-blue-200 transition-all duration-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-700 transition-colors">Akurat</span>
          </div>
        </div>
      </div>
    </>
  );
}
