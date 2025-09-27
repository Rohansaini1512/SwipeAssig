# AI-Powered Interview Assistant

A React application that provides an AI-powered interview assistant with two main tabs: Interviewee (chat) and Interviewer (dashboard).

## Features

### Interviewee Tab
- **Resume Upload**: Accept PDF, DOCX, and TXT files
- **AI-Powered Extraction**: Uses Gemini AI to extract Name, Email, and Phone from resumes
- **Missing Fields Chat**: Interactive chatbot to collect missing information
- **Timed Interview**: 6 questions with different difficulty levels and time limits
  - 2 Easy questions (20 seconds each)
  - 2 Medium questions (60 seconds each)
  - 2 Hard questions (120 seconds each)
- **Pause/Resume**: Ability to pause and resume interviews
- **Welcome Back Modal**: Restores progress when returning to unfinished sessions

### Interviewer Tab
- **Candidate Dashboard**: List of all candidates ordered by score
- **Detailed View**: View each candidate's chat history, profile, and AI summary
- **Search Functionality**: Search candidates by name or email
- **Progress Tracking**: Visual progress indicators for each candidate

### AI Features
- **Gemini AI Integration**: Uses Google's Gemini AI for:
  - Resume data extraction
  - Dynamic question generation
  - Answer evaluation and scoring
  - Final summary generation
- **Intelligent Scoring**: AI evaluates answers based on technical accuracy, problem-solving approach, and communication clarity

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project
3. Generate an API key
4. Copy the API key

### 3. Configure Environment
Create a `.env` file in the root directory:
```
REACT_APP_GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Start the Application
```bash
npm start
```

The application will be available at `http://localhost:8080`

## Technology Stack

- **Frontend**: React 19, TypeScript
- **UI Library**: Ant Design
- **State Management**: Redux Toolkit with Redux Persist
- **AI Integration**: Google Gemini AI
- **Build Tool**: Webpack
- **Styling**: CSS with Ant Design components

## Project Structure

```
src/
├── components/           # React components
│   ├── CandidateList.tsx     # Interviewer dashboard
│   ├── ErrorBoundary.tsx     # Error handling
│   ├── InterviewChat.tsx     # Interview interface
│   ├── IntervieweeTab.tsx    # Main interviewee flow
│   ├── InterviewerTab.tsx   # Main interviewer flow
│   ├── MissingFieldsChat.tsx # Chatbot for missing fields
│   ├── ResumeUpload.tsx     # Resume upload component
│   └── WelcomeBackModal.tsx # Resume session modal
├── hooks/               # Custom React hooks
├── services/            # API services
│   ├── aiService.ts         # Gemini AI integration
│   └── resumeParser.ts     # Legacy PDF parser (replaced by Gemini)
├── store/               # Redux store
│   ├── index.ts             # Store configuration
│   └── slices/              # Redux slices
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## Usage

### For Interviewees
1. Upload your resume (PDF, DOCX, or TXT)
2. Review and complete your profile information
3. Start the interview
4. Answer 6 questions within the time limits
5. View your final score and summary

### For Interviewers
1. Switch to the Interviewer tab
2. View the list of candidates sorted by score
3. Click "View Details" to see individual candidate information
4. Review questions, answers, scores, and AI summaries

## Data Persistence

The application uses Redux Persist to save all data locally:
- Interview progress
- Candidate information
- Answers and scores
- Session state

Data persists across browser sessions and page refreshes.

## AI Integration

The application uses Google's Gemini AI for:
- **Resume Parsing**: Extracts structured data from resume text
- **Question Generation**: Creates relevant technical questions
- **Answer Evaluation**: Scores answers based on multiple criteria
- **Summary Generation**: Creates comprehensive candidate summaries

## Development

### Available Scripts
- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests (not implemented yet)

### Environment Variables
- `REACT_APP_GEMINI_API_KEY`: Your Gemini API key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
