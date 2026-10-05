import type { AchievementRow, CourseProgressRow, LearnerProfileRow } from "../types";

const profile: LearnerProfileRow = {
  id: "learner-noor",
  fullName: "Noor James",
  email: "noor@example.com",
  title: "C Specialist",
  level: 12,
  xp: 1240,
  xpToNextLevel: 1500,
  practiceStreak: 7,
  enrolledCourseIds: ["c-fundamentals", "c-arrays", "c-pointers"],
};

const achievements: AchievementRow[] = [
  { id: "first-program", profileId: profile.id, title: "First Program", description: "Completed your first C lesson.", xpReward: 50, unlockedAt: "2026-09-18", progress: 1, target: 1, rarity: "common" },
  { id: "week-of-code", profileId: profile.id, title: "Week of Code", description: "Practice for seven days in a row.", xpReward: 120, unlockedAt: "2026-10-04", progress: 7, target: 7, rarity: "rare" },
  { id: "memory-keeper", profileId: profile.id, title: "Memory Keeper", description: "Complete ten exercises about memory.", xpReward: 200, unlockedAt: null, progress: 6, target: 10, rarity: "epic" },
];

const courseProgress: CourseProgressRow[] = [
  { profileId: profile.id, courseId: "c-fundamentals", completedLessonIds: ["variables", "types", "conditions"], currentLessonId: "functions", updatedAt: "2026-10-05T08:00:00.000Z" },
  { profileId: profile.id, courseId: "c-arrays", completedLessonIds: [], currentLessonId: "", updatedAt: "2026-10-04T11:00:00.000Z" },
  { profileId: profile.id, courseId: "c-pointers", completedLessonIds: [], currentLessonId: "", updatedAt: "2026-10-03T12:00:00.000Z" },
];

export interface RelationalService {
  getProfile(profileId: string): Promise<LearnerProfileRow | null>;
  updateProfile(profileId: string, changes: Pick<LearnerProfileRow, "fullName" | "email">): Promise<LearnerProfileRow>;
  getAchievements(profileId: string): Promise<AchievementRow[]>;
  getCourseProgress(profileId: string): Promise<CourseProgressRow[]>;
  completeLesson(profileId: string, courseId: string, lessonId: string): Promise<CourseProgressRow>;
}

export const relationalService: RelationalService = {
  async getProfile(profileId) {
    return profileId === profile.id ? structuredClone(profile) : null;
  },
  async updateProfile(profileId, changes) {
    if (profileId !== profile.id) throw new Error("The requested learner profile does not exist.");
    profile.fullName = changes.fullName;
    profile.email = changes.email;
    return structuredClone(profile);
  },
  async getAchievements(profileId) {
    return structuredClone(achievements.filter((achievement) => achievement.profileId === profileId));
  },
  async getCourseProgress(profileId) {
    return structuredClone(courseProgress.filter((row) => row.profileId === profileId));
  },
  async completeLesson(profileId, courseId, lessonId) {
    const row = courseProgress.find((progress) => progress.profileId === profileId && progress.courseId === courseId);
    if (!row) throw new Error(`No course progress exists for course ${courseId}.`);
    if (!row.completedLessonIds.includes(lessonId)) row.completedLessonIds.push(lessonId);
    row.updatedAt = new Date().toISOString();
    return structuredClone(row);
  },
};
