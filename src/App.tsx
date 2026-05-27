import { useState, useEffect, useCallback } from 'react';
import { LogOut, Bot, Sparkles, Compass, ShieldCheck, Heart, Zap, Award } from 'lucide-react';
import { User, Task, FocusSession, Reward, Achievement, DailyActivity, FutureProjection, AICoachMessage } from './types';

// Importing Custom Panels
import { AuthCard } from './components/AuthCard';
import { AvatarSect } from './components/AvatarSect';
import { TrackerSect } from './components/TrackerSect';
import { FocusTimer } from './components/FocusTimer';
import { RewardShop } from './components/RewardShop';
import { FutureProjectionCard } from './components/FutureProjectionCard';
import { HeatmapGraph } from './components/HeatmapGraph';
import { AICoachPanel } from './components/AICoachPanel';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [analytics, setAnalytics] = useState<{
    completedTasksCount: number;
    pendingTasksCount: number;
    heatmap: DailyActivity[];
  } | null>(null);

  const [projections, setProjections] = useState<{
    disciplined: FutureProjection;
    procrastinator: FutureProjection;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'cockpit' | 'simulation' | 'intelligence'>('cockpit');

  // Load profile state from local session storage on boot (offline convenient sync)
  useEffect(() => {
    const cachedUser = sessionStorage.getItem('disciplineOS_user');
    if (cachedUser) {
      try {
        const u = JSON.parse(cachedUser);
        setCurrentUser(u);
      } catch (e) {}
    }
  }, []);

  // Main data synchronization pipeline
  const synchronizeDatabase = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      // Fetch Tasks
      const tasksRes = await fetch(`/api/tasks/${userId}`);
      const tasksData = await tasksRes.json();
      if (tasksData.success) setTasks(tasksData.tasks);

      // Fetch Focus index
      const focusRes = await fetch(`/api/focus/${userId}`);
      const focusData = await focusRes.json();
      if (focusData.success) setFocusSessions(focusData.sessions);

      // Fetch Reward listings
      const rewRes = await fetch(`/api/rewards/${userId}`);
      const rewData = await rewRes.json();
      if (rewData.success) setRewards(rewData.rewards);

      // Fetch Heatmap Grid analytics
      const analRes = await fetch(`/api/analytics/${userId}`);
      const analData = await analRes.json();
      if (analData.success) {
        setAnalytics({
          completedTasksCount: analData.completedTasksCount,
          pendingTasksCount: analData.pendingTasksCount,
          heatmap: analData.heatmap
        });
      }

      // Fetch Future outcome projection simulations
      const projRes = await fetch(`/api/projections/${userId}`);
      const projData = await projRes.json();
      if (projData.success) {
        setProjections({
          disciplined: projData.disciplined,
          procrastinator: projData.procrastinator
        });
      }

      // Live update user state
      const userRes = await fetch(`/api/user/profile/${userId}`);
      const userData = await userRes.json();
      if (userData.success) {
        setCurrentUser(userData.user);
        sessionStorage.setItem('disciplineOS_user', JSON.stringify(userData.user));
      }
    } catch (err) {
      console.error('Failure connecting to Express backend during data sync', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Synchronize immediately on user login
  useEffect(() => {
    if (currentUser?.id) {
      synchronizeDatabase(currentUser.id);
    }
  }, [currentUser?.id, synchronizeDatabase]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('disciplineOS_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('disciplineOS_user');
    setTasks([]);
    setFocusSessions([]);
    setRewards([]);
    setAnalytics(null);
    setProjections(null);
  };

  // Theme styling helpers mapping Theme ID to CSS class
  const getThemeHighlight = (usr: User | null) => {
    if (!usr) return { text: 'text-amber-500', glow: 'shadow-amber-500/25', border: 'border-amber-500/20', bg: 'bg-amber-500/10' };
    switch (usr.avatarTheme) {
      case 'cyber-emerald':
        return { text: 'text-emerald-400', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' };
      case 'quantum-ruby':
        return { text: 'text-rose-400', glow: 'shadow-rose-105-cyan/20', border: 'border-rose-500/20', bg: 'bg-rose-500/5' };
      case 'void-indigo':
        return { text: 'text-indigo-400', glow: 'shadow-indigo-500/20', border: 'border-indigo-500/20', bg: 'bg-indigo-500/5' };
      default:
        return { text: 'text-amber-400', glow: 'shadow-amber-500/20', border: 'border-amber-500/20', bg: 'bg-amber-500/5' };
    }
  };

  const themeClasses = getThemeHighlight(currentUser);

  // --- ACTIONS WRAPPER ---

  const handleAddTask = async (title: string, category: string, difficulty: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, title, category, difficulty }),
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  const handleToggleTask = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/tasks/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  const handleDeleteTask = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  const handleThemeChange = async (theme: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/user/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, theme })
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        sessionStorage.setItem('disciplineOS_user', JSON.stringify(data.user));
      }
    } catch (e) {}
  };

  const handleFocusComplete = async (durationMinutes: number, focusExits: number) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, durationMinutes, focusExits }),
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  const handleAddReward = async (title: string, category: string, costXp: number) => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id, title, category, costXp }),
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  const handleRedeemReward = async (id: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(`/api/rewards/${id}/redeem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  // Reset/restore seeded default data for visualization
  const handleResetData = async () => {
    if (!currentUser) return;
    try {
      const response = await fetch('/api/user/reset', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        synchronizeDatabase(currentUser.id);
      }
    } catch (e) {}
  };

  // Calculate focus minutes today helper
  const getFocusMinutesToday = () => {
    if (!analytics || !analytics.heatmap) return 0;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAct = analytics.heatmap.find(a => a.date === todayStr);
    return todayAct ? todayAct.focusMinutes : 0;
  };

  const focusMinutesToday = getFocusMinutesToday();

  // If user is not authenticated, draw the login register card centering
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
        
        <AuthCard onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-to-br from-indigo-500/5 to-amber-500/5 rounded-full filter blur-3xl opacity-30 pointer-events-none"></div>

      {/* Primary Header Toolbar */}
      <header className="border-b border-slate-900 bg-slate-950 bg-opacity-80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          
          {/* Logo brand and metadata */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${themeClasses.bg} border ${themeClasses.border} flex items-center justify-center`}>
              <Compass className={`w-4 h-4 ${themeClasses.text}`} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                Discipline<span className={themeClasses.text}>OS</span>
              </h1>
              <span className="text-[9px] font-mono text-slate-500 block leading-none select-none">
                SYSTEM CONSOLE • HIGH INTENSITY COCKPIT
              </span>
            </div>
          </div>

          {/* Tab Navigation header */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-850 rounded-xl">
            {[
              { id: 'cockpit', label: 'Discipline Dashboard' },
              { id: 'simulation', label: 'Future Simulator' },
              { id: 'intelligence', label: 'Coaching Intelligence' }
            ].map(tab => (
              <button
                id={`tab-btn-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'cockpit' | 'simulation' | 'intelligence')}
                className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all font-semibold ${
                  activeTab === tab.id
                    ? `${themeClasses.bg} ${themeClasses.text} border ${themeClasses.border}`
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick status specs & exit triggers */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 text-[10px] font-mono px-2.5 py-1 rounded-lg text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              CORE CONNECTED
            </span>
            
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="cursor-pointer flex items-center gap-1 bg-slate-950 hover:bg-slate-900/80 border border-slate-850 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg px-3 py-1.5 text-xs font-mono transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container contents area */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-6">
        
        {/* Sync spinner overlay loading overlay */}
        {loading && (
          <div className="bg-slate-950/60 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center text-xs font-mono text-amber-500 gap-2">
            <span className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
            <span>SYSTEM CONSOLE RE-SYNCHRONIZING...</span>
          </div>
        )}

        {/* Level, title and Customizer profile status header */}
        <AvatarSect user={currentUser} onThemeChange={handleThemeChange} />

        {/* Tab switcher navigation bar for tiny viewports */}
        <div className="md:hidden flex items-center justify-between p-1 bg-slate-950 border border-slate-850 rounded-xl">
          {[
            { id: 'cockpit', label: 'Cockpit' },
            { id: 'simulation', label: 'Simulation' },
            { id: 'intelligence', label: 'AI Coach' }
          ].map(tab => (
            <button
              id={`tab-btn-mobile-${tab.id}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'cockpit' | 'simulation' | 'intelligence')}
              className={`cursor-pointer flex-1 py-2 text-center rounded-lg text-xs font-mono transition-all font-semibold ${
                activeTab === tab.id
                  ? `${themeClasses.bg} ${themeClasses.text} border ${themeClasses.border}`
                  : 'text-slate-500 hover:text-slate-350'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Inner Content panels according to selected tabs */}
        <div className="space-y-6">
          {activeTab === 'cockpit' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Focus and Task queue list inside left/center area */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Custom focus timer cockpit */}
                <FocusTimer 
                  onSessionComplete={handleFocusComplete} 
                  unlockedTracks={currentUser.unlockedTracks} 
                />

                {/* Tracking checklist modules */}
                <TrackerSect 
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />

                {/* Consistency github metrics matrix */}
                {analytics && (
                  <HeatmapGraph 
                    heatmapData={analytics.heatmap}
                    totalFocusSessions={focusSessions.length}
                    completedTasksCount={analytics.completedTasksCount}
                    pendingTasksCount={analytics.pendingTasksCount}
                    onSync={() => synchronizeDatabase(currentUser.id)}
                  />
                )}
              </div>

              {/* Reward Shop and Custom message feed in RHS column split */}
              <div className="space-y-6">
                <RewardShop 
                  rewards={rewards}
                  userXp={currentUser.avatarXp}
                  featuredFocusMinutesToday={focusMinutesToday}
                  onAddReward={handleAddReward}
                  onRedeemReward={handleRedeemReward}
                />

                <AICoachPanel 
                  userId={currentUser.id} 
                  onCoachMessageLogged={() => synchronizeDatabase(currentUser.id)} 
                />
              </div>
            </div>
          )}

          {activeTab === 'simulation' && projections && (
            <FutureProjectionCard 
              disciplined={projections.disciplined}
              procrastinator={projections.procrastinator}
              currentDisciplineScore={currentUser.disciplineScore}
            />
          )}

          {activeTab === 'intelligence' && (
            <div className="max-w-2xl mx-auto">
              <AICoachPanel 
                userId={currentUser.id} 
                onCoachMessageLogged={() => synchronizeDatabase(currentUser.id)} 
              />
            </div>
          )}
        </div>
      </main>

      {/* Sticky footer for informational credentials and developer testing reset */}
      <footer className="border-t border-slate-900 bg-slate-950 p-6 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="font-bold flex items-center gap-1.5 text-slate-400">
              <Bot className="w-4 h-4 text-amber-500" /> DisciplineOS Infiltration Stack
            </p>
            <p className="mt-1">
              Active full-stack environment. Interactive browser countdown timers utilize page visibility hooks.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button
              id="reset-raw-db-btn"
              onClick={handleResetData}
              className="cursor-pointer text-slate-400 hover:text-amber-500 border border-slate-800 hover:border-slate-700 bg-slate-950/60 px-3 py-1.5 rounded-lg transition-colors"
              title="Restores default database entries including populated 30-day grids"
            >
              🔄 Restorave Seeding Defaults
            </button>
            <span>•</span>
            <span>Local Time Clock active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
