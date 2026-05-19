import type { AppState, AppAction, Venture, Topic, Agent } from './types';

const DEFAULT_VENTURES: Venture[] = [
  {
    id: 'closet-curation',
    name: 'Closet Curation Co',
    category: 'Web Design / Freelance',
    website: 'closetcurationco.com',
    stage: 'Running',
    startDate: '2026-05-19',
    revenue: [
      {
        id: 'rev-001',
        ventureId: 'closet-curation',
        date: '2026-05-19',
        amount: 300,
        source: 'Client Website Build',
        notes: 'First summer project',
      },
    ],
  },
  {
    id: 'degree-planner',
    name: 'Degree Planner',
    category: 'EdTech / SaaS',
    website: '',
    stage: 'Building',
    startDate: '2026-05-19',
    revenue: [],
  },
];

const DEFAULT_TOPICS: Topic[] = [
  { id: 't1', name: 'Electrostatics & Coulomb\'s Law', difficulty: 2, completed: false, notes: '' },
  { id: 't2', name: 'Electric Fields', difficulty: 2, completed: false, notes: '' },
  { id: 't3', name: 'Gauss\'s Law', difficulty: 3, completed: false, notes: '' },
  { id: 't4', name: 'Electric Potential & Potential Energy', difficulty: 2, completed: false, notes: '' },
  { id: 't5', name: 'Capacitance & Dielectrics', difficulty: 2, completed: false, notes: '' },
  { id: 't6', name: 'Current, Resistance & DC Circuits', difficulty: 2, completed: false, notes: '' },
  { id: 't7', name: 'Magnetic Fields & Forces', difficulty: 2, completed: false, notes: '' },
  { id: 't8', name: 'Sources of Magnetic Fields (Biot-Savart, Ampère\'s Law)', difficulty: 3, completed: false, notes: '' },
  { id: 't9', name: 'Electromagnetic Induction & Faraday\'s Law', difficulty: 3, completed: false, notes: '' },
  { id: 't10', name: 'Inductance & LRC Circuits', difficulty: 3, completed: false, notes: '' },
  { id: 't11', name: 'Maxwell\'s Equations', difficulty: 3, completed: false, notes: '' },
  { id: 't12', name: 'Electromagnetic Waves', difficulty: 3, completed: false, notes: '' },
];

export const DEFAULT_STATE: AppState = {
  health: {
    weekLog: {},
    nutrition: {},
  },
  business: {
    ventures: DEFAULT_VENTURES,
    lessons: [],
  },
  academic: {
    examDate: '',
    topics: DEFAULT_TOPICS,
    sessions: [],
  },
  ai: {
    agents: [],
    observations: [],
  },
  brain: {
    dailyNotes: {},
    notes: [],
  },
};

