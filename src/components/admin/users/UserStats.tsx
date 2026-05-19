import { Users, Download } from "lucide-react";

export default function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Users Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Total Users
          </h3>
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-4xl font-extrabold text-slate-800">1,248</p>
      </div>

      {/* Download Data Excel Card */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer hover:bg-slate-50 transition-colors group">
        <div className="flex items-center gap-3 text-slate-600 group-hover:text-blue-600 transition-colors">
          <Download className="w-5 h-5" />
          <span className="font-semibold">Download Data Excel</span>
        </div>
      </div>
    </div>
  );
}
