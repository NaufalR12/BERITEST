"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  CheckSquare, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  Clock 
} from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  hasGraph: boolean;
}

export default function ActiveExamPage() {
  const router = useRouter();

  // 30 questions matching mock data
  const mockQuestions: Question[] = Array.from({ length: 30 }, (_, index) => {
    const qNum = index + 1;
    if (qNum === 14) {
      return {
        id: 14,
        text: "Jika sebuah fungsi f(x) = 2x² - 4x + 6, berapakah nilai turunan pertama f'(x) ketika x mendekati nilai konstanta Euler (e) pada koordinat kartesius?",
        options: [
          { key: "A", text: "4x - 4" },
          { key: "B", text: "2x - 4" },
          { key: "C", text: "4x + 6" },
          { key: "D", text: "4x² - 4" },
          { key: "E", text: "8x - 4" }
        ],
        correctAnswer: "C",
        hasGraph: true
      };
    }
    
    // Default math questions
    return {
      id: qNum,
      text: `Pertanyaan Matematika Lanjut #${qNum}: Hitunglah limit atau nilai turunan dari fungsi polinomial f(x) pada koordinat kartesius untuk menemukan asimtot tegak.`,
      options: [
        { key: "A", text: "x = 2" },
        { key: "B", text: "x = -4" },
        { key: "C", text: "x = 6" },
        { key: "D", text: "Tidak terdefinisi" },
        { key: "E", text: "x = 0" }
      ],
      correctAnswer: "A",
      hasGraph: false
    };
  });

  // State management
  const [currentIdx, setCurrentIdx] = useState(13); // Start on question 14 (idx 13)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({
    1: "A",
    2: "B",
    3: "C",
    4: "D",
    5: "E",
    14: "C" // Question 14 is pre-selected to C matching screenshot
  });
  const [flagged, setFlagged] = useState<{ [key: number]: boolean }>({
    6: true // Question 6 is flagged (ragu-ragu) matching screenshot
  });

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState(5099); // 1 Hour, 24 Minutes, 59 Seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const currentQuestion = mockQuestions[currentIdx];

  const handleSelectOption = (optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionKey
    }));
  };

  const handleToggleFlag = () => {
    setFlagged((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id]
    }));
  };

  const handleNext = () => {
    if (currentIdx < mockQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  // Count answered questions
  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans relative">
      {/* Blue Top Progress Border Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#5b61f4] z-50"></div>

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between z-10 sticky top-1">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/user" className="text-xl font-extrabold text-[#1a365d] tracking-wide shrink-0">
            BERITEST
          </Link>
          
          <div className="h-5 w-px bg-slate-200"></div>

          {/* Exam Session Title */}
          <span className="text-xs font-bold text-slate-500 truncate max-w-xs md:max-w-md">
            Ujian Tengah Semester: Matematika Lanjut
          </span>
        </div>

        {/* Right Area: Countdown & End Exam Button */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 font-mono text-sm font-bold border border-red-100">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* End Test Button */}
          <Link href="/user/courses/1">
            <button 
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1a365d] hover:bg-[#122644] text-white text-xs font-extrabold rounded-lg transition-colors shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Akhiri Test</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Two-Column Workspace Layout */}
      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* Left Column: Question Navigation Sidebar */}
        <aside className="w-full md:w-80 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Sidebar Title */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 tracking-wider">NAVIGASI SOAL</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#5b61f4] tracking-wide">
                {totalAnswered}/30
              </span>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-2.5">
              {mockQuestions.map((q) => {
                const isSelected = currentIdx === q.id - 1;
                const isAnswered = !!answers[q.id];
                const isFlagged = !!flagged[q.id];

                let btnClass = "bg-white border-slate-200 text-slate-400";
                if (isSelected) {
                  btnClass = "bg-white border-2 border-[#5b61f4] text-[#5b61f4] font-extrabold";
                } else if (isFlagged) {
                  btnClass = "bg-red-500 border-red-500 text-white font-bold relative";
                } else if (isAnswered) {
                  btnClass = "bg-[#1a365d] border-[#1a365d] text-white font-bold";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(q.id - 1)}
                    className={`h-10 rounded-lg border text-xs flex items-center justify-center transition-all hover:scale-105 shadow-sm ${btnClass}`}
                  >
                    {q.id}
                    {/* Small red dot for flagged state when it's selected */}
                    {isFlagged && isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Grid Legend */}
          <div className="space-y-3 pt-6 border-t border-slate-200/60 mt-6">
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              <span className="w-4 h-4 rounded bg-[#1a365d]"></span>
              <span>Terjawab</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              <span className="w-4 h-4 rounded bg-red-500"></span>
              <span>Ragu-ragu</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              <span className="w-4 h-4 rounded bg-white border border-slate-200"></span>
              <span>Belum Dijawab</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Question Content Area */}
        <main className="flex-1 bg-white p-8 md:p-12 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Top Question Info and Flag Action */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-[#5b61f4] uppercase tracking-wider">
                PERTANYAAN {currentQuestion.id} DARI 30
              </span>
              
              {/* Flag / Ragu Action Button */}
              <button 
                onClick={handleToggleFlag}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                  flagged[currentQuestion.id] 
                    ? "bg-red-5 bg-red-50/50 border-red-200 text-red-500" 
                    : "border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                }`}
                title="Tandai Ragu-ragu"
              >
                <Flag className="w-4 h-4" />
                <span className="text-[8px] font-extrabold uppercase tracking-wide">RAGU</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-slate-800 leading-relaxed">
              {currentQuestion.text}
            </h3>

            {/* Mathematics SVG Graph Container (Rendered only on Question 14 matching screenshot) */}
            {currentQuestion.hasGraph && (
              <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 flex items-center justify-center max-w-3xl w-full mx-auto shadow-inner">
                <svg viewBox="0 0 800 400" className="w-full aspect-[2/1] text-slate-300">
                  {/* Grid Lines */}
                  {Array.from({ length: 9 }).map((_, i) => (
                    <line key={`x-${i}`} x1={0} y1={i * 50} x2={800} y2={i * 50} stroke="rgba(226, 232, 240, 0.5)" strokeWidth={1} />
                  ))}
                  {Array.from({ length: 17 }).map((_, i) => (
                    <line key={`y-${i}`} x1={i * 50} y1={0} x2={i * 50} y2={400} stroke="rgba(226, 232, 240, 0.5)" strokeWidth={1} />
                  ))}
                  
                  {/* Diagonal grid perspective guidelines matching screenshot */}
                  <line x1={0} y1={400} x2={800} y2={200} stroke="rgba(226, 232, 240, 0.7)" strokeWidth={1.5} />
                  <line x1={0} y1={300} x2={800} y2={100} stroke="rgba(226, 232, 240, 0.7)" strokeWidth={1.5} />
                  <line x1={0} y1={200} x2={800} y2={0} stroke="rgba(226, 232, 240, 0.7)" strokeWidth={1.5} />

                  {/* Curve 1: Blue Curve */}
                  <path 
                    d="M 330 330 Q 400 330 500 150 T 700 0" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    strokeLinecap="round"
                  />
                  
                  {/* Curve 2: Orange Curve */}
                  <path 
                    d="M 310 390 Q 550 250 710 0" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    strokeLinecap="round"
                  />

                  {/* Specific Data Points matching graphic dots */}
                  <circle cx={420} cy={308} r={3} fill="#f97316" />
                  <circle cx={500} cy={328} r={2} fill="#ef4444" />
                  <circle cx={580} cy={318} r={2} fill="#ef4444" />
                  <circle cx={540} cy={275} r={3} fill="#3b82f6" />
                  <circle cx={625} cy={195} r={3} fill="#3b82f6" />
                </svg>
              </div>
            )}

            {/* Answer Options Card Stack */}
            <div className="space-y-3.5 w-full">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.key;
                
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all hover:bg-slate-50/80 shadow-sm ${
                      isSelected 
                        ? "border-[#5b61f4] bg-blue-50/20" 
                        : "border-slate-200"
                    }`}
                  >
                    {/* Circle Key Badge */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected 
                        ? "bg-[#5b61f4] text-white" 
                        : "bg-[#f0f4ff] text-[#5b61f4]"
                    }`}>
                      {opt.key}
                    </div>
                    {/* Option Text */}
                    <span className={`text-sm font-semibold transition-colors ${
                      isSelected ? "text-[#5b61f4]" : "text-slate-700"
                    }`}>
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls Footer */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100 mt-10">
            {/* Previous Question Button */}
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className={`flex items-center gap-2 px-6 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-600 transition-colors shadow-sm ${
                currentIdx === 0 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            {/* Next Question Button */}
            <button
              onClick={handleNext}
              disabled={currentIdx === mockQuestions.length - 1}
              className={`flex items-center gap-2 px-6 py-2.5 bg-[#5b61f4] hover:bg-[#474de0] text-white rounded-lg text-xs font-bold transition-colors shadow-sm ${
                currentIdx === mockQuestions.length - 1 ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
