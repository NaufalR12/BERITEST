import { apiFetch } from './api';
import type { Attempt, AttemptQuestion, SubmitResult, ApiListResponse, ApiDetailResponse } from './types';

export interface StartAttemptData {
  id_session: number;
  id_question_group: number;
}

export async function startAttempt(data: StartAttemptData): Promise<ApiDetailResponse<Attempt>> {
  return apiFetch('/attempts/start', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getAttemptDetail(id: number): Promise<ApiDetailResponse<Attempt>> {
  return apiFetch(`/attempts/${id}`);
}

export async function submitAttempt(id: number): Promise<{ message: string; data: SubmitResult }> {
  return apiFetch(`/attempts/${id}/submit`, { method: 'POST', body: JSON.stringify({}) });
}

export async function timeoutAttempt(id: number): Promise<{ message: string }> {
  return apiFetch(`/attempts/${id}/timeout`, { method: 'POST', body: JSON.stringify({}) });
}

export interface SaveAnswerData {
  id_answer_option: number;
  time_spent_seconds?: number;
}

export async function saveAnswer(
  attemptId: number,
  attemptQuestionId: number,
  data: SaveAnswerData
): Promise<{ message: string; data: { is_correct: boolean } }> {
  return apiFetch(`/attempts/${attemptId}/questions/${attemptQuestionId}/answer`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTimeSpent(
  attemptId: number,
  attemptQuestionId: number,
  time_spent_seconds: number
): Promise<{ message: string }> {
  return apiFetch(`/attempts/${attemptId}/questions/${attemptQuestionId}/time`, {
    method: 'PATCH',
    body: JSON.stringify({ time_spent_seconds }),
  });
}

export interface ListAttemptsParams {
  page?: number;
  limit?: number;
}

export async function getMyAttempts(params: ListAttemptsParams = {}): Promise<ApiListResponse<Attempt>> {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  return apiFetch(`/attempts/my?${qs.toString()}`);
}
