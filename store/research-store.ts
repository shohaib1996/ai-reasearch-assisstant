import { create } from 'zustand';
import { ResearchResponse } from '@/types';

interface ResearchState {
  currentQuestion: string;
  isLoading: boolean;
  result: ResearchResponse | null;
  error: string | null;
  setQuestion: (question: string) => void;
  startResearch: () => void;
  setResult: (result: ResearchResponse) => void;
  setError: (error: string) => void;
  reset: () => void;
}

export const useResearchStore = create<ResearchState>((set) => ({
  currentQuestion: '',
  isLoading: false,
  result: null,
  error: null,

  setQuestion: (question: string) => set({ currentQuestion: question }),

  startResearch: () => set({ isLoading: true, error: null, result: null }),

  setResult: (result: ResearchResponse) =>
    set({ result, isLoading: false, error: null }),

  setError: (error: string) => set({ error, isLoading: false }),

  reset: () =>
    set({
      currentQuestion: '',
      isLoading: false,
      result: null,
      error: null,
    }),
}));
