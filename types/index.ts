// Research Request Types
export interface ResearchRequest {
  question: string;  // Backend expects 'question', not 'query'
  use_cache?: boolean;
}

// Research Response Types
export interface ResearchResponse {
  answer: string;
  quality_score: number;
  iterations: number;
  research_plan?: string | string[];  // Backend returns string, can be parsed
  sources?: Source[];
  session_id: string;
  created_at?: string;  // Optional - not always returned by backend
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

// Session Types (matches backend ResearchSession.to_dict())
export interface Session {
  session_id: string;
  question: string;
  answer: string;
  quality_score: number;
  iterations: number;
  research_plan?: string | string[];
  sources?: Source[];
  created_at: string;
  completed_at?: string;
}

export interface SessionsResponse {
  sessions: Session[];
  total: number;
}

export interface SessionDetailResponse {
  session: Session;
}

// API Error Types
export interface ApiError {
  message: string;
  status?: number;
  details?: string;
}

// UI State Types
export interface ResearchState {
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

export interface SessionState {
  sessions: Session[];
  isLoading: boolean;
  selectedSession: Session | null;
  fetchSessions: () => Promise<void>;
  selectSession: (id: string) => void;
  clearSelection: () => void;
  setLoading: (loading: boolean) => void;
  setSessions: (sessions: Session[]) => void;
}