function migrateAgent(agent: Agent): Agent {
  return {
    ...agent,
    tasks: agent.tasks ?? [],
    logs: agent.logs ?? [],
  };
}

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOG_WORKOUT':
      return {
        ...state,
        health: {
          ...state.health,
          weekLog: {
            ...state.health.weekLog,
            [action.weekKey]: {
              ...state.health.weekLog[action.weekKey],
              [action.day]: action.status,
            },
          },
        },
      };

    case 'LOG_NUTRITION':
      return {
        ...state,
        health: {
          ...state.health,
          nutrition: {
            ...state.health.nutrition,
            [action.date]: action.entry,
          },
        },
      };

    case 'ADD_VENTURE':
      return {
        ...state,
        business: {
          ...state.business,
          ventures: [...state.business.ventures, action.venture],
        },
      };

    case 'DELETE_VENTURE':
      return {
        ...state,
        business: {
          ...state.business,
          ventures: state.business.ventures.filter(v => v.id !== action.id),
        },
      };

    case 'UPDATE_VENTURE_STAGE':
      return {
        ...state,
        business: {
          ...state.business,
          ventures: state.business.ventures.map(v =>
            v.id === action.id ? { ...v, stage: action.stage } : v
          ),
        },
      };

    case 'LOG_REVENUE':
      return {
        ...state,
        business: {
          ...state.business,
          ventures: state.business.ventures.map(v =>
            v.id === action.ventureId
              ? { ...v, revenue: [...v.revenue, action.entry] }
              : v
          ),
        },
      };

    case 'DELETE_REVENUE':
      return {
        ...state,
        business: {
          ...state.business,
          ventures: state.business.ventures.map(v =>
            v.id === action.ventureId
              ? { ...v, revenue: v.revenue.filter(r => r.id !== action.entryId) }
              : v
          ),
        },
      };

    case 'ADD_LESSON':
      return {
        ...state,
        business: {
          ...state.business,
          lessons: [action.lesson, ...state.business.lessons],
        },
      };

    case 'DELETE_LESSON':
      return {
        ...state,
        business: {
          ...state.business,
          lessons: state.business.lessons.filter(l => l.id !== action.id),
        },
      };

    case 'SET_EXAM_DATE':
      return {
        ...state,
        academic: { ...state.academic, examDate: action.date },
      };

    case 'TOGGLE_TOPIC':
      return {
        ...state,
        academic: {
          ...state.academic,
          topics: state.academic.topics.map(t =>
            t.id === action.id ? { ...t, completed: !t.completed } : t
          ),
        },
      };

    case 'UPDATE_TOPIC_NOTES':
      return {
        ...state,
        academic: {
          ...state.academic,
          topics: state.academic.topics.map(t =>
            t.id === action.id ? { ...t, notes: action.notes } : t
          ),
        },
      };

    case 'LOG_SESSION':
      return {
        ...state,
        academic: {
          ...state.academic,
          sessions: [action.session, ...state.academic.sessions],
        },
      };

    case 'DELETE_SESSION':
      return {
        ...state,
        academic: {
          ...state.academic,
          sessions: state.academic.sessions.filter(s => s.id !== action.id),
        },
      };

    case 'ADD_AGENT':
      return {
        ...state,
        ai: { ...state.ai, agents: [...state.ai.agents, migrateAgent(action.agent)] },
      };

    case 'UPDATE_AGENT':
      return {
        ...state,
        ai: {
          ...state.ai,
          agents: state.ai.agents.map(a =>
            a.id === action.agent.id ? migrateAgent(action.agent) : a
          ),
        },
      };

    case 'DELETE_AGENT':
      return {
        ...state,
        ai: { ...state.ai, agents: state.ai.agents.filter(a => a.id !== action.id) },
      };

    case 'LOG_OBSERVATION':
      return {
        ...state,
        ai: {
          ...state.ai,
          observations: [action.observation, ...state.ai.observations],
        },
      };

    case 'DELETE_OBSERVATION':
      return {
        ...state,
        ai: {
          ...state.ai,
          observations: state.ai.observations.filter(o => o.id !== action.id),
        },
      };

    case 'UPDATE_DAILY_NOTE':
      return {
        ...state,
        brain: {
          ...state.brain,
          dailyNotes: { ...state.brain.dailyNotes, [action.date]: action.text },
        },
      };

    case 'ADD_BRAIN_NOTE':
      return {
        ...state,
        brain: {
          ...state.brain,
          notes: [action.note, ...state.brain.notes],
        },
      };

    case 'DELETE_BRAIN_NOTE':
      return {
        ...state,
        brain: {
          ...state.brain,
          notes: state.brain.notes.filter(n => n.id !== action.id),
        },
      };

    case 'ADD_AGENT_TASK':
      return {
        ...state,
        ai: {
          ...state.ai,
          agents: state.ai.agents.map(a =>
            a.id === action.agentId
              ? { ...a, tasks: [...a.tasks, action.task] }
              : a
          ),
        },
      };

    case 'TOGGLE_AGENT_TASK':
      return {
        ...state,
        ai: {
          ...state.ai,
          agents: state.ai.agents.map(a =>
            a.id === action.agentId
              ? {
                  ...a,
                  tasks: a.tasks.map(t =>
                    t.id === action.taskId ? { ...t, done: !t.done } : t
                  ),
                }
              : a
          ),
        },
      };

    case 'DELETE_AGENT_TASK':
      return {
        ...state,
        ai: {
          ...state.ai,
          agents: state.ai.agents.map(a =>
            a.id === action.agentId
              ? { ...a, tasks: a.tasks.filter(t => t.id !== action.taskId) }
              : a
          ),
        },
      };

    case 'ADD_AGENT_LOG':
      return {
        ...state,
        ai: {
          ...state.ai,
          agents: state.ai.agents.map(a =>
            a.id === action.agentId
              ? { ...a, logs: [...a.logs, action.entry] }
              : a
          ),
        },
      };

    case 'DELETE_AGENT_LOG':
      return {
        ...state,
        ai: {
          ...state.ai,
          agents: state.ai.agents.map(a =>
            a.id === action.agentId
              ? { ...a, logs: a.logs.filter(l => l.id !== action.entryId) }
              : a
          ),
        },
      };

    case 'LOAD_STATE':
      return {
        ...action.state,
        ai: {
          ...action.state.ai,
          agents: action.state.ai.agents.map(migrateAgent),
        },
      };

    case 'RESET_STATE':
      return DEFAULT_STATE;

    default:
      return state;
  }
}
