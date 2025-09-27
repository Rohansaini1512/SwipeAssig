import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question } from '../types';

// Initialize Gemini AI with fallback
const getApiKey = () => {
  return process.env.REACT_APP_GEMINI_API_KEY || 'your-api-key-here';
};

const genAI = new GoogleGenerativeAI(getApiKey());
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const extractResumeData = async (resumeText: string): Promise<{
  name?: string;
  email?: string;
  phone?: string;
  text: string;
}> => {
  try {
    // Check if we have a valid API key
    if (getApiKey() === 'your-api-key-here') {
      console.warn('No Gemini API key provided, using fallback extraction');
      return extractFieldsFromText(resumeText);
    }

    const prompt = `
    Extract the following information from this resume text:
    1. Full Name
    2. Email Address
    3. Phone Number
    
    Return the information in JSON format with keys: name, email, phone.
    If any information is not found, use null for that field.
    
    Resume text:
    ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON response
    try {
      const extracted = JSON.parse(text);
      return {
        name: extracted.name || undefined,
        email: extracted.email || undefined,
        phone: extracted.phone || undefined,
        text: resumeText
      };
    } catch (parseError) {
      // Fallback to regex extraction if JSON parsing fails
      return extractFieldsFromText(resumeText);
    }
  } catch (error) {
    console.error('Error extracting resume data:', error);
    return extractFieldsFromText(resumeText);
  }
};

const extractFieldsFromText = (text: string) => {
  const extracted: any = {};

  // Extract email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    extracted.email = emailMatch[0];
  }

  // Extract phone
  const phoneRegex = /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    extracted.phone = phoneMatch[0].replace(/\D/g, '');
  }

  // Extract name (look for common patterns)
  const nameRegex = /(?:Name|Full Name|First Name|Last Name)[:\s]+([A-Za-z\s]+)/i;
  const nameMatch = text.match(nameRegex);
  if (nameMatch) {
    extracted.name = nameMatch[1].trim();
  } else {
    // Fallback: look for capitalized words at the beginning
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
        extracted.name = firstLine;
      }
    }
  }

  return {
    name: extracted.name,
    email: extracted.email,
    phone: extracted.phone,
    text
  };
};

export const generateQuestions = async (): Promise<Question[]> => {
  try {
    // Check if we have a valid API key
    if (getApiKey() === 'your-api-key-here') {
      console.warn('No Gemini API key provided, using fallback questions');
      return getFallbackQuestions();
    }

    const prompt = `
    Generate 6 technical interview questions for a Full Stack Developer position (React/Node.js).
    The questions should be structured as follows:
    - 2 Easy questions (20 seconds each)
    - 2 Medium questions (60 seconds each)  
    - 2 Hard questions (120 seconds each)
    
    Focus on React, JavaScript, Node.js, and system design topics.
    Return the questions in JSON format with this structure:
    [
      {
        "id": "1",
        "text": "question text here",
        "difficulty": "easy|medium|hard",
        "timeLimit": 20|60|120,
        "category": "category name"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const questions = JSON.parse(text);
      return questions;
    } catch (parseError) {
      // Fallback to static questions if parsing fails
      return getFallbackQuestions();
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return getFallbackQuestions();
  }
};

const getFallbackQuestions = (): Question[] => {
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
  try {
    // Check if we have a valid API key
    if (getApiKey() === 'your-api-key-here') {
      console.warn('No Gemini API key provided, using fallback evaluation');
      return getMockEvaluation(question);
    }

    const prompt = `
    Evaluate this interview answer for a Full Stack Developer position.
    
    Question: ${question.text}
    Difficulty: ${question.difficulty}
    Category: ${question.category}
    
    Answer: ${answer}
    
    Please provide:
    1. A score from 1-10 (where 10 is excellent)
    2. Brief feedback explaining the score
    
    Consider:
    - Technical accuracy
    - Problem-solving approach
    - Communication clarity
    - Depth of understanding
    - Practical examples
    
    Return in JSON format:
    {
      "score": number,
      "feedback": "string"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const evaluation = JSON.parse(text);
      return {
        score: Math.max(1, Math.min(10, evaluation.score || 5)),
        feedback: evaluation.feedback || 'No specific feedback provided.'
      };
    } catch (parseError) {
      // Fallback to mock evaluation
      return getMockEvaluation(question);
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return getMockEvaluation(question);
  }
};

const getMockEvaluation = (question: Question): { score: number; feedback: string } => {
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
  try {
    // Check if we have a valid API key
    if (getApiKey() === 'your-api-key-here') {
      console.warn('No Gemini API key provided, using fallback summary');
      return getFallbackSummary(candidate, answers);
    }

    const prompt = `
    Generate a comprehensive interview summary for this candidate.
    
    Candidate: ${candidate.name}
    Email: ${candidate.email}
    
    Questions and Answers:
    ${answers.map((answer, index) => `
    Q${index + 1}: ${answer.question?.text || 'Question not available'}
    Answer: ${answer.text}
    Score: ${answer.score || 'Not scored'}
    `).join('\n')}
    
    Provide a professional summary including:
    1. Overall performance assessment
    2. Strengths demonstrated
    3. Areas for improvement
    4. Recommendation for next steps
    
    Keep it concise but informative (2-3 paragraphs).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    return getFallbackSummary(candidate, answers);
  }
};

const getFallbackSummary = (candidate: any, answers: any[]): string => {
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
