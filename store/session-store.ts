import { create } from 'zustand';
import { Session } from '@/types';
import { getRecentSessions } from '@/lib/api-functions';

interface SessionState {
  sessions: Session[];
  isLoading: boolean;
  selectedSession: Session | null;
  error: string | null;
  fetchSessions: (limit?: number) => Promise<void>;
  selectSession: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setSessions: (sessions: Session[]) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  isLoading: false,
  selectedSession: null,
  error: null,

  fetchSessions: async (limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await getRecentSessions(limit);
      set({ sessions: response.sessions, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch sessions';
      set({ error: message, isLoading: false });
    }
  },

  selectSession: (id: string) => {
    const session = get().sessions.find((s) => s.session_id === id) || null;
    set({ selectedSession: session });
  },

  clearSelection: () => set({ selectedSession: null }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setSessions: (sessions: Session[]) => set({ sessions }),
}));
