export interface ModuleState {
  moduleId: string;
  moduleNumber: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  score: number | null; // e.g. 85 for 85%
  completedLessons: string[];
}

export interface StudentProgressRecord {
  courseId: string;
  courseTitle: string;
  studentName: string;
  modules: Record<string, ModuleState>;
  overallProgress: number; // 0 - 100
  isCertified: boolean;
  certifiedAt?: string;
  certificateId?: string;
}

const STORAGE_KEY = 'lms_student_progress_v1';
const PASSING_THRESHOLD = 75; // Must achieve >= 75% to unlock subsequent module

export function getStudentProgress(courseId: string, defaultTitle: string = 'Course Track'): StudentProgressRecord {
  if (typeof window === 'undefined') {
    return createInitialRecord(courseId, defaultTitle);
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${courseId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read student progress', err);
  }

  const initial = createInitialRecord(courseId, defaultTitle);
  saveStudentProgress(initial);
  return initial;
}

export function saveStudentProgress(record: StudentProgressRecord): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_KEY}_${record.courseId}`, JSON.stringify(record));
}

function createInitialRecord(courseId: string, courseTitle: string): StudentProgressRecord {
  return {
    courseId,
    courseTitle,
    studentName: 'Student Learner',
    modules: {
      'mod-1': {
        moduleId: 'mod-1',
        moduleNumber: 1,
        isUnlocked: true, // Module 1 is open by default
        isCompleted: false,
        score: null,
        completedLessons: [],
      },
      'mod-2': {
        moduleId: 'mod-2',
        moduleNumber: 2,
        isUnlocked: false,
        isCompleted: false,
        score: null,
        completedLessons: [],
      },
      'mod-3': {
        moduleId: 'mod-3',
        moduleNumber: 3,
        isUnlocked: false,
        isCompleted: false,
        score: null,
        completedLessons: [],
      },
    },
    overallProgress: 0,
    isCertified: false,
  };
}

/**
 * Evaluates assessment results and unlocks the next module if threshold is satisfied
 */
export function recordAssessmentResult(
  courseId: string,
  moduleId: string,
  scorePercent: number
): { unlockedNext: boolean; nextModuleId?: string; isCourseComplete: boolean } {
  const progress = getStudentProgress(courseId);
  const currentMod = progress.modules[moduleId];
  if (!currentMod) return { unlockedNext: false, isCourseComplete: false };

  currentMod.score = scorePercent;
  const passed = scorePercent >= PASSING_THRESHOLD;
  currentMod.isCompleted = passed;

  const moduleOrder = ['mod-1', 'mod-2', 'mod-3'];
  const currentIndex = moduleOrder.indexOf(moduleId);
  let unlockedNext = false;
  let nextModuleId: string | undefined = undefined;

  if (passed && currentIndex !== -1 && currentIndex < moduleOrder.length - 1) {
    nextModuleId = moduleOrder[currentIndex + 1];
    if (progress.modules[nextModuleId]) {
      progress.modules[nextModuleId].isUnlocked = true;
      unlockedNext = true;
    }
  }

  // Calculate overall platform completion
  const totalMods = moduleOrder.length;
  const completedMods = moduleOrder.filter((id) => progress.modules[id]?.isCompleted).length;
  progress.overallProgress = Math.round((completedMods / totalMods) * 100);

  const isCourseComplete = completedMods === totalMods;
  if (isCourseComplete && !progress.isCertified) {
    progress.isCertified = true;
    progress.certifiedAt = new Date().toISOString();
    progress.certificateId = `CERT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  saveStudentProgress(progress);
  return { unlockedNext, nextModuleId, isCourseComplete };
}