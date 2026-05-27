
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        onAuthSuccess(data.user);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Unable to connect to server');
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
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-slate-950">
      <div className="w-full max-w-md rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">

        {/* Top Gradient */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500"></div>

        <div className="p-6 sm:p-8">

          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Shield className="w-7 h-7 text-amber-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              FOCUS
              <span className="text-amber-500">FORGE</span>
            </h1>

            <p className="text-slate-400 text-sm mt-2">
              Grow with consistency
            </p>

            <p className="text-slate-500 text-sm mt-3 leading-relaxed px-2">
              {isLogin
                ? 'Sign in to access your dashboard and continue your progress.'
                : 'Create an account to track your DSA progress and study goals.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 transition-all duration-200 active:scale-95"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
              ) : isLogin ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="px-3 text-xs text-slate-500 uppercase tracking-wider">
              Quick Access
            </span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          {/* Guest Login */}
          <button
            onClick={loadGuestCredentials}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 hover:bg-slate-900 py-3 text-sm text-slate-200 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Continue as Guest
          </button>

          {/* Toggle */}
          <div className="text-center mt-6">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
                setUsername('');
              }}
              className="text-sm text-slate-400 hover:text-amber-400 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```
