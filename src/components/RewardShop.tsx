import React, { useState } from 'react';
import { CupSoda, Gamepad, Clapperboard, HelpCircle, Flame, Plus, ShieldCheck, Heart } from 'lucide-react';
import { Reward } from '../types';

interface RewardShopProps {
  rewards: Reward[];
  userXp: number;
  featuredFocusMinutesToday: number;
  onAddReward: (title: string, category: string, costXp: number) => void;
  onRedeemReward: (id: string) => void;
}

export function RewardShop({ rewards, userXp, featuredFocusMinutesToday, onAddReward, onRedeemReward }: RewardShopProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Netflix');
  const [costXp, setCostXp] = useState(150);
  const [showAdd, setShowAdd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [redeemSuccess, setRedeemSuccess] = useState('');

  // Settle categories to matching system graphics icons
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Netflix':
        return <Clapperboard className="w-4 h-4 text-rose-500" />;
      case 'Gaming':
        return <Gamepad className="w-4 h-4 text-indigo-400" />;
      case 'Snacks':
        return <CupSoda className="w-4 h-4 text-amber-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || costXp <= 0) return;
    onAddReward(title, category, costXp);
    setTitle('');
    setShowAdd(false);
  };

  const executeRedeem = (id: string, cost: number) => {
    setErrorMsg('');
    setRedeemSuccess('');

    // Strict validation
    if (featuredFocusMinutesToday < 10) {
      setErrorMsg(`LOCKED: Insufficient daily focus. You need at least 10 focus minutes today to unlock pleasure. (Current: ${featuredFocusMinutesToday} mins).`);
      return;
    }

    if (userXp < cost) {
      setErrorMsg(`LOCKED: Insufficient XP. This pleasure costs ${cost} XP. Go back and resolve LeetCode tasks.`);
      return;
    }

    onRedeemReward(id);
    setRedeemSuccess('PLEASURE UNLOCKED! Enjoy your earned reward without feeling guilty.');
    setTimeout(() => {
      setRedeemSuccess('');
    }, 5000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 shadow-lg relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100">Discipline Reward Shop</h3>
          <p className="text-xs text-slate-400">Convert sweat and code into real-world pleasure.</p>
        </div>
        <button
          id="toggle-add-reward-btn"
          onClick={() => setShowAdd(!showAdd)}
          className="cursor-pointer flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-500 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Define Reward
        </button>
      </div>

      {/* Validation status bar */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider">REDEEM_VALIDATOR_LOCK</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`w-2.5 h-2.5 rounded-full ${featuredFocusMinutesToday >= 10 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`}></span>
            <span className="text-slate-350 font-medium">
              {featuredFocusMinutesToday >= 10 
                ? 'Validator Passed: Rewards unlocked for today!' 
                : 'Locked: Focus at least 10 mins today to unlock.'}
            </span>
          </div>
        </div>
        <div className="text-right sm:text-right font-mono text-[11px] text-slate-400">
          Daily Session: <span className="text-amber-500 font-bold">{featuredFocusMinutesToday} mins</span> / 10m
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-950/40 border border-rose-500/20 text-rose-300 p-3.5 rounded-xl text-xs font-mono mb-4">
          [LOCK_FAILURE]: {errorMsg}
        </div>
      )}

      {redeemSuccess && (
        <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-350 p-3.5 rounded-xl text-xs font-mono mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{redeemSuccess}</span>
        </div>
      )}

      {/* Add Custom Reward Forminline */}
      {showAdd && (
        <form onSubmit={handleCreate} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl mb-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-850">
            <span className="text-xs font-mono text-amber-500 font-bold uppercase">[SCHEDULE_CUSTOM_PLEASURE]</span>
            <button 
              type="button" 
              onClick={() => setShowAdd(false)} 
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Pleasure Title / Activity</label>
            <input
              id="new-reward-title"
              type="text"
              placeholder="e.g. Cheat snack double hamburger with fries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Category type</label>
              <select
                id="new-reward-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="Netflix">Series / Netflix Binge</option>
                <option value="Gaming">Console / Gaming Break</option>
                <option value="Snacks">Cheat Snacks / Coffee</option>
                <option value="Social_Media">Social Scrolling Scroll</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">XP Toll Cost</label>
              <input
                id="new-reward-cost"
                type="number"
                value={costXp}
                onChange={(e) => setCostXp(Math.max(1, Number(e.target.value)))}
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <button
            id="commit-reward-btn"
            type="submit"
            className="w-full cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            WRITE REWARD ROUTINE
          </button>
        </form>
      )}

      {/* Rewards mapping */}
      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {rewards.map((reward) => (
          <div
            id={`reward-item-${reward.id}`}
            key={reward.id}
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-850 bg-slate-950/60 hover:border-slate-800 transition-all duration-150"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-md">
                {getCategoryIcon(reward.category)}
              </div>
              <div className="min-w-0 pr-4">
                <p className="text-sm font-sans tracking-tight leading-snug font-medium text-slate-200 truncate">
                  {reward.title}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-slate-500">
                  <span>UNLOCKED: {reward.redeemedCount} times</span>
                  {reward.lastRedeemedAt && (
                    <>
                      <span>•</span>
                      <span>Last: {new Date(reward.lastRedeemedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              id={`redeem-btn-${reward.id}`}
              onClick={() => executeRedeem(reward.id, reward.costXp)}
              className="cursor-pointer bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 hover:text-amber-400 text-slate-350 px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 animate-pulse fill-rose-500" />
              <span>{reward.costXp} XP</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
