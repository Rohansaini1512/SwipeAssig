import { Question } from '../types';

export const generateQuestions = (): Question[] => {
  return [
    // Easy questions
    {
      id: '1',
      text: 'What is React and what are its main advantages?',
      difficulty: 'easy',
      timeLimit: 20,
      category: 'React Fundamentals'
    },
    {
      id: '2',
      text: 'Explain the difference between let, const, and var in JavaScript.',
      difficulty: 'easy',
      timeLimit: 20,
      category: 'JavaScript Fundamentals'
    },
    // Medium questions
    {
      id: '3',
      text: 'How would you implement a custom hook in React to manage form state?',
      difficulty: 'medium',
      timeLimit: 60,
      category: 'React Advanced'
    },
    {
      id: '4',
      text: 'Explain the concept of closures in JavaScript with a practical example.',
      difficulty: 'medium',
      timeLimit: 60,
      category: 'JavaScript Advanced'
    },
    // Hard questions
    {
      id: '5',
      text: 'Design a scalable architecture for a real-time chat application using Node.js and React. Consider performance, scalability, and security.',
      difficulty: 'hard',
      timeLimit: 120,
      category: 'System Design'
    },
    {
      id: '6',
      text: 'Implement a custom state management solution similar to Redux but optimized for your specific use case. Explain your design decisions.',
      difficulty: 'hard',
      timeLimit: 120,
      category: 'Advanced React'
    }
  ];
};

export const evaluateAnswer = async (question: Question, answer: string): Promise<{ score: number; feedback: string }> => {
  // Simulate AI evaluation with mock scoring
  const mockScores = {
    easy: { min: 7, max: 10 },
    medium: { min: 5, max: 9 },
    hard: { min: 3, max: 8 }
  };

  const scoreRange = mockScores[question.difficulty];
  const score = Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min;
  
  const feedbacks = {
    easy: [
      'Good understanding of basic concepts.',
      'Clear explanation with good examples.',
      'Shows solid foundation knowledge.'
    ],
    medium: [
      'Demonstrates good problem-solving skills.',
      'Shows understanding of intermediate concepts.',
      'Good technical knowledge with room for improvement.'
    ],
    hard: [
      'Excellent problem-solving approach.',
      'Shows deep understanding of complex topics.',
      'Demonstrates senior-level thinking.'
    ]
  };

  const feedback = feedbacks[question.difficulty][Math.floor(Math.random() * feedbacks[question.difficulty].length)];

  return { score, feedback };
};

export const generateSummary = async (candidate: any, answers: any[]): Promise<string> => {
  const totalScore = answers.reduce((sum, answer) => sum + (answer.score || 0), 0);
  const averageScore = totalScore / answers.length;
  
  let performance = '';
  if (averageScore >= 8) {
    performance = 'excellent';
  } else if (averageScore >= 6) {
    performance = 'good';
  } else if (averageScore >= 4) {
    performance = 'fair';
  } else {
    performance = 'needs improvement';
  }

  return `${candidate.name} demonstrated ${performance} technical knowledge during the interview. ` +
         `With an average score of ${averageScore.toFixed(1)}/10, they showed ${performance} understanding ` +
         `of React, JavaScript, and system design concepts. The candidate's responses indicated ` +
         `${performance} problem-solving abilities and technical communication skills.`;
};
