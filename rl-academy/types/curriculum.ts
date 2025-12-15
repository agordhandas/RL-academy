export type LessonType = 'theory' | 'quiz' | 'exercise' | 'playground' | 'checkpoint';

// Old quiz question type (keeping for backwards compatibility)
export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  correctAnswer: number | number[] | boolean | string;
  explanation: string;
  hints?: string[];
}

// New AI-powered question type
export interface AIQuestion {
  id: string;
  question: string;
  context?: string; // Additional context for the question
  concepts: string[]; // Key concepts the answer should address
  followUp?: string; // Follow-up question based on answer
  hints?: string[]; // Progressive hints if stuck
  rubric?: {
    excellent: string[]; // Points that make an excellent answer
    good: string[]; // Points that make a good answer
    needsWork: string[]; // Common misconceptions or gaps
  };
  relatedCode?: string; // Optional code snippet related to question
}

// Interactive question that appears within lesson content
export interface InteractiveQuestion {
  id: string;
  question: string;
  context?: string; // Context about what was just learned
  expectedConcepts?: string[]; // Key concepts the answer should touch on
  sampleAnswers?: {
    ifEpsilonZero?: string; // Example expected answer for epsilon=0
    ifEpsilonOne?: string; // Example expected answer for epsilon=1
  };
  followUpPrompt?: string; // Prompt to guide the LLM in providing feedback
}

export interface CodeTest {
  name: string;
  description: string;
  testCode: string;
  expectedOutput?: any;
}

export interface Lesson {
  id: string;
  type: LessonType;
  title: string;
  description: string;
  estimatedMinutes: number;
  content?: string; // For theory lessons (markdown)
  questions?: QuizQuestion[]; // For old-style quiz lessons
  aiQuestions?: AIQuestion[]; // For AI-powered quiz lessons
  interactiveQuestions?: InteractiveQuestion[]; // Interactive questions within lessons
  starterCode?: string; // For exercises
  solution?: string; // For exercises
  tests?: CodeTest[]; // For exercises
  hints?: string[]; // For exercises
  playgroundConfig?: any; // For playground lessons
}

export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  prerequisites: string[];
  estimatedHours: number;
  lessons: Lesson[];
  checkpointQuiz?: AIQuestion[]; // Checkpoint uses AI questions too
}

export interface UserProgress {
  userId: string;
  completedLessons: Set<string>;
  quizScores: Map<string, number>;
  quizResponses: Map<string, QuizResponse[]>; // Store actual responses
  exerciseAttempts: Map<string, number>;
  currentModule: string;
  currentLesson: string;
  lastActive: Date;
  totalLearningTime: number;
  checkpointScores: Map<string, number>;
}

export interface QuizResponse {
  questionId: string;
  userAnswer: string;
  feedback: string;
  score: number; // 0-100
  timestamp: Date;
}

export interface UserCode {
  lessonId: string;
  code: string;
  lastModified: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}