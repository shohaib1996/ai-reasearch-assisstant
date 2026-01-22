import api from './api';
import {
  ResearchRequest,
  ResearchResponse,
  SessionsResponse,
  SessionDetailResponse
} from '@/types';

/**
 * Perform research on a given question
 */
export async function performResearch(
  question: string,
  useCache: boolean = true
): Promise<ResearchResponse> {
  const request: ResearchRequest = {
    question,
    use_cache: useCache,
  };

  const response = await api.post<ResearchResponse>('/api/research', request);
  return response.data;
}

/**
 * Get recent research sessions
 */
export async function getRecentSessions(limit: number = 10): Promise<SessionsResponse> {
  const response = await api.get<SessionsResponse>('/api/sessions/recent', {
    params: { limit },
  });
  return response.data;
}

/**
 * Get a specific session by ID
 */
export async function getSession(sessionId: string): Promise<SessionDetailResponse> {
  const response = await api.get<SessionDetailResponse>(`/api/sessions/${sessionId}`);
  return response.data;
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<{ status: string }> {
  const response = await api.get<{ status: string }>('/');
  return response.data;
}
