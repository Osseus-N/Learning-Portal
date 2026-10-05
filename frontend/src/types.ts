export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type MultipleChoiceQuestion = {
  id: string;
  type: "multiple-choice";
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type MultiSelectQuestion = {
  id: string;
  type: "multi-select";
  prompt: string;
  options: string[];
  answers: number[];
  explanation: string;
};

export type CodeOutputQuestion = {
  id: string;
  type: "code-output";
  prompt: string;
  code: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type FillBlankQuestion = {
  id: string;
  type: "fill-blank";
  prompt: string;
  codeBefore: string;
  codeAfter: string;
  answer: string;
  explanation: string;
};

export type QuizQuestion =
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | CodeOutputQuestion
  | FillBlankQuestion;

export type QuizDocument = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};

export type LessonDocument = {
  id: string;
  title: string;
  durationMinutes: number;
  summary: string;
  content: string[];
  code?: string;
  quiz?: QuizDocument;
};

export type CourseDocument = {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  lessons: LessonDocument[];
  tags: string[];
};

export type LearnerProfileRow = {
  id: string;
  fullName: string;
  email: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  practiceStreak: number;
  enrolledCourseIds: string[];
};

export type AchievementRow = {
  id: string;
  profileId: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt: string | null;
  progress: number;
  target: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
};

export type CourseProgressRow = {
  profileId: string;
  courseId: string;
  completedLessonIds: string[];
  currentLessonId: string;
  updatedAt: string;
};
