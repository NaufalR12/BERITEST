"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bold, Italic, List, Plus, Trash2, X, UploadCloud, Link2, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createQuestion, uploadQuestionImage } from "@/lib/questionApi";
import { getPositions } from "@/lib/positionApi";
import type { Position } from "@/lib/types";

interface AnswerOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
}

export default function CreateQuestionPage() {
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [options, setOptions] = useState<AnswerOption[]>([
    { id: "1", label: "A", text: "", isCorrect: false },
    { id: "2", label: "B", text: "", isCorrect: false },
  ]);
  const [imgPath, setImgPath] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getPositions({ limit: 100 })
      .then((res) => setPositions(res.data))
      .catch(() => {});
  }, []);

  const handleSetCorrect = (id: string) => {
    setOptions(options.map((opt) => ({ ...opt, isCorrect: opt.id === id })));
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  const handleAddOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length);
    setOptions([...options, { id: Date.now().toString(), label: nextLabel, text: "", isCorrect: false }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return;
    const filtered = options.filter((opt) => opt.id !== id);
    setOptions(filtered.map((opt, index) => ({ ...opt, label: String.fromCharCode(65 + index) })));
  };

  const togglePosition = (id: number) => {
    setSelectedPositions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);
    try {
      const res = await uploadQuestionImage(file);
      setImgPath(res.data.img_path);
    } catch (err: any) {
      setError(err.message || "Gagal mengupload gambar.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!questionText.trim()) { setError("Silakan masukkan teks pertanyaan!"); return; }
    if (options.some((o) => !o.text.trim())) { setError("Semua pilihan jawaban harus diisi!"); return; }
    if (!options.find((o) => o.isCorrect)) { setError("Silakan pilih salah satu opsi sebagai kunci jawaban!"); return; }

    setLoading(true);
    try {
      await createQuestion({
        question_desc: questionText,
        difficulty_flag: difficulty,
        position_ids: selectedPositions,
        img_path: imgPath || undefined,
        answers: options.map((o) => ({
          answer_desc: o.text,
          is_correct: o.isCorrect,
        })),
      });
      setSuccess(true);
      setTimeout(() => router.push("/admin/questions"), 1500);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan soal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: "Easy", label: "Mudah", color: "bg-green-50 border-green-200 text-green-700" },
    { value: "Medium", label: "Sedang", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { value: "Hard", label: "Sulit", color: "bg-red-50 border-red-200 text-red-700" },
  ] as const;

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-4xl mx-auto w-full">

        {/* Breadcrumb */}
        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions" className="hover:text-slate-600 transition-colors">Master Soal</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Tambah Soal Baru</span>
        </nav>

        {/* Title + Back */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push("/admin/questions")} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Buat Pertanyaan Baru</h2>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /> Soal berhasil disimpan! Mengalihkan...
          </div>
        )}

        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
          <h3 className="text-lg font-bold text-[#0a2351] mb-6">Editor Pertanyaan</h3>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Question Text */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Isi Pertanyaan *</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#5b61f4] focus-within:border-transparent transition-all">
                <div className="bg-[#eef2ff] px-4 py-2 border-b border-slate-200 flex items-center gap-4 text-[#0a2351]">
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Bold"><Bold className="w-4 h-4" /></button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Italic"><Italic className="w-4 h-4" /></button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="List"><List className="w-4 h-4" /></button>
                  <span className="h-4 w-px bg-slate-300" />
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors text-xs font-bold font-serif" title="Formula">Σ</button>
                  <button type="button" className="p-1 hover:bg-white rounded transition-colors" title="Link"><Link2 className="w-4 h-4" /></button>
                </div>
                <textarea
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Masukkan teks pertanyaan di sini..."
                  rows={5}
                  className="w-full px-4 py-3 bg-white outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-y min-h-[100px]"
                />
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Kesulitan *</label>
              <div className="flex gap-3">
                {difficultyOptions.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDifficulty(d.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      difficulty === d.value ? d.color + " border-current" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Mapping */}
            {positions.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Posisi Jabatan (opsional)</label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((p) => (
                    <button
                      key={p.id_position}
                      type="button"
                      onClick={() => togglePosition(p.id_position)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        selectedPositions.includes(p.id_position)
                          ? "bg-[#0a2351] border-[#0a2351] text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p.position_name}
                    </button>
                  ))}
                </div>
                {selectedPositions.length > 0 && (
                  <p className="text-[10px] text-slate-400">{selectedPositions.length} posisi dipilih</p>
                )}
              </div>
            )}

            {/* Media Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Gambar Pertanyaan (Opsional)</label>
              {imgPath ? (
                <div className="relative inline-block border border-slate-200 rounded-lg p-2 bg-slate-50">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${imgPath}`} alt="Uploaded" className="max-h-48 rounded" />
                  <button type="button" onClick={() => setImgPath(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#d9e2ec] hover:border-[#5b61f4] rounded-lg p-6 bg-[#f4f7fa]/50 text-center cursor-pointer transition-colors group">
                  <input type="file" id="media-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                  <label htmlFor="media-upload" className="cursor-pointer space-y-2 block">
                    <div className="flex justify-center">
                      {uploadingImage ? (
                        <div className="w-8 h-8 border-2 border-[#5b61f4] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#5b61f4] transition-colors" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-[#0a2351] group-hover:text-[#5b61f4] transition-colors">
                      {uploadingImage ? "Mengupload..." : "Klik atau Seret Gambar"}
                    </p>
                    <p className="text-xs text-slate-400">PNG, JPG (Max 5MB)</p>
                  </label>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilihan Jawaban *</label>
              <div className="space-y-3.5">
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all border ${opt.isCorrect ? "bg-[#0a2351] border-[#0a2351] text-white" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                      {opt.label}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                        placeholder={`Pilihan jawaban ${opt.label}...`}
                        className={`w-full pl-4 pr-10 py-3 bg-[#eef2ff]/50 border rounded-lg text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 ${opt.isCorrect ? "border-[#5b61f4]" : "border-slate-200 focus:border-[#5b61f4]"}`}
                      />
                      {options.length > 2 && (
                        <button type="button" onClick={() => handleRemoveOption(opt.id)} className="absolute right-3 top-3.5 text-slate-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button type="button" onClick={() => handleSetCorrect(opt.id)} className="flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-[#0a2351] transition-colors select-none shrink-0">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${opt.isCorrect ? "border-[#0a2351] bg-[#0a2351]" : "border-slate-300 bg-white"}`}>
                        {opt.isCorrect && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className={opt.isCorrect ? "text-[#0a2351]" : "text-slate-400"}>Kunci</span>
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleAddOption} disabled={options.length >= 6} className="inline-flex items-center gap-2 text-xs font-extrabold text-[#5b61f4] hover:text-[#4f46e5] transition-colors pt-2 disabled:opacity-40">
                <Plus className="w-4 h-4" />
                Tambah Pilihan
              </button>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button type="button" onClick={() => router.push("/admin/questions")} className="px-6 py-2.5 border border-slate-200 text-slate-500 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={loading || success} className="px-6 py-2.5 bg-[#0a2351] hover:bg-[#07193a] text-white font-bold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Menyimpan..." : "Simpan Soal"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
