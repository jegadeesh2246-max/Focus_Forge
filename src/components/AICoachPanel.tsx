import { useState } from 'react';
import { Skull, HeartHandshake, Zap, Bot, Flame, History, Award } from 'lucide-react';
import { AICoachMessage } from '../types';

interface AICoachPanelProps {
  userId: string;
  onCoachMessageLogged: (msg: AICoachMessage) => void;
}

export function AICoachPanel({ userId, onCoachMessageLogged }: AICoachPanelProps) {
  const [selectedCoach, setSelectedCoach] = useState<'soft' | 'brutal'>('brutal');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<AICoachMessage[]>([
    {
      coach: 'brutal',
      text: 'Your current discipline rating is 68%. While you scrolling socials looking for perfect lofi beats, your fellow competitors are completing red-black trees in their sleep. Wake up.',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const fetchAICoachAdvice = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, mode: selectedCoach })
      });
      const data = await response.json();
      if (data.success) {
        const text = data.message;
        setMessage(text);
        
        const newMsg: AICoachMessage = {
          coach: selectedCoach,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setHistory(prev => [newMsg, ...prev]);
        onCoachMessageLogged(newMsg);
      }
    } catch (e) {
      console.error('API connection bypassed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            AI Motivation Machine
          </h3>
          <p className="text-xs text-slate-400">Generate real-time personalized feedback designed to crush procrastination.</p>
        </div>
        <Bot className="w-5 h-5 text-amber-500 animate-pulse" />
      </div>

      {/* Select Coach Style Radios */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Brutal Accountability Coach */}
        <button
          id="coach-brutal-btn"
          onClick={() => setSelectedCoach('brutal')}
          className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all duration-150 relative overflow-hidden ${
            selectedCoach === 'brutal'
              ? 'border-rose-500/40 bg-rose-950/20 text-slate-150 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
              : 'border-slate-800 bg-slate-950/45 text-slate-400 hover:text-slate-350 hover:bg-slate-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Skull className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">BRUTAL COACH</span>
          </div>
          <p className="text-[10px] leading-relaxed font-sans text-slate-500">Uncensored engineering reality checks. Roasts your slacking behavior directly.</p>
        </button>

        {/* Soft Motivational Coach */}
        <button
          id="coach-soft-btn"
          onClick={() => setSelectedCoach('soft')}
          className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all duration-150 relative overflow-hidden ${
            selectedCoach === 'soft'
              ? 'border-amber-500/40 bg-amber-950/20 text-slate-150 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
              : 'border-slate-800 bg-slate-950/45 text-slate-400 hover:text-slate-350 hover:bg-slate-950'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">SOFT COACH</span>
          </div>
          <p className="text-[10px] leading-relaxed font-sans text-slate-500">Compassionate mentorship. Focuses on mental rest, recovery, and small wins.</p>
        </button>
      </div>

      {/* Primary Trigger Button */}
      <button
        id="gen-advice-btn"
        onClick={fetchAICoachAdvice}
        disabled={loading}
        className="cursor-pointer w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-amber-500 font-mono font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-40"
      >
        <Zap className="w-3.5 h-3.5 animate-bounce text-amber-400 fill-amber-400" />
        {loading ? 'COMPILING FEEDBACK WAVE...' : 'ANALYZE MY CONTEXT & ADVISE ME'}
      </button>

      {/* Main output box */}
      {(message || loading) && (
        <div className={`mt-5 p-4 rounded-xl border font-mono text-xs ${
          selectedCoach === 'brutal' 
            ? 'bg-rose-950/15 border-rose-500/20 text-rose-350' 
            : 'bg-amber-950/15 border-amber-500/20 text-amber-305'
        }`}>
          {loading ? (
            <div className="space-y-2 py-1">
              <div className="h-3 bg-slate-800 rounded animate-pulse w-full"></div>
              <div className="h-3 bg-slate-800 rounded animate-pulse w-5/6"></div>
              <div className="h-3 bg-slate-800 rounded animate-pulse w-2/3"></div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-mono text-[10px] text-slate-500">
                <span>[AI_COACHING_STREAM_ONLINE]</span>
                <span>Oracle Spark v3.2</span>
              </div>
              <p className="leading-normal font-sans text-slate-200 text-sm">
                "{message}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Coaching log history */}
      {history.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800/60">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase mb-3">
            <History className="w-3.5 h-3.5" /> AUDITED CONTEXT DEBATES:
          </span>
          <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
            {history.map((h, i) => (
              <div key={i} className="bg-slate-950/40 p-3 rounded-lg border border-slate-850 text-[11px]">
                <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                  <span className={`font-bold uppercase ${h.coach === 'brutal' ? 'text-rose-500' : 'text-amber-500'}`}>
                    {h.coach === 'brutal' ? '💀 Brutal Roast-o-matic' : '⭐ Oracle Spark advice'}
                  </span>
                  <span className="text-slate-600">{h.timestamp}</span>
                </div>
                <p className="text-slate-400 font-sans leading-relaxed">"{h.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
