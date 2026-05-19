import Link from "next/link";
import { Plus } from "lucide-react";

import CourseTable from "@/components/admin/courses/CourseTable";

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-full pb-10">
      
      
      <div className="flex-1 px-8 pt-8 max-w-7xl mx-auto w-full">
        {/* Page Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Manajemen Course</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Kelola daftar materi dan kurikulum asesmen Anda.
            </p>
          </div>
          
          <div className="flex items-center">
            <Link href="/admin/courses/create" className="flex items-center gap-2 px-5 py-2.5 bg-[#0a2351] text-white font-bold text-sm rounded-lg hover:bg-[#0f337a] transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Tambah Kursus Baru
            </Link>
          </div>
        </div>

        {/* Content */}
        <CourseTable />
      </div>
    </div>
  );
}
