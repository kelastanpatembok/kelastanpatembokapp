export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type LessonType = 'article' | 'video' | 'quiz';

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content?: string; // For article lessons
  videoUrl?: string; // For video lessons (YouTube or HLS)
  transcript?: string; // For video lessons
  duration?: string;
  quizQuestions?: QuizQuestion[]; // For quiz lessons
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  communityId: string;
  level: CourseLevel;
  lessons: Lesson[];
  instructor?: {
    name: string;
    avatar?: string;
  };
  duration?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

