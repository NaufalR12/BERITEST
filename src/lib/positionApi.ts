import { apiFetch } from './api';
import type { Position, ApiListResponse, ApiDetailResponse } from './types';

export interface ListPositionsParams {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getPositions(params: ListPositionsParams = {}): Promise<ApiListResponse<Position>> {
  const qs = new URLSearchParams();
  if (params.search) qs.set('search', params.search);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.sortBy) qs.set('sortBy', params.sortBy);
  if (params.sortOrder) qs.set('sortOrder', params.sortOrder);
  return apiFetch(`/positions?${qs.toString()}`);
}

export async function getPositionDetail(id: number): Promise<ApiDetailResponse<Position>> {
  return apiFetch(`/positions/${id}`);
}

export async function createPosition(data: { position_name: string }): Promise<ApiDetailResponse<Position>> {
  return apiFetch('/positions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePosition(id: number, data: { position_name: string }): Promise<ApiDetailResponse<Position>> {
  return apiFetch(`/positions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePosition(id: number): Promise<{ message: string }> {
  return apiFetch(`/positions/${id}`, { method: 'DELETE' });
}
