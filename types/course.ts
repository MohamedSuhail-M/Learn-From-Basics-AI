export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: 'reading' | 'video' | 'interactive';
  contentMarkdown?: string;
  videoUrl?: string;
  sourceCitations?: string[];
  isCompleted?: boolean;
}

export interface ModuleAssessment {
  id: string;
  title: string;
  passingScorePercent: number;
  prerequisiteConcepts: string[]; // Concepts mapped directly to your DAG
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
  assessment: ModuleAssessment;
  isUnlocked: boolean;
  isCompleted: boolean;
}

export interface StudentCourse {
  courseId: string;
  title: string;
  category: string;
  modules: CourseModule[];
  overallProgress: number; // e.g. 0 - 100%
}