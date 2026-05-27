import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Force load envs
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to protect against crashes when API key is not present on start
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Setup JSON DB Local File
const DB_FILE = path.join(process.cwd(), 'database.json');

// Interface for DB JSON
interface DatabaseSchema {
  users: any[];
  tasks: any[];
  focusSessions: any[];
  rewards: any[];
  achievements: any[];
  dailyActivities: any[];
}

// Initial Seeding data
function getInitialData(): DatabaseSchema {
  const defaultUserId = 'default_user';
  
  // Seed historical heatmap activities for the last 30 days
  const dailyActivities: any[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Seed high/low activity randomly to look natural and beautiful
    const isWasted = i === 1 || i === 5 || i === 12 || i === 17 || i === 22;
    dailyActivities.push({
      date: dateStr,
      completedTasks: isWasted ? 0 : Math.floor(Math.random() * 3) + 1,
      missedTasks: isWasted ? 3 : Math.floor(Math.random() * 2),
      focusMinutes: isWasted ? 0 : Math.floor(Math.random() * 60) + 25,
      focusExits: isWasted ? 5 : Math.floor(Math.random() * 2),
      score: isWasted ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 30) + 70,
    });
  }

  return {
    users: [
      {
        id: defaultUserId,
        username: 'Procrastinator99',
        email: 'student@disciplineos.dev',
        passwordHash: 'survive', // simple for mock fullstack behavior
        avatarLevel: 3,
        avatarXp: 340,
        avatarTitle: 'Bug Spammer',
        avatarTheme: 'neon-amber',
        disciplineScore: 68,
        streak: 4,
        unlockedTracks: ['cyberpunk-pulse', 'rain-cafe']
      }
    ],
    tasks: [
      {
        id: 't1',
        userId: defaultUserId,
        title: 'Reverse a Linked List in place without copying nodes',
        category: 'DSA',
        difficulty: 'Medium',
        status: 'Completed',
        xpReward: 30,
        createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
      },
      {
        id: 't2',
        userId: defaultUserId,
        title: 'Complete mock aptitude quiz: Probability and Time-Space complexity',
        category: 'Aptitude',
        difficulty: 'Medium',
        status: 'Pending',
        xpReward: 35,
        createdAt: new Date().toISOString(),
      },
      {
        id: 't3',
        userId: defaultUserId,
        title: 'Optimise portfolio description and upload PDF parser tags',
        category: 'Resume',
        difficulty: 'Hard',
        status: 'Pending',
        xpReward: 50,
        createdAt: new Date().toISOString(),
      },
      {
        id: 't4',
        userId: defaultUserId,
        title: 'Conduct System Design Mock Interview with Peer',
        category: 'Mock_Interview',
        difficulty: 'Hard',
        status: 'Completed',
        xpReward: 60,
        createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
        completedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
      }
    ],
    focusSessions: [
      {
        id: 'f1',
        userId: defaultUserId,
        durationMinutes: 25,
        completedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        focusExits: 0,
        focusScore: 100,
      },
      {
        id: 'f2',
        userId: defaultUserId,
        durationMinutes: 45,
        completedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        focusExits: 2,
        focusScore: 78,
      }
    ],
    rewards: [
      {
        id: 'r1',
        userId: defaultUserId,
        title: 'Watch 1 episode of Sci-Fi anime on Netflix',
        category: 'Netflix',
        costXp: 150,
        redeemedCount: 1,
        lastRedeemedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
      },
      {
        id: 'r2',
        userId: defaultUserId,
        title: 'Play 30 minutes of Cyberpunk RPG',
        category: 'Gaming',
        costXp: 200,
        redeemedCount: 0,
      },
      {
        id: 'r3',
        userId: defaultUserId,
        title: 'Grab double-shot iced espresso with a donut',
        category: 'Snacks',
        costXp: 100,
        redeemedCount: 3,
        lastRedeemedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      }
    ],
    achievements: [
      {
        id: 'a1',
        userId: defaultUserId,
        title: 'Dawn of Focus',
        description: 'Complete a continuous 25-minute Pomodoro session with zero task exits.',
        badge: 'Zap',
        unlockedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      },
      {
        id: 'a2',
        userId: defaultUserId,
        title: 'Recruiter Bait',
        description: 'Complete 5 resume-related enhancement actions.',
        badge: 'Award',
        unlockedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      }
    ],
    dailyActivities
  };
}

// Load DB helper
function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading DB, re-seeding default data', err);
  }
  const init = getInitialData();
  saveDB(init);
  return init;
}

// Save DB helper
function saveDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file', err);
  }
}

