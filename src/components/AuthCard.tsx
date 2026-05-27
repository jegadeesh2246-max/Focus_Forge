import React, { useState } from 'react';
import { Shield, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

interface AuthCardProps {
  onAuthSuccess: (user: User) => void;
}

export function AuthCard({ onAuthSuccess }: AuthCardProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email, password }
      : { username, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.success) {
        onAuthSuccess(data.user);
      } else {
        setError(data.message || 'Credentials match failed.');
      }
    } catch (err) {
      setError('Connection failure. Is the DisciplineOS server booted?');
    } finally {
      setLoading(false);
    }
  };

  const loadGuestCredentials = () => {
    setEmail('student@disciplineos.dev');
    setPassword('survive');
    setIsLogin(true);
    setError('');
  };

  return (
    <div id="auth-panel" className="w-full max-w-md mx-auto p-1">
      <div className="relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 bg-opacity-80 backdrop-blur-xl p-8 shadow-[0_0_50px_-12px_rgba(245,158,11,0.15)] transition-all duration-300 hover:border-amber-500/30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-600"></div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4 animate-pulse">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-100 tracking-tight font-sans">
            FOCUS<span className="text-amber-500 font-mono">FORGE</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">Grow with me</p>
          <p className="text-sm text-slate-400 mt-2">
            {isLogin 
              ? 'Login using your account details to access your placement dashboard' 
              : 'Create an account to track your DSA progress and study goals'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Avatar Code Name</label>
              <input
                id="reg-username"
                type="text"
                placeholder="e.g. CodeWarrior"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input
              id="auth-email"
              type="text"
              placeholder="student@disciplineos.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none transition-all"
            />
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-400 p-3 rounded-lg text-xs font-mono">
              [CRITICAL_FAILURE]: {error}
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-semibold py-2.5 px-4 rounded-lg text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all transform active:scale-95 duration-100"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" /> Signing In...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Creating Account...
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-3">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-mono text-slate-500">OR QUICK ACTIONS</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            id="auth-guest-btn"
            onClick={loadGuestCredentials}
            className="w-full cursor-pointer flex items-center justify-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg py-2 text-xs font-mono text-slate-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Continue as Guest
          </button>

          <button
            id="auth-toggle"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-center text-xs text-slate-400 hover:text-amber-400 transition-colors mt-2"
          >
            {isLogin ? 'Need an organic profile? Create a new one' : 'Already have an Account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
