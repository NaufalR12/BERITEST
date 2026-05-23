"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, X, AlertCircle, CheckCircle, Save, UploadCloud } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getQuestionDetail, updateQuestion, createAnswer, updateAnswer, deleteAnswer, uploadQuestionImage } from "@/lib/questionApi";
import { getPositions } from "@/lib/positionApi";
import type { Question, Answer, Position } from "@/lib/types";

interface LocalAnswer {
  id_answer?: number;
  text: string;
  isCorrect: boolean;
  isNew?: boolean;
}

export default function EditQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const questionId = parseInt(params.id as string, 10);

  const [question, setQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<LocalAnswer[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [imgPath, setImgPath] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      getQuestionDetail(questionId),
      getPositions({ limit: 100 }),
    ])
      .then(([qRes, posRes]) => {
        const q = qRes.data;
        setQuestion(q);
        setQuestionText(q.question_desc);
        setDifficulty(q.difficulty_flag);
        setImgPath(q.img_path || null);
        setSelectedPositions(q.trn_question_position?.map((p) => p.id_position) ?? []);
        setAnswers(
          (q.mst_answer ?? []).map((a) => ({
            id_answer: a.id_answer,
            text: a.answer_desc,
            isCorrect: a.is_correct,
          }))
        );
        setPositions(posRes.data);
      })
      .catch((err) => setError(err.message || "Gagal memuat data soal"))
      .finally(() => setPageLoading(false));
  }, [questionId]);

  const togglePosition = (id: number) => {
    setSelectedPositions((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const handleSetCorrect = (idx: number) => {
    setAnswers(answers.map((a, i) => ({ ...a, isCorrect: i === idx })));
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: "", isCorrect: false, isNew: true }]);
  };

  const handleRemoveAnswer = async (idx: number) => {
    const ans = answers[idx];
    if (ans.id_answer) {
      if (!confirm("Hapus jawaban ini?")) return;
      try {
        await deleteAnswer(questionId, ans.id_answer);
      } catch (err: any) {
        alert("Gagal hapus jawaban: " + err.message);
        return;
      }
    }
    setAnswers(answers.filter((_, i) => i !== idx));
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

    if (!questionText.trim()) { setError("Isi pertanyaan tidak boleh kosong!"); return; }
    if (answers.some((a) => !a.text.trim())) { setError("Semua jawaban harus diisi!"); return; }
    if (!answers.find((a) => a.isCorrect)) { setError("Pilih satu jawaban sebagai kunci!"); return; }

    setSaving(true);
    try {
      // Update question metadata + positions
      await updateQuestion(questionId, {
        question_desc: questionText,
        difficulty_flag: difficulty,
        position_ids: selectedPositions,
        img_path: imgPath || null,
      });

      // Sync answers
      for (const ans of answers) {
        if (ans.isNew) {
          await createAnswer(questionId, { answer_desc: ans.text, is_correct: ans.isCorrect });
        } else if (ans.id_answer) {
          await updateAnswer(questionId, ans.id_answer, { answer_desc: ans.text, is_correct: ans.isCorrect });
        }
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/questions"), 1500);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const difficultyOptions = [
    { value: "Easy" as const, label: "Mudah", color: "bg-green-50 border-green-200 text-green-700" },
    { value: "Medium" as const, label: "Sedang", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
    { value: "Hard" as const, label: "Sulit", color: "bg-red-50 border-red-200 text-red-700" },
  ];

  if (pageLoading) {
    return (
      <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
        <div className="flex-1 px-8 pt-6 max-w-4xl mx-auto w-full space-y-4">
          <div className="h-6 bg-slate-100 animate-pulse rounded w-48" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
        <div className="flex-1 px-8 pt-6 max-w-4xl mx-auto w-full">
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-10 bg-slate-50/50">
      <div className="flex-1 px-8 pt-6 max-w-4xl mx-auto w-full">

        <nav className="text-xs font-semibold text-slate-400 mb-2">
          <Link href="/admin/questions" className="hover:text-slate-600 transition-colors">Master Soal</Link>
          <span className="mx-2 font-normal text-slate-300">&gt;</span>
          <span className="text-[#5b61f4]">Edit Soal #{questionId}</span>
        </nav>

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-slate-500">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-2xl font-extrabold text-[#0a2351] tracking-tight">Edit Pertanyaan</h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" /> Perubahan berhasil disimpan! Mengalihkan...
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Question Text */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Isi Pertanyaan *</label>
              <textarea
                required
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-[#5b61f4] resize-y"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tingkat Kesulitan *</label>
              <div className="flex gap-3">
                {difficultyOptions.map((d) => (
                  <button key={d.value} type="button" onClick={() => setDifficulty(d.value)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all ${difficulty === d.value ? d.color + " border-current" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Positions */}
            {positions.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Posisi Jabatan</label>
                <div className="flex flex-wrap gap-2">
                  {positions.map((p) => (
                    <button key={p.id_position} type="button" onClick={() => togglePosition(p.id_position)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedPositions.includes(p.id_position) ? "bg-[#0a2351] border-[#0a2351] text-white" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                      {p.position_name}
                    </button>
                  ))}
                </div>
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

            {/* Answers */}
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Pilihan Jawaban *</label>
              <div className="space-y-3">
                {answers.map((ans, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${ans.isCorrect ? "bg-[#0a2351] text-white border-[#0a2351]" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <input
                      type="text"
                      value={ans.text}
                      required
                      onChange={(e) => setAnswers(answers.map((a, i) => i === idx ? { ...a, text: e.target.value } : a))}
                      placeholder={`Jawaban ${String.fromCharCode(65 + idx)}...`}
                      className={`flex-1 px-4 py-2.5 border rounded-lg text-sm outline-none transition-all ${ans.isCorrect ? "border-[#5b61f4] bg-blue-50/20" : "border-slate-200 bg-slate-50 focus:border-[#5b61f4]"}`}
                    />
                    <button type="button" onClick={() => handleSetCorrect(idx)}
                      className={`flex items-center gap-1.5 text-xs font-bold shrink-0 transition-colors ${ans.isCorrect ? "text-[#0a2351]" : "text-slate-400 hover:text-[#0a2351]"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ans.isCorrect ? "border-[#0a2351] bg-[#0a2351]" : "border-slate-300"}`}>
                        {ans.isCorrect && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      Kunci
                    </button>
                    <button type="button" onClick={() => handleRemoveAnswer(idx)} disabled={answers.length <= 2}
                      className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleAddAnswer} disabled={answers.length >= 6}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#5b61f4] hover:text-[#4f46e5] transition-colors disabled:opacity-40">
                <Plus className="w-4 h-4" /> Tambah Jawaban
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-slate-200 text-slate-500 font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button type="submit" disabled={saving || success} className="px-6 py-2.5 bg-[#0a2351] hover:bg-[#07193a] text-white font-bold text-sm rounded-lg transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2">
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <Save className="w-4 h-4" />
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
