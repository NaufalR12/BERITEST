// ── Shared API Response Wrapper ────────────────────────────────────────────────
export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: ApiMeta;
}

export interface ApiDetailResponse<T> {
  data: T;
}

// ── Position ───────────────────────────────────────────────────────────────────
export interface Position {
  id_position: number;
  position_name: string;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  _count?: { trn_question_position: number };
}

// ── Question ───────────────────────────────────────────────────────────────────
export interface Answer {
  id_answer: number;
  id_question: number;
  answer_desc: string;
  answer_content_json?: string | null;
  answer_content_html?: string | null;
  is_correct: boolean;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
}

export interface QuestionPosition {
  id_question: number;
  id_position: number;
  mst_position: { id_position: number; position_name: string };
}

export interface Question {
  id_question: number;
  question_desc: string;
  question_content_json?: string | null;
  question_content_html?: string | null;
  img_path?: string | null;
  difficulty_flag: 'Easy' | 'Medium' | 'Hard';
  total_attempts: number;
  total_wrong: number;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  mst_answer?: Answer[];
  trn_question_position?: QuestionPosition[];
  _count?: { mst_answer: number };
}

export interface QuestionSummary {
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

// ── Question Group ─────────────────────────────────────────────────────────────
export interface GroupItem {
  id_group_question: number;
  id_group: number;
  id_question: number;
  mst_question?: Partial<Question>;
}

export interface QuestionGroup {
  id_group: number;
  group_name: string;
  description?: string | null;
  created_at: string;
  created_by?: string | null;
  updated_at?: string | null;
  updated_by?: string | null;
  trn_question_group_item?: GroupItem[];
  _count?: { trn_question_group_item: number };
}

// ── Attempt ────────────────────────────────────────────────────────────────────
export interface UserAnswer {
  id_answer_option: number;
  is_correct: boolean;
  answered_at: string;
}

export interface AttemptQuestion {
  id_test_attempt_question: number;
  id_test_attempt: number;
  id_question: number;
  question_order: number;
  time_spent_seconds: number;
  is_answered: boolean;
  mst_question?: {
    id_question: number;
    question_desc: string;
    question_content_html?: string | null;
    question_content_json?: string | null;
    img_path?: string | null;
    mst_answer: Omit<Answer, 'is_correct'>[];
  };
  trn_user_answer?: UserAnswer[];
}

export interface Attempt {
  id_test_attempt: number;
  id_session: number;
  id_question_group: number;
  id_user: string;
  status: 'Ongoing' | 'Submitted' | 'Timed-Out';
  started_at?: string | null;
  submitted_at?: string | null;
  duration_seconds?: number | null;
  score?: number | null;
  total_correct: number;
  total_wrong: number;
  created_at: string;
  mst_users?: { id_user: string; nama_user: string; email: string };
  trn_test_session?: { session_name: string; duration_minutes: number; passing_score: number };
  mst_group_question?: { group_name: string };
  trn_attempt_question?: AttemptQuestion[];
}

export interface SubmitResult {
  id_test_attempt: number;
  score: number;
  total_correct: number;
  total_wrong: number;
  total_questions: number;
  duration_seconds: number;
  passed: boolean;
}
