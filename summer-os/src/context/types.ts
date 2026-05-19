export type WorkoutStatus = 'done' | 'missed' | null;

export interface NutritionEntry {
  cal: number;
  pro: number;
  carb: number;
  fat: number;
}

export interface RevenueEntry {
  id: string;
  ventureId: string;
  date: string;
  amount: number;
  source: string;
  notes: string;
}

export type VentureStage = 'Idea' | 'Building' | 'Testing' | 'Running' | 'Profitable';

export interface Venture {
  id: string;
  name: string;
  category: string;
  website: string;
  stage: VentureStage;
  startDate: string;
  revenue: RevenueEntry[];
}

export type LessonCategory =
  | 'Marketing'
  | 'Operations'
  | 'Sales'
  | 'Mindset'
  | 'Technical'
  | 'Other';

export interface Lesson {
  id: string;
  date: string;
  category: LessonCategory;
  text: string;
}

export interface Topic {
  id: string;
  name: string;
  difficulty: 1 | 2 | 3;
  completed: boolean;
  notes: string;
}

export interface StudySession {
  id: string;
  date: string;
  topicId: string;
  topicName: string;
  duration: number;
  notes: string;
}

export type AgentStatus = 'Active' | 'Paused' | 'Testing' | 'Deployed';

export interface Agent {
  id: string;
  name: string;
  purpose: string;
  ventureId: string;
  status: AgentStatus;
  notes: string;
  lastRun: string;
}

export interface Observation {
  id: string;
  ts: string;
  text: string;
}

export type NoteTag = 'lesson' | 'mistake' | 'win' | 'idea' | 'observation';

export interface BrainNote {
  id: string;
  ts: string;
  tag: NoteTag;
  text: string;
}

export interface AppState {
  health: {
    weekLog: Record<string, Record<string, WorkoutStatus>>;
    nutrition: Record<string, NutritionEntry>;
  };
  business: {
    ventures: Venture[];
    lessons: Lesson[];
  };
  academic: {
    examDate: string;
    topics: Topic[];
    sessions: StudySession[];
  };
  ai: {
    agents: Agent[];
    observations: Observation[];
  };
  brain: {
    dailyNotes: Record<string, string>;
    notes: BrainNote[];
  };
}

export type AppAction =
  | { type: 'LOG_WORKOUT'; weekKey: string; day: string; status: WorkoutStatus }
  | { type: 'LOG_NUTRITION'; date: string; entry: NutritionEntry }
  | { type: 'ADD_VENTURE'; venture: Venture }
  | { type: 'DELETE_VENTURE'; id: string }
  | { type: 'UPDATE_VENTURE_STAGE'; id: string; stage: VentureStage }
  | { type: 'LOG_REVENUE'; ventureId: string; entry: RevenueEntry }
  | { type: 'DELETE_REVENUE'; ventureId: string; entryId: string }
  | { type: 'ADD_LESSON'; lesson: Lesson }
  | { type: 'DELETE_LESSON'; id: string }
  | { type: 'SET_EXAM_DATE'; date: string }
  | { type: 'TOGGLE_TOPIC'; id: string }
  | { type: 'UPDATE_TOPIC_NOTES'; id: string; notes: string }
  | { type: 'LOG_SESSION'; session: StudySession }
  | { type: 'DELETE_SESSION'; id: string }
  | { type: 'ADD_AGENT'; agent: Agent }
  | { type: 'UPDATE_AGENT'; agent: Agent }
  | { type: 'DELETE_AGENT'; id: string }
  | { type: 'LOG_OBSERVATION'; observation: Observation }
  | { type: 'DELETE_OBSERVATION'; id: string }
  | { type: 'UPDATE_DAILY_NOTE'; date: string; text: string }
  | { type: 'ADD_BRAIN_NOTE'; note: BrainNote }
  | { type: 'DELETE_BRAIN_NOTE'; id: string }
  | { type: 'LOAD_STATE'; state: AppState }
  | { type: 'RESET_STATE' };
