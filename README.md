# AI Interview Assistant

A comprehensive React application that provides AI-powered interview assistance with two main interfaces: Interviewee and Interviewer.

## Features

### Interviewee Interface
- **Resume Upload**: Support for PDF and DOCX files with automatic field extraction
- **Profile Completion**: Chatbot collects missing information (name, email, phone)
- **Timed Interview**: 6 questions (2 Easy, 2 Medium, 2 Hard) with automatic timers
- **Real-time Progress**: Visual progress tracking and question navigation
- **Pause/Resume**: Ability to pause and resume interviews

### Interviewer Dashboard
- **Candidate Management**: View all candidates with scores and status
- **Detailed Views**: Complete interview history, answers, and AI feedback
- **Search & Sort**: Find candidates by name or email
- **Score Analysis**: Visual representation of candidate performance

### Core Features
- **Data Persistence**: All data saved locally using Redux Persist
- **Welcome Back Modal**: Automatic detection of unfinished sessions
- **Error Handling**: Comprehensive error boundaries and validation
- **Responsive Design**: Modern UI with Ant Design components

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Ant Design
- **File Processing**: pdf-parse, mammoth
- **Build Tool**: Webpack 5
- **Styling**: CSS with Ant Design components

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Build for production:
```bash
npm run build
```

## Usage

### For Candidates (Interviewee Tab)
1. Upload your resume (PDF or DOCX)
2. Review and complete your profile information
3. Start the timed interview
4. Answer questions within the time limits
5. View your progress and scores

### For Interviewers (Interviewer Tab)
1. View the candidate dashboard
2. Search and filter candidates
3. Click on any candidate to view detailed interview results
4. Review AI-generated scores and feedback
5. Export or analyze candidate performance

## Interview Flow

1. **Easy Questions** (20 seconds each): Basic React and JavaScript concepts
2. **Medium Questions** (60 seconds each): Intermediate topics and problem-solving
3. **Hard Questions** (120 seconds each): Advanced system design and architecture

## Data Persistence

The application automatically saves:
- Candidate profiles and resume data
- Interview progress and answers
- Timer states and session information
- AI scores and feedback

All data persists across browser sessions and page refreshes.

## Error Handling

- File upload validation (type and size)
- Form validation for required fields
- Network error handling
- Graceful fallbacks for AI services
- Error boundaries for component crashes

## Development

The project uses:
- TypeScript for type safety
- Redux Toolkit for state management
- Ant Design for UI components
- Webpack for bundling
- Hot reloading for development

## License

MIT License