// Level Up boundaries - 200 XP per level
function calculateLevel(xp: number): { level: number; remainderXp: number; nextLevelXp: number } {
  const level = Math.floor(xp / 200) + 1;
  const remainderXp = xp % 200;
  return {
    level,
    remainderXp,
    nextLevelXp: 200,
  };
}

// Helper titles
const LEVEL_TITLES = [
  'Slacker Default', 
  'Semi-Focused Novice', 
  'Compiling Adventurer', 
  'Priority Queue Zealot',
  'Garbage Collector Extraordinaire',
  'Thread Synchroniser',
  'Distributed System Wizard',
  'Discipline Emperor'
];

function getTitleForLevel(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)] || 'Unstoppable Machine';
}

// --- API ENDPOINTS ---

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = loadDB();
  const user = db.users.find(u => u.email === email && u.passwordHash === password);
  if (user) {
    res.json({ success: true, user });
  } else {
    // Also try checking by username
    const userByUsername = db.users.find(u => u.username === email && u.passwordHash === password);
    if (userByUsername) {
      res.json({ success: true, user: userByUsername });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials. Try guest username/password: Procrastinator99 / survive' });
    }
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  const db = loadDB();
  if (db.users.some(u => u.email === email || u.username === username)) {
    return res.status(400).json({ success: false, message: 'Account exists with this username/email' });
  }
  const newUser = {
    id: 'user_' + Date.now(),
    username,
    email,
    passwordHash: password,
    avatarLevel: 1,
    avatarXp: 0,
    avatarTitle: 'Slacker Default',
    avatarTheme: 'cyber-emerald',
    disciplineScore: 50,
    streak: 0,
    unlockedTracks: ['cyberpunk-pulse']
  };
  db.users.push(newUser);
  saveDB(db);
  res.json({ success: true, user: newUser });
});

// Profile status check
app.get('/api/user/profile/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user });
});

// Update Theme / settings
app.post('/api/user/theme', (req, res) => {
  const { userId, theme } = req.body;
  const db = loadDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ success: false });

  db.users[userIndex].avatarTheme = theme;
  saveDB(db);
  res.json({ success: true, user: db.users[userIndex] });
});

// Tasks CRUD
app.get('/api/tasks/:userId', (req, res) => {
  const db = loadDB();
  const userTasks = db.tasks.filter(t => t.userId === req.params.userId);
  res.json({ success: true, tasks: userTasks });
});

app.post('/api/tasks', (req, res) => {
  const { userId, title, category, difficulty } = req.body;
  if (!userId || !title || !category || !difficulty) {
    return res.status(400).json({ success: false, message: 'Fields missing' });
  }
  const db = loadDB();
  
  // Calculate XP bounty based on difficulty
  let xpReward = 15;
  if (difficulty === 'Medium') xpReward = 30;
  if (difficulty === 'Hard') xpReward = 50;

  const newTask = {
    id: 'task_' + Date.now(),
    userId,
    title,
    category,
    difficulty,
    status: 'Pending',
    xpReward,
    createdAt: new Date().toISOString(),
  };

  db.tasks.push(newTask);
  
  // Discipline score impact (slight reduction for creating a task to motivate completion, 
  // or simple update)
  saveDB(db);
  res.json({ success: true, task: newTask });
});

