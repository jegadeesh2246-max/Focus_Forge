import { Calendar, Percent, Shield, Star, RefreshCw } from 'lucide-react';
import { DailyActivity } from '../types';

interface HeatmapGraphProps {
  heatmapData: DailyActivity[];
  totalFocusSessions: number;
  completedTasksCount: number;
  pendingTasksCount: number;
  onSync: () => void;
}

export function HeatmapGraph({ heatmapData, totalFocusSessions, completedTasksCount, pendingTasksCount, onSync }: HeatmapGraphProps) {
  // Sort data chronologically
  const sortedData = [...heatmapData].sort((a, b) => a.date.localeCompare(b.date));

  // Determine grid colors based on stats
  const getGridColorClass = (day: DailyActivity) => {
    // If wasted day is simulated
    if (day.score < 30 || day.focusExits >= 4) {
      return 'bg-rose-950/85 border-rose-800/40 hover:border-rose-550 shadow-[inset_0_0_8px_rgba(239,68,68,0.15)]';
    }
    const minutes = day.focusMinutes;
    const completed = day.completedTasks;
    
    if (minutes === 0 && completed === 0) {
      return 'bg-slate-950 border-slate-900 hover:border-slate-800';
    }
    
    const combinedWeight = minutes + completed * 20;
    if (combinedWeight > 80) {
      return 'bg-amber-500 border-amber-400 hover:border-yellow-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
    } else if (combinedWeight > 40) {
      return 'bg-amber-600/70 border-amber-500/30 hover:border-amber-400';
    } else {
      return 'bg-amber-900/60 border-amber-800/35 hover:border-amber-700';
    }
  };

  const calculateFocusAverage = () => {
    if (heatmapData.length === 0) return 0;
    const totalMins = heatmapData.reduce((acc, current) => acc + current.focusMinutes, 0);
    return Math.round(totalMins / heatmapData.length);
  };

  const calculateOverallConsistency = () => {
    if (heatmapData.length === 0) return 0;
    const totalDays = heatmapData.length;
    const productiveDays = heatmapData.filter(d => d.score >= 50 && d.focusMinutes > 0).length;
    return Math.round((productiveDays / totalDays) * 100);
  };

  const averageMinutes = calculateFocusAverage();
  const consistencyRate = calculateOverallConsistency();

  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Discipline Consistency Matrix
          </h3>
          <p className="text-xs text-slate-400">Activity grid of your focus, commits, and procrastination exits over the last 30 days.</p>
        </div>

        <button
          id="sync-heatmap-btn"
          onClick={onSync}
          className="cursor-pointer self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/45 text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-950 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Synchronize Records
        </button>
      </div>

      {/* GitHub Style Contribution board */}
      <div className="mb-6 bg-slate-950/40 border border-slate-850/80 p-4 rounded-xl">
        <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-3">LAST 30 DAYS CONSISTENCY HEATMAP</span>
        
        <div className="flex flex-wrap items-center gap-1.5 justify-start md:justify-between py-1">
          {sortedData.map((day, idx) => {
            const dateObj = new Date(day.date);
            const formattedDate = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
            return (
              <div
                id={`grid-cell-${day.date}`}
                key={day.date}
                className={`w-6 h-6 rounded-md border flex items-center justify-center text-[8px] font-mono hover:scale-110 transition-all cursor-crosshair group/grid ${getGridColorClass(day)}`}
              >
                {/* Micro hovering tooltips explaining metrics details on hover */}
                <div className="absolute font-mono hidden group-hover/item:block group-hover/grid:block bg-slate-950 border border-slate-800 text-[10px] text-slate-300 p-2.5 rounded-lg shadow-xl z-20 pointer-events-none w-44 text-left leading-normal transform translate-y-[-55px]">
                  <p className="font-bold text-amber-500">{formattedDate}</p>
                  <p className="mt-1">Flow Minutes: {day.focusMinutes}m</p>
                  <p>Resolved Commits: {day.completedTasks}</p>
                  <p>Context Exits: {day.focusExits}</p>
                  <p className="text-slate-500 font-bold">Discipline rating: {day.score}%</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>OLDEST</span>
          <div className="flex items-center gap-1.5">
            <span>WASTED / SWITCH ESCAPES</span>
            <span className="w-3 h-3 rounded bg-rose-950 border border-rose-900"></span>
            <span className="w-3 h-3 rounded bg-slate-950 border border-slate-900"></span>
            <span className="w-3 h-3 rounded bg-amber-900 border border-amber-800"></span>
            <span className="w-3 h-3 rounded bg-amber-500 border border-amber-400"></span>
            <span>WARRIOR PEAK</span>
          </div>
          <span>TODAY</span>
        </div>
      </div>

      {/* Analytics Bars and Gauges display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Core Consistency rating gauge */}
        <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Productivity Consistency Rate</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-200">{consistencyRate}%</span>
            <span className="text-xs text-slate-500">days active</span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-3">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${consistencyRate}%` }}></div>
          </div>
        </div>

        {/* Average Focus sessions Duration */}
        <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Average Session Length</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-200">{averageMinutes}</span>
            <span className="text-xs text-slate-500">minutes / day</span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full mt-3">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, Math.floor((averageMinutes / 60) * 100))}%` }}></div>
          </div>
        </div>

        {/* DSA Solved versus backlog ratio */}
        <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">DSA Practice Commits</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-200">{completedTasksCount}</span>
            <span className="text-xs text-slate-500">of {completedTasksCount + pendingTasksCount} completed</span>
          </div>
          {/* Custom micro metric line */}
          <div className="w-full h-1 bg-slate-900 rounded-full mt-3">
            <div 
              className="h-full bg-cyan-500 rounded-full" 
              style={{ width: `${completedTasksCount + pendingTasksCount > 0 ? (completedTasksCount / (completedTasksCount + pendingTasksCount)) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
