import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda - BERITEST",
  description: "Platform Seleksi & Ujian Profesional",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {children}
    </div>
  );
}