app.post('/api/tasks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const taskIndex = db.tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ success: false, message: 'Task not found' });

  const task = db.tasks[taskIndex];
  const userIndex = db.users.findIndex(u => u.id === task.userId);
  if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });

  const user = db.users[userIndex];
  const oldStatus = task.status;
  const newStatus = oldStatus === 'Completed' ? 'Pending' : 'Completed';
  task.status = newStatus;
  
  if (newStatus === 'Completed') {
    task.completedAt = new Date().toISOString();
    
    // Level up reward XP
    user.avatarXp += task.xpReward;
    
    // Discipline bonus
    user.disciplineScore = Math.min(100, user.disciplineScore + 5);
    user.streak += 1;
    
    // Check level up
    const { level, remainderXp } = calculateLevel(user.avatarXp);
    if (level !== user.avatarLevel) {
      user.avatarLevel = level;
      user.avatarTitle = getTitleForLevel(level);
      // Unlock bonus audio track
      if (level === 2 && !user.unlockedTracks.includes('rain-cafe')) {
        user.unlockedTracks.push('rain-cafe');
      }
      if (level === 4 && !user.unlockedTracks.includes('lofi-synthetics')) {
        user.unlockedTracks.push('lofi-synthetics');
      }
    }

    // Add activity to heatmap/contribution system
    const todayStr = new Date().toISOString().split('T')[0];
    let dailyIndex = db.dailyActivities.findIndex(a => a.date === todayStr);
    if (dailyIndex === -1) {
      db.dailyActivities.push({
        date: todayStr,
        completedTasks: 1,
        missedTasks: 0,
        focusMinutes: 0,
        focusExits: 0,
        score: user.disciplineScore,
      });
    } else {
      db.dailyActivities[dailyIndex].completedTasks += 1;
      db.dailyActivities[dailyIndex].score = user.disciplineScore;
    }
  } else {
    // Reverted to Pending
    delete task.completedAt;
    user.avatarXp = Math.max(0, user.avatarXp - task.xpReward);
    user.disciplineScore = Math.max(0, user.disciplineScore - 5);
    user.streak = Math.max(0, user.streak - 1);
    
    const { level } = calculateLevel(user.avatarXp);
    user.avatarLevel = level;
    user.avatarTitle = getTitleForLevel(level);

    // Heatmap update
    const todayStr = new Date().toISOString().split('T')[0];
    let dailyIndex = db.dailyActivities.findIndex(a => a.date === todayStr);
    if (dailyIndex !== -1) {
      db.dailyActivities[dailyIndex].completedTasks = Math.max(0, db.dailyActivities[dailyIndex].completedTasks - 1);
      db.dailyActivities[dailyIndex].score = user.disciplineScore;
    }
  }

  saveDB(db);
  res.json({ success: true, task, user });
});

app.delete('/api/tasks/:id', (req, res) => {
  const db = loadDB();
  const id = req.params.id;
  
  const taskIndex = db.tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    const task = db.tasks[taskIndex];
    
    // Penalize score slightly for deleting tasks (skipping)
    const userIndex = db.users.findIndex(u => u.id === task.userId);
    if (userIndex !== -1) {
      db.users[userIndex].disciplineScore = Math.max(0, db.users[userIndex].disciplineScore - 3);
    }
    
    db.tasks.splice(taskIndex, 1);
    saveDB(db);
    res.json({ success: true, message: 'Task deleted, discipline penalty updated.' });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

// Focus Sessions log
app.get('/api/focus/:userId', (req, res) => {
  const db = loadDB();
  const sessions = db.focusSessions.filter(s => s.userId === req.params.userId);
  res.json({ success: true, sessions });
});

app.post('/api/focus', (req, res) => {
  const { userId, durationMinutes, focusExits } = req.body;
  if (!userId || durationMinutes === undefined) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  const db = loadDB();
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });
  
  const user = db.users[userIndex];
  
  // Calculate focus score
  // Ideal: 0 exits. Every exit penalises score based on length
  const penalty = focusExits * 15;
  const focusScore = Math.max(10, 100 - penalty);
  
  // XP Calculation: 2 XP per minute focused * focusScore multiplier
  const xpAward = Math.floor(durationMinutes * 1.5 * (focusScore / 100));
  
  const newSession = {
    id: 'focus_' + Date.now(),
    userId,
    durationMinutes,
    completedAt: new Date().toISOString(),
    focusExits,
    focusScore,
  };
  
  db.focusSessions.push(newSession);
  
  // Update User state
  user.avatarXp += xpAward;
  
  // If focusScore is high, gain discipline. If many exits, lose discipline!
  if (focusScore >= 80) {
    user.disciplineScore = Math.min(100, user.disciplineScore + 6);
  } else {
    // Poor session under repeated exits! Anti-procrastination warnings triggered
    user.disciplineScore = Math.max(10, user.disciplineScore - 8);
  }
  
  // Recalculate level
  const { level } = calculateLevel(user.avatarXp);
  if (level !== user.avatarLevel) {
    user.avatarLevel = level;
    user.avatarTitle = getTitleForLevel(level);
  }
  
  // Daily activity update
  const todayStr = new Date().toISOString().split('T')[0];
  let dailyIndex = db.dailyActivities.findIndex(a => a.date === todayStr);
  if (dailyIndex === -1) {
    db.dailyActivities.push({
      date: todayStr,
      completedTasks: 0,
      missedTasks: 0,
      focusMinutes: durationMinutes,
      focusExits,
      score: user.disciplineScore,
    });
  } else {
    db.dailyActivities[dailyIndex].focusMinutes += durationMinutes;
    db.dailyActivities[dailyIndex].focusExits += focusExits;
    db.dailyActivities[dailyIndex].score = user.disciplineScore;
  }
  
  // Check focus achievements
  if (durationMinutes >= 25 && focusExits === 0) {
    const achMatch = db.achievements.find(a => a.userId === userId && a.title === 'Zen Master');
    if (!achMatch) {
      db.achievements.push({
        id: 'ach_' + Date.now(),
        userId,
        title: 'Zen Master',
        description: 'Complete a full length focus session with absolute zero context switches.',
        badge: 'Award',
        unlockedAt: new Date().toISOString()
      });
    }
  }

  saveDB(db);
  res.json({ success: true, session: newSession, user });
});

