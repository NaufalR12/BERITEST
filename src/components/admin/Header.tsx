export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-8 flex justify-end items-center">
      <div className="flex items-center gap-4 text-right">
        <div>
          <p className="text-sm font-bold text-slate-800">Admin User</p>
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            Super Administrator
          </p>
        </div>
      </div>
    </header>
  );
}
