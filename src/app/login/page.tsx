import LoginForm from "@/components/auth/LoginForm";
import LoginBanner from "@/components/auth/LoginBanner";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[700px]">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-[#1a365d] tracking-tight">BERITEST</h1>
              <p className="text-sm text-slate-500 mt-1">Platform Seleksi & Ujian Profesional</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500 text-sm mt-2">Silakan masuk untuk mengakses dashboard Anda.</p>
            </div>

            <LoginForm />
          </div>
        </div>

        {/* Right Side: Banner */}
        <div className="hidden md:flex w-full md:w-1/2 bg-[#eef2ff] p-8 flex-col justify-center items-center relative overflow-hidden">
          <LoginBanner />
        </div>
      </div>
    </div>
  );
}