// Reward Marketplace
app.get('/api/rewards/:userId', (req, res) => {
  const db = loadDB();
  const userRewards = db.rewards.filter(r => r.userId === req.params.userId);
  res.json({ success: true, rewards: userRewards });
});

app.post('/api/rewards', (req, res) => {
  const { userId, title, category, costXp } = req.body;
  if (!userId || !title || !category || !costXp) {
    return res.status(400).json({ success: false, message: 'Missing reward items.' });
  }
  const db = loadDB();
  const newReward = {
    id: 'reward_' + Date.now(),
    userId,
    title,
    category,
    costXp: Number(costXp),
    redeemedCount: 0,
  };
  db.rewards.push(newReward);
  saveDB(db);
  res.json({ success: true, reward: newReward });
});

// Redeem Reward
app.post('/api/rewards/:id/redeem', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const db = loadDB();
  
  const rewIndex = db.rewards.findIndex(r => r.id === id);
  if (rewIndex === -1) return res.status(404).json({ success: false, message: 'Reward not found' });
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) return res.status(404).json({ success: false, message: 'User not found' });
  
  const reward = db.rewards[rewIndex];
  const user = db.users[userIndex];
  
  // Verification: Users can only unlock rewards after completing at least 1 focus session today OR having high discipline
  const todayStr = new Date().toISOString().split('T')[0];
  const focusToday = db.dailyActivities.find(a => a.date === todayStr)?.focusMinutes || 0;
  
  if (focusToday < 10) {
    return res.status(403).json({
      success: false,
      message: 'LOCKED! You need a minimum of 10 focused flow minutes today to redeem real rewards. Stop slacking.'
    });
  }

  if (user.avatarXp < reward.costXp) {
    return res.status(400).json({
      success: false, 
      message: `UNSUFFICIENT XP. This pleasure costs ${reward.costXp} XP, but you only have ${user.avatarXp} XP. Back to work.`
    });
  }

  // Deduct XP and complete purchase
  user.avatarXp -= reward.costXp;
  reward.redeemedCount += 1;
  reward.lastRedeemedAt = new Date().toISOString();
  
  // Ensure level remains safe
  const { level } = calculateLevel(user.avatarXp);
  user.avatarLevel = level;
  user.avatarTitle = getTitleForLevel(level);

  saveDB(db);
  res.json({ success: true, reward, user });
});

// Analytics Dashboard & Heatmap
// Analytics Dashboard & Heatmap
app.get('/api/analytics/:userId', (req, res) => {
  const db = loadDB();
  const userId = req.params.userId;

  // Get current user
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // User-specific records
  const focus = db.focusSessions.filter(s => s.userId === userId);
  const tasks = db.tasks.filter(t => t.userId === userId);
  const achievements = db.achievements.filter(a => a.userId === userId);

  const totalFocusMinutes = focus.reduce(
    (acc, current) => acc + current.durationMinutes,
    0
  );

  const totalFocusSessions = focus.length;

  const completedTasksCount = tasks.filter(
    t => t.status === 'Completed'
  ).length;

  const pendingTasksCount = tasks.filter(
    t => t.status === 'Pending'
  ).length;

  // =========================================
  // NEW USER VS EXISTING USER LOGIC
  // =========================================

  // Define who is a "new user"
  const isNewUser =
    totalFocusSessions === 0 &&
    completedTasksCount === 0;

  let generatedHeatmap: any[] = [];

  const now = new Date();

  // NEW USER → SHOW NEXT 30 DAYS
  if (isNewUser) {
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);

      generatedHeatmap.push({
        date: d.toISOString().split('T')[0],
        completedTasks: 0,
        missedTasks: 0,
        focusMinutes: 0,
        focusExits: 0,
        score: 0,
      });
    }
  }

  // EXISTING USER → SHOW LAST 30 DAYS
  else {
    generatedHeatmap = [...db.dailyActivities]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);
  }

  res.json({
    success: true,
    totalFocusMinutes,
    totalFocusSessions,
    completedTasksCount,
    pendingTasksCount,
    achievements,
    heatmap: generatedHeatmap
  });
});