import { apiFetch } from './api';
import type { QuestionGroup, ApiListResponse, ApiDetailResponse } from './types';

export interface ListGroupsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getQuestionGroups(params: ListGroupsParams = {}): Promise<ApiListResponse<QuestionGroup>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);
  return apiFetch(`/question-groups?${qs.toString()}`);
}

export async function getQuestionGroupDetail(id: number): Promise<ApiDetailResponse<QuestionGroup>> {
  return apiFetch(`/question-groups/${id}`);
}

export interface CreateGroupData {
  group_name: string;
  description?: string;
  question_ids?: number[];
}

export async function createQuestionGroup(data: CreateGroupData): Promise<ApiDetailResponse<QuestionGroup>> {
  return apiFetch('/question-groups', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateQuestionGroup(id: number, data: { group_name?: string; description?: string }): Promise<ApiDetailResponse<QuestionGroup>> {
  return apiFetch(`/question-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteQuestionGroup(id: number): Promise<{ message: string }> {
  return apiFetch(`/question-groups/${id}`, { method: 'DELETE' });
}

export async function addQuestionsToGroup(groupId: number, question_ids: number[]): Promise<{ message: string; added_questions: number[] }> {
  return apiFetch(`/question-groups/${groupId}/add-questions`, {
    method: 'POST',
    body: JSON.stringify({ question_ids }),
  });
}

export async function removeQuestionFromGroup(groupId: number, questionId: number): Promise<{ message: string }> {
  return apiFetch(`/question-groups/${groupId}/questions/${questionId}`, { method: 'DELETE' });
}

export interface PositionQuota {
  id_position: number;
  percentage: number;
}

export async function randomizeGroup(groupId: number, total_questions: number, position_quotas?: PositionQuota[]): Promise<{ message: string; total_added: number }> {
  return apiFetch(`/question-groups/${groupId}/randomize`, {
    method: 'POST',
    body: JSON.stringify({ total_questions, position_quotas }),
  });
}
