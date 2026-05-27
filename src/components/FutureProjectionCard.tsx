import { TrendingUp, TrendingDown, ArrowRight, BrainCircuit, Search, HelpCircle } from 'lucide-react';
import { FutureProjection } from '../types';

interface FutureProjectionCardProps {
  disciplined: FutureProjection;
  procrastinator: FutureProjection;
  currentDisciplineScore: number;
}

export function FutureProjectionCard({ disciplined, procrastinator, currentDisciplineScore }: FutureProjectionCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          Future You Quantum Simulator
        </h3>
        <p className="text-xs text-slate-400">Projections compiled in real-time derived from your cumulative discipline index ({currentDisciplineScore}%).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disciplined Future */}
        <div className="bg-slate-950/60 border border-emerald-500/10 hover:border-emerald-500/25 p-5 rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 filter blur-xl rounded-full"></div>
          <div>
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                PATH A: DELIBERATE DISCIPLINE
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded font-bold">
                RECOMMENDED
              </span>
            </div>

            <div className="text-xs text-slate-400 leading-normal italic mb-5 font-sans">
              "{disciplined.tagline}"
            </div>

            <h4 className="text-sm font-mono font-bold text-emerald-350 tracking-wider uppercase mb-5 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-emerald-400" /> FATE: {disciplined.avatarFate}
            </h4>

            {/* Metrics list */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>DSA PROGRESS ESTIMATE</span>
                  <span className="text-emerald-400 font-bold">{disciplined.dsaProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${disciplined.dsaProgress}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>INTERVIEW READINESS INDEX</span>
                  <span className="text-emerald-400 font-bold">{disciplined.interviewReady}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${disciplined.interviewReady}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>PLACEMENT COCKPIT CONFIDENCE</span>
                  <span className="text-emerald-400 font-bold">{disciplined.confidenceRating}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${disciplined.confidenceRating}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">ESTIMATED CTC PACKAGE:</span>
            <span className="font-bold text-emerald-400 text-sm animate-pulse">{disciplined.expectedPlacementSalary}</span>
          </div>
        </div>

        {/* Procrastinating Future */}
        <div className="bg-slate-950/60 border border-rose-500/10 hover:border-rose-500/25 p-5 rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 filter blur-xl rounded-full"></div>
          <div>
            <div className="flex items-center justify-between border-b border-slate-850 pb-3 mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-450">
                <TrendingDown className="w-4 h-4 text-rose-500 animate-pulse" />
                PATH B: COMFICIENCY PROCRASH
              </span>
              <span className="text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/15 px-2 py-0.5 rounded font-bold animate-pulse">
                HIGH RISK
              </span>
            </div>

            <div className="text-xs text-slate-450 leading-normal italic mb-5 font-sans">
              "{procrastinator.tagline}"
            </div>

            <h4 className="text-sm font-mono font-bold text-rose-450 tracking-wider uppercase mb-5 flex items-center gap-1.5">
              <Search className="w-4 h-4 text-rose-500" /> FATE: {procrastinator.avatarFate}
            </h4>

            {/* Metrics list */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>DSA PROGRESS ESTIMATE</span>
                  <span className="text-rose-450 font-bold">{procrastinator.dsaProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${procrastinator.dsaProgress}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>INTERVIEW READINESS INDEX</span>
                  <span className="text-rose-450 font-bold">{procrastinator.interviewReady}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${procrastinator.interviewReady}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1">
                  <span>PLACEMENT COCKPIT CONFIDENCE</span>
                  <span className="text-rose-450 font-bold">{procrastinator.confidenceRating}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full">
                  <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${procrastinator.confidenceRating}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-500">ESTIMATED CTC PACKAGE:</span>
            <span className="font-bold text-rose-500 text-sm">{procrastinator.expectedPlacementSalary}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
