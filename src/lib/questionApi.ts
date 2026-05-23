import { apiFetch, apiUpload } from './api';
import type { Question, QuestionSummary, Answer, ApiListResponse, ApiDetailResponse } from './types';

export interface ListQuestionsParams {
  search?: string;
  difficulty_flag?: 'Easy' | 'Medium' | 'Hard';
  id_position?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getQuestions(params: ListQuestionsParams = {}): Promise<ApiListResponse<Question>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.difficulty_flag) qs.set('difficulty_flag', params.difficulty_flag);
  if (params.id_position) qs.set('id_position', String(params.id_position));
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);
  return apiFetch(`/questions?${qs.toString()}`);
}

export async function getQuestionSummary(): Promise<{ data: QuestionSummary }> {
  return apiFetch('/questions/summary');
}

export async function getQuestionDetail(id: number): Promise<ApiDetailResponse<Question>> {
  return apiFetch(`/questions/${id}`);
}

export interface CreateQuestionData {
  question_desc: string;
  question_content_json?: string;
  question_content_html?: string;
  img_path?: string;
  difficulty_flag?: 'Easy' | 'Medium' | 'Hard';
  position_ids?: number[];
  answers?: {
    answer_desc: string;
    answer_content_json?: string;
    answer_content_html?: string;
    is_correct: boolean;
  }[];
}

export async function createQuestion(data: CreateQuestionData): Promise<ApiDetailResponse<Question>> {
  return apiFetch('/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface UpdateQuestionData {
  question_desc?: string;
  question_content_json?: string | null;
  question_content_html?: string | null;
  img_path?: string | null;
  difficulty_flag?: 'Easy' | 'Medium' | 'Hard';
  position_ids?: number[];
}

export async function updateQuestion(id: number, data: UpdateQuestionData): Promise<ApiDetailResponse<Question>> {
  return apiFetch(`/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteQuestion(id: number): Promise<{ message: string }> {
  return apiFetch(`/questions/${id}`, { method: 'DELETE' });
}

// ── Answers ────────────────────────────────────────────────────────────────────
export interface AnswerData {
  answer_desc: string;
  answer_content_json?: string;
  answer_content_html?: string;
  is_correct: boolean;
}

export async function createAnswer(questionId: number, data: AnswerData): Promise<ApiDetailResponse<Answer>> {
  return apiFetch(`/questions/${questionId}/answers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAnswer(questionId: number, answerId: number, data: Partial<AnswerData>): Promise<ApiDetailResponse<Answer>> {
  return apiFetch(`/questions/${questionId}/answers/${answerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAnswer(questionId: number, answerId: number): Promise<{ message: string }> {
  return apiFetch(`/questions/${questionId}/answers/${answerId}`, { method: 'DELETE' });
}

// ── Position Mapping ───────────────────────────────────────────────────────────
export async function mapPositions(questionId: number, position_ids: number[]): Promise<{ message: string }> {
  return apiFetch(`/questions/${questionId}/map-positions`, {
    method: 'POST',
    body: JSON.stringify({ position_ids }),
  });
}

// ── Upload ─────────────────────────────────────────────────────────────────────
export async function uploadQuestionImage(file: File): Promise<{ data: { img_path: string } }> {
  const formData = new FormData();
  formData.append('image', file);
  return apiUpload('/upload/image', formData);
}
