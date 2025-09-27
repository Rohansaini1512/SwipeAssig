export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resume?: File;
  resumeText?: string;
  interviewStatus: 'not_started' | 'in_progress' | 'completed' | 'paused';
  currentQuestionIndex: number;
  questions: Question[];
  answers: Answer[];
  finalScore?: number;
  summary?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  text: string;
  score?: number;
  feedback?: string;
  timeSpent: number;
  submittedAt: Date;
}

export interface InterviewState {
  candidates: Candidate[];
  currentCandidate?: Candidate;
  isInterviewActive: boolean;
  currentQuestion?: Question;
  timeRemaining: number;
  isPaused: boolean;
}

export interface AppState {
  interview: InterviewState;
  ui: {
    activeTab: 'interviewee' | 'interviewer';
    showWelcomeBackModal: boolean;
    loading: boolean;
  };
}
