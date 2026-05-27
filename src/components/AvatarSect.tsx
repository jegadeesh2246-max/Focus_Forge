import { Flame, Medal, Palette, Award, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface AvatarSectProps {
  user: User;
  onThemeChange: (theme: string) => void;
}

export function AvatarSect({ user, onThemeChange }: AvatarSectProps) {
  // Theme styling definitions
  const themes = [
    { id: 'neon-amber', name: 'Amber Core (Default)', bg: 'bg-amber-500', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]', border: 'border-amber-500/20', text: 'text-amber-400' },
    { id: 'cyber-emerald', name: 'Emerald Matrix', bg: 'bg-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { id: 'quantum-ruby', name: 'Ruby Core Reactor', bg: 'bg-rose-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]', border: 'border-rose-500/20', text: 'text-rose-400' },
    { id: 'void-indigo', name: 'Indigo Void Void', bg: 'bg-indigo-500', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.5)]', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  ];

  const currentTheme = themes.find(t => t.id === user.avatarTheme) || themes[0];

  // Calculate XP ratio
  const remainderXp = user.avatarXp % 200;
  const xpPercentage = Math.min(100, Math.floor((remainderXp / 200) * 100));

  // Determine avatar icon class based on score
  const score = user.disciplineScore;
  let statusText = 'Stable Focused';
  let statusColor = 'text-emerald-400';
  if (score < 40) {
    statusText = 'CRITICAL DECAY';
    statusColor = 'text-rose-500 animate-pulse';
  } else if (score < 70) {
    statusText = 'OS FLICKERING';
    statusColor = 'text-amber-400';
  }

  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden shadow-lg group">
      {/* Visual background indicator */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-2xl opacity-10 bg-gradient-to-br from-indigo-500 to-amber-500`}></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left avatar details */}
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* Round Avatar visual */}
            <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border font-mono font-bold text-2xl relative ${currentTheme.border} ${currentTheme.glow} bg-slate-950`}>
              <span className={currentTheme.text}>{user.avatarLevel}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest leading-none mt-0.5">LVL</span>
            </div>
            {/* Streak count indicator icon */}
            {user.streak > 0 && (
              <div className="absolute -top-2.5 -right-2.5 bg-orange-600 text-slate-100 rounded-full px-1.5 py-0.5 flex items-center gap-0.5 text-[10px] font-bold shadow-md animate-bounce">
                <Flame className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                <span>{user.streak}d</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">DISCIPLINE AVATAR</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border border-slate-800 bg-slate-950 font-bold ${statusColor}`}>
                {statusText}
              </span>
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-150 tracking-tight">{user.username}</h3>
            <p className="text-xs text-amber-500 font-mono flex items-center gap-1.5 mt-0.5">
              <Medal className="w-3.5 h-3.5 text-amber-500" /> {user.avatarTitle}
            </p>
          </div>
        </div>

        {/* Right quick specs */}
        <div className="grid grid-cols-2 gap-4 max-w-xs w-full sm:w-auto">
          {/* Discipline Score Indicator */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center sm:text-left min-w-[120px]">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Discipline Index</span>
            <div className="flex items-baseline justify-center sm:justify-start gap-1 mt-1">
              <span className={`text-2xl font-bold font-mono tracking-tight ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-amber-400' : 'text-rose-500'}`}>
                {score}
              </span>
              <span className="text-xs text-slate-500 font-mono">/100</span>
            </div>
            {score < 40 && (
              <span className="text-[9px] text-rose-500 flex items-center gap-0.5 justify-center sm:justify-start mt-0.5 font-mono animate-pulse">
                <ShieldAlert className="w-2.5 h-2.5" /> DECREASE WARNING
              </span>
            )}
          </div>

          {/* XP Summary */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-center sm:text-left min-w-[120px]">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">Total Experience</span>
            <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-2xl font-bold text-slate-300 font-mono tracking-tight">{user.avatarXp}</span>
              <span className="text-xs text-slate-500 font-mono">XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress slider bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-mono text-slate-500 mb-1.5">
          <span>XP TRANSGRESSION BAR</span>
          <span>{remainderXp} / 200 XP ({xpPercentage}%)</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[1.5px]">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${currentTheme.bg}`}
            style={{ width: `${xpPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Theme selection Customizer */}
      <div className="mt-6 pt-5 border-t border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-mono text-slate-400">SELECT OSCILLOSPACE THEME:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {themes.map(t => (
            <button
              id={`theme-btn-${t.id}`}
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-150 flex items-center gap-2 ${
                user.avatarTheme === t.id 
                  ? `${t.border} bg-slate-950 text-slate-200 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.1)]`
                  : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-300 hover:bg-slate-950 hover:border-slate-700'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${t.bg}`}></span>
              <span>{t.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
