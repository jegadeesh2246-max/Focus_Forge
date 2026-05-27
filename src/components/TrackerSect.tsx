import React, { useState } from 'react';
import { Plus, Trash, CheckSquare, Square, ChevronRight, FileCode, Brain, FileText, Users, Bookmark } from 'lucide-react';
import { Task } from '../types';

interface TrackerSectProps {
  tasks: Task[];
  onAddTask: (title: string, category: string, difficulty: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TrackerSect({ tasks, onAddTask, onToggleTask, onDeleteTask }: TrackerSectProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Medium');
  const [showAddForm, setShowAddForm] = useState(false);

  // Statistics calculation for tasks
  const solvedDsa = tasks.filter(t => t.category === 'DSA' && t.status === 'Completed').length;
  const dsaTotal = tasks.filter(t => t.category === 'DSA').length;

  const solvedApt = tasks.filter(t => t.category === 'Aptitude' && t.status === 'Completed').length;
  const aptTotal = tasks.filter(t => t.category === 'Aptitude').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title, category, difficulty);
    setTitle('');
    setShowAddForm(false);
  };

  // Maps category to styling and icon helper
  const getCategoryTheme = (cat: string) => {
    switch (cat) {
      case 'DSA':
        return { label: 'DSA Track', color: 'text-amber-400 bg-amber-400/10 border-amber-500/20', icon: <FileCode className="w-3.5 h-3.5" /> };
      case 'Aptitude':
        return { label: 'Aptitude', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20', icon: <Brain className="w-3.5 h-3.5" /> };
      case 'Resume':
        return { label: 'Resume Prep', color: 'text-pink-400 bg-pink-400/10 border-pink-500/20', icon: <FileText className="w-3.5 h-3.5" /> };
      case 'Mock_Interview':
        return { label: 'Mock Session', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-500/20', icon: <Users className="w-3.5 h-3.5" /> };
      default:
        return { label: 'General', color: 'text-slate-400 bg-slate-400/10 border-slate-500/20', icon: <Bookmark className="w-3.5 h-3.5" /> };
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'Hard': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            Placement Prep Trackers
          </h3>
          <p className="text-xs text-slate-400">Record DSA, Aptitude, Resume, and Mock Interview drills.</p>
        </div>
        <button
          id="toggle-add-task-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="cursor-pointer flex items-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-amber-500 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      </div>

      {/* Target Progress Quick Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3">
          <span className="block text-[10px] font-mono text-slate-500 uppercase">DSA SOLVED</span>
          <span className="text-lg font-bold text-slate-200 mt-1 block">
            {solvedDsa} <span className="text-xs text-slate-500">/ {dsaTotal}</span>
          </span>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3">
          <span className="block text-[10px] font-mono text-slate-500 uppercase">APTITUDE REVISED</span>
          <span className="text-lg font-bold text-slate-200 mt-1 block">
            {solvedApt} <span className="text-xs text-slate-500">/ {aptTotal}</span>
          </span>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 font-mono">
          <span className="block text-[10px] text-slate-500 uppercase">RESUME TASK</span>
          <span className="text-xs text-slate-350 block mt-1 leading-normal font-sans">
            {tasks.filter(t => t.category === 'Resume' && t.status === 'Completed').length} resolved
          </span>
        </div>
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 font-mono">
          <span className="block text-[10px] text-slate-500 uppercase">PEER MOCKS</span>
          <span className="text-xs text-slate-350 block mt-1 leading-normal font-sans">
            {tasks.filter(t => t.category === 'Mock_Interview' && t.status === 'Completed').length} done
          </span>
        </div>
      </div>

      {/* Task Creation Form inline */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl mb-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs font-mono text-amber-500 font-bold uppercase">[INSERT_NEW_TASK_ROUTINE]</span>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Task Description / Title</label>
            <input
              id="new-task-title"
              type="text"
              placeholder="e.g. Code balanced Binary Search Tree rotation algorithms"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Category Group</label>
              <select
                id="new-task-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
              >
                <option value="DSA">DSA Track</option>
                <option value="Aptitude">Aptitude Practice</option>
                <option value="Resume">Resume Setup</option>
                <option value="Mock_Interview">Mock Interviews</option>
                <option value="General">General / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Complexity Rating</label>
              <select
                id="new-task-diff"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
              >
                <option value="Easy">Easy (+15 XP)</option>
                <option value="Medium">Medium (+30 XP)</option>
                <option value="Hard">Hard (+50 XP)</option>
              </select>
            </div>
          </div>

          <button
            id="commit-task-btn"
            type="submit"
            className="w-full cursor-pointer bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            EXECUTE ADD TASK
          </button>
        </form>
      )}

      {/* Actual task listings wrapper */}
      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
            <p className="text-slate-500 text-sm">Discipline queue is fully empty.</p>
            <p className="text-xs text-slate-600 mt-1">Excellent job! Complete a focus hour to celebrate or populate new records.</p>
          </div>
        ) : (
          tasks.map(task => {
            const catInfo = getCategoryTheme(task.category);
            const isCompleted = task.status === 'Completed';

            return (
              <div 
                id={`task-item-${task.id}`}
                key={task.id}
                className={`group/item flex items-center justify-between p-3 rounded-xl border transition-all duration-150 ${
                  isCompleted 
                    ? 'bg-slate-950/20 border-slate-800/40 opacity-60' 
                    : 'bg-slate-950/65 border-slate-800 hover:border-slate-700/80 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                  {/* Custom Checkbox Toggle Button */}
                  <button
                    id={`task-toggle-${task.id}`}
                    onClick={() => onToggleTask(task.id)}
                    className="cursor-pointer text-slate-500 hover:text-amber-500 transition-colors mt-0.5 flex-shrink-0"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-700" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p className={`text-sm font-sans tracking-tight leading-snug break-words ${isCompleted ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono ${catInfo.color}`}>
                        {catInfo.icon}
                        {catInfo.label}
                      </span>
                      <span className={`text-[10px] font-mono ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        ({task.xpReward} XP)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id={`task-delete-${task.id}`}
                    onClick={() => onDeleteTask(task.id)}
                    className="text-slate-600 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer md:opacity-0 group-hover/item:opacity-100 transition-opacity"
                    title="Purge Task"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
