export interface User {
  id: string;
  username: string;
  email: string;
  avatarLevel: number;
  avatarXp: number;
  avatarTitle: string;
  avatarTheme: string; // 'neon-amber' | 'cyber-emerald' | 'quantum-ruby' | 'void-indigo'
  disciplineScore: number; // 0 to 100
  streak: number;
  unlockedTracks: string[]; // Focus music soundtracks, etc.
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  category: 'DSA' | 'Aptitude' | 'Resume' | 'Mock_Interview' | 'General';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Pending' | 'Completed';
  xpReward: number;
  createdAt: string;
  completedAt?: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  durationMinutes: number;
  completedAt: string;
  focusExits: number; // For anti-procrastination exit detection
  focusScore: number; // Computed score based on duration & exits
}

export interface Reward {
  id: string;
  userId: string;
  title: string;
  category: 'Netflix' | 'Gaming' | 'Snacks' | 'Social_Media' | 'Custom';
  costXp: number;
  redeemedCount: number;
  lastRedeemedAt?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  badge: string; // Icon name/string
  unlockedAt: string;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  completedTasks: number;
  missedTasks: number;
  focusMinutes: number;
  focusExits: number;
  score: number; // Discipline score calculated for the day
}

export interface FutureProjection {
  scenario: 'disciplined' | 'proc_status';
  dsaProgress: number; // Percentage
  interviewReady: number; // Percentage
  expectedPlacementSalary: string; // Salary package estimate
  confidenceRating: number; // Percentage
  avatarFate: string; // Visual outcome title
  tagline: string;
}

export interface AICoachMessage {
  coach: 'soft' | 'brutal';
  text: string;
  timestamp: string;
}
