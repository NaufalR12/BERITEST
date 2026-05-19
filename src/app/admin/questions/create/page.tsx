"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bold, Italic, List, Plus, Trash2, X, UploadCloud, Link2, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface AnswerOption {
  id: string;
  label: string; // A, B, C, etc.
  text: string;
  isCorrect: boolean;
}

export default function CreateQuestionPage() {
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<AnswerOption[]>([
    { id: "1", label: "A", text: "Ini adalah draf pilihan jawaban pertama.", isCorrect: false },
    { id: "2", label: "B", text: "Ini adalah draf pilihan jawaban yang benar.", isCorrect: true },
  ]);

  // Set correct answer
  const handleSetCorrect = (id: string) => {
    setOptions(
      options.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id,
      }))
    );
  };

  // Update option text
  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, text } : opt))
    );
  };

  // Add new option
  const handleAddOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length); // A=65, B=66, etc.
    const newOpt: AnswerOption = {
      id: Date.now().toString(),
      label: nextLabel,
      text: "",
      isCorrect: false,
    };
    setOptions([...options, newOpt]);
  };

  // Remove option
  const handleRemoveOption = (id: string) => {
    if (options.length <= 1) return;
    const filtered = options.filter((opt) => opt.id !== id);
    // Re-index labels
    const reindexed = filtered.map((opt, index) => ({
      ...opt,
      label: String.fromCharCode(65 + index),
    }));
    setOptions(reindexed);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      alert("Silakan masukkan teks pertanyaan!");
      return;
    }
    const correctOpt = options.find(o => o.isCorrect);
    if (!correctOpt) {
      alert("Silakan pilih salah satu opsi sebagai kunci jawaban!");
      return;
    }
    alert("Pertanyaan berhasil disimpan!");
    router.push("/admin/questions");
  };

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-4xl mx-auto w-full">
        
        {/* Breadcrumb */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions" className="hover:text-slate-600 transition-colors">Master Soal</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Tambah Soal Baru</span>
        </nav>

        {/* Page Title */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">
            Buat Pertanyaan Baru
          </h2>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#0a2351] mb-6">
            Editor Pertanyaan
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Editor Area */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Isi Pertanyaan
              </label>

              {/* Editor Border Container */}
              <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5b61f4] focus-within:border-transparent transition-all">
                
                {/* Mock Rich Text Toolbar */}
                <div className="bg-[#eef2ff] px-4 py-2 border-b border-slate-200 flex items-center gap-4 text-[#0a2351]">
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Bold">
                    <Bold className="w-4 h-4 font-bold" />
                  </button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Italic">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Bullet List">
                    <List className="w-4 h-4" />
                  </button>
                  <span className="h-4 w-px bg-slate-300"></span>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors text-xs font-bold font-serif" title="Math Formula">
                    Σ
                  </button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Insert Image">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Insert Link">
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Masukkan teks pertanyaan di sini..."
                  rows={6}
                  className="w-full px-4 py-3 bg-white outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-y min-h-[120px]"
                />
              </div>
            </div>

            {/* Media Upload Box */}
            <div className="border-2 border-dashed border-[#d9e2ec] hover:border-[#5b61f4] rounded-lg p-8 bg-[#f4f7fa]/50 text-center cursor-pointer transition-colors group">
              <input type="file" id="media-upload" className="hidden" accept="image/*" />
              <label htmlFor="media-upload" className="cursor-pointer space-y-2 block">
                <div className="flex justify-center">
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#5b61f4] transition-colors" />
                </div>
                <p className="text-sm font-bold text-[#0a2351] group-hover:text-[#5b61f4] transition-colors">
                  Klik atau Seret Gambar ke Sini
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  PNG, JPG, SVG (Max 2MB)
                </p>
              </label>
            </div>

            {/* Answer Options Section */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pilihan Jawaban
              </label>

              <div className="space-y-3.5">
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-4">
                    {/* Option Label Circle */}
                    <div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all border ${
                        opt.isCorrect 
                          ? "bg-[#0a2351] border-[#0a2351] text-white" 
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      {opt.label}
                    </div>

                    {/* Input Field Container */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                        placeholder={`Draf pilihan jawaban ${opt.label}...`}
                        className={`w-full pl-4 pr-10 py-3 bg-[#eef2ff]/50 border rounded-lg text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 ${
                          opt.isCorrect ? "border-[#5b61f4]" : "border-slate-200 focus:border-[#5b61f4]"
                        }`}
                      />
                      
                      {/* Delete option button */}
                      {options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(opt.id)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-red-500 transition-colors"
                          title="Hapus opsi"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Correct Key Select Button */}
                    <button
                      type="button"
                      onClick={() => handleSetCorrect(opt.id)}
                      className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-[#0a2351] transition-colors select-none shrink-0"
                    >
                      <div 
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                          opt.isCorrect 
                            ? "border-[#0a2351] bg-[#0a2351]" 
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {opt.isCorrect && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className={opt.isCorrect ? "text-[#0a2351]" : "text-slate-400"}>Kunci</span>
                    </button>

                  </div>
                ))}
              </div>

              {/* Add Option Link */}
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#5b61f4] hover:text-[#4f46e5] transition-colors pt-2"
              >
                <Plus className="w-4 h-4" />
                Tambah Pilihan
              </button>

            </div>

            {/* Footer Form Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/questions")}
                className="px-6 py-2.5 border border-slate-200 text-slate-500 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors"
              >
                Draft Simpan
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0a2351] hover:bg-[#07193a] text-white font-bold text-sm rounded-lg transition-colors shadow-sm"
              >
                Simpan Soal
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
