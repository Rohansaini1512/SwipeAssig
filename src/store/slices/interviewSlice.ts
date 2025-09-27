import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Candidate, Question, Answer, InterviewState } from '../../types';

const initialState: InterviewState = {
  candidates: [],
  currentCandidate: undefined,
  isInterviewActive: false,
  currentQuestion: undefined,
  timeRemaining: 0,
  isPaused: false
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<Candidate>) => {
      state.candidates.push(action.payload);
    },
    updateCandidate: (state, action: PayloadAction<Partial<Candidate> & { id: string }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    },
    setCurrentCandidate: (state, action: PayloadAction<Candidate | undefined>) => {
      state.currentCandidate = action.payload;
    },
    startInterview: (state, action: PayloadAction<{ candidateId: string; questions: Question[] }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.interviewStatus = 'in_progress';
        candidate.questions = action.payload.questions;
        candidate.currentQuestionIndex = 0;
        candidate.startTime = new Date();
        state.currentCandidate = candidate;
        state.isInterviewActive = true;
        state.currentQuestion = action.payload.questions[0];
        state.timeRemaining = action.payload.questions[0].timeLimit;
      }
    },
    submitAnswer: (state, action: PayloadAction<{ questionId: string; answer: string; timeSpent: number }>) => {
      if (state.currentCandidate) {
        const answer: Answer = {
          questionId: action.payload.questionId,
          text: action.payload.answer,
          timeSpent: action.payload.timeSpent,
          submittedAt: new Date()
        };
        state.currentCandidate.answers.push(answer);
        
        const nextIndex = state.currentCandidate.currentQuestionIndex + 1;
        if (nextIndex < state.currentCandidate.questions.length) {
          state.currentCandidate.currentQuestionIndex = nextIndex;
          state.currentQuestion = state.currentCandidate.questions[nextIndex];
          state.timeRemaining = state.currentCandidate.questions[nextIndex].timeLimit;
        } else {
          // Interview completed
          state.currentCandidate.interviewStatus = 'completed';
          state.currentCandidate.endTime = new Date();
          state.isInterviewActive = false;
          state.currentQuestion = undefined;
          state.timeRemaining = 0;
        }
      }
    },
    pauseInterview: (state) => {
      state.isPaused = true;
      if (state.currentCandidate) {
        state.currentCandidate.interviewStatus = 'paused';
      }
    },
    resumeInterview: (state) => {
      state.isPaused = false;
      if (state.currentCandidate) {
        state.currentCandidate.interviewStatus = 'in_progress';
      }
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    setFinalScore: (state, action: PayloadAction<{ candidateId: string; score: number; summary: string }>) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.finalScore = action.payload.score;
        candidate.summary = action.payload.summary;
      }
    }
  }
});

export const {
  addCandidate,
  updateCandidate,
  setCurrentCandidate,
  startInterview,
  submitAnswer,
  pauseInterview,
  resumeInterview,
  updateTimeRemaining,
  setFinalScore
} = interviewSlice.actions;

export default interviewSlice.reducer;
