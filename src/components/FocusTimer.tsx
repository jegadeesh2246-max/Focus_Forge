import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, EyeOff, Radio, Sparkles } from 'lucide-react';

interface FocusTimerProps {
  onSessionComplete: (durationMinutes: number, focusExits: number) => void;
  unlockedTracks: string[];
}

export function FocusTimer({ onSessionComplete, unlockedTracks }: FocusTimerProps) {
  const [duration, setDuration] = useState(25); // In minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // In seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('none');
  const [muted, setMuted] = useState(false);
  const [focusExits, setFocusExits] = useState(0);
  const [showExitAlert, setShowExitAlert] = useState(false);

  // Web Audio Context reference for live synthesized ambient soundtrack
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const durationAtStart = useRef(25);

  // Track page exits using visibility and blur listeners
  useEffect(() => {
    const handleVisibilityAndBlur = () => {
      if (document.hidden || !document.hasFocus()) {
        if (isRunning) {
          setFocusExits((prev) => {
            const next = prev + 1;
            setShowExitAlert(true);
            
            // Auto hide exit alert banner after 6 secs
            setTimeout(() => {
              setShowExitAlert(false);
            }, 6000);

            return next;
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityAndBlur);
    window.addEventListener('blur', handleVisibilityAndBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityAndBlur);
      window.removeEventListener('blur', handleVisibilityAndBlur);
    };
  }, [isRunning]);

  // Handle countdown logic
  useEffect(() => {
    if (isRunning) {
      countdownInterval.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    }

    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [isRunning, duration]);

  // Synthesis engine for real client-side Focus music
  const startSynthesizing = () => {
    if (muted || selectedTrack === 'none') {
      stopSynthesizing();
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Clear any existing oscillator
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.08, ctx.currentTime);

      if (selectedTrack === 'cyberpunk-pulse') {
        // Deep synthesizer hum (LFO/Pulse style)
        const osc = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, ctx.currentTime); // Low C

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(3, ctx.currentTime); // 3 Hz modulation
        lfoGain.gain.setValueAtTime(5, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(gainNodeRef.current);
        gainNodeRef.current.connect(ctx.destination);

        osc.start();
        lfo.start();

        oscillatorRef.current = osc;
      } else if (selectedTrack === 'rain-cafe') {
        // Synthesizing gentle static pink/white noise for Rain representation
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Filter white noise to model sound of falling raindrops
          output[i] = 0.95 * lastOut + 0.05 * white;
          lastOut = output[i];
          output[i] *= 3.5; // Gain multiplier
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        rainSource.connect(gainNodeRef.current);
        gainNodeRef.current.connect(ctx.destination);
        rainSource.start();

        // Save reference by casting
        oscillatorRef.current = rainSource as any;
      } else if (selectedTrack === 'lofi-synthetics') {
        // Smooth sine wave drone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // A2 drone

        osc.connect(gainNodeRef.current);
        gainNodeRef.current.connect(ctx.destination);
        osc.start();

        oscillatorRef.current = osc;
      }
    } catch (e) {
      console.error('Audio synthesizer engine initialization bypassed:', e);
    }
  };

  const stopSynthesizing = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch (e) {}
  };

  useEffect(() => {
    startSynthesizing();
    return () => stopSynthesizing();
  }, [selectedTrack, muted]);

  const handleComplete = () => {
    setIsRunning(false);
    stopSynthesizing();
    // Execute server log callback
    onSessionComplete(duration, focusExits);
    
    // Play sweet synth notify chime
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}

    // Reset countdown
    setTimeLeft(duration * 60);
    setFocusExits(0);
  };

  const handleToggle = () => {
    if (!isRunning) {
      durationAtStart.current = duration;
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    stopSynthesizing();
    setFocusExits(0);
    setShowExitAlert(false);
  };

  const changePreset = (mins: number) => {
    setIsRunning(false);
    setDuration(mins);
    setTimeLeft(mins * 60);
    stopSynthesizing();
    setFocusExits(0);
    setShowExitAlert(false);
  };

  // Convert seconds to clean display string
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Visual calculation for circular rings
  const totalSecs = duration * 60;
  const progressRatio = timeLeft / totalSecs;
  const strokeDashoffset = 282 - (282 * progressRatio);

  return (
    <div className="bg-slate-900 border border-slate-800 bg-opacity-75 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center relative overflow-hidden group">
      
      {/* Absolute Header Anti-procrastination warnings banner */}
      {showExitAlert && (
        <div className="absolute top-0 left-0 w-full bg-rose-950/90 border-b border-rose-600/40 text-rose-300 py-2.5 px-4 text-xs font-mono animate-slideDown flex items-center justify-center gap-2 z-10">
          <EyeOff className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>[WARNING]: FOCUS ESCAPE DETECTED! Context switched. Discipline rating impacted. Stay on this screen!</span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-slate-100 font-sans">Cinematic Focus Timer</h3>
        <p className="text-xs text-slate-400">Lock distractions down. WebAudio synthetic flow-waves active.</p>
      </div>

      {/* Focus Timer Circular Progress */}
      <div className="my-8 flex justify-center items-center relative">
        <div className="relative w-48 h-48 flex justify-center items-center">
          
          {/* Svg ring indicator */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="45"
              stroke="#0f172a"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="45"
              stroke="#f59e0b"
              className="transition-all duration-300"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="282"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Time digits */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-mono font-bold tracking-tighter text-slate-100">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              {isRunning ? 'FLOWING ACTIVE' : 'STAGE READY'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Interval Preset configs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {[10, 25, 45, 60].map((t) => (
          <button
            id={`preset-btn-${t}`}
            key={t}
            disabled={isRunning}
            onClick={() => changePreset(t)}
            className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
              duration === t
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-350 disabled:opacity-40'
            }`}
          >
            {t}m
          </button>
        ))}
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          id="focus-reset-btn"
          onClick={handleReset}
          className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all active:scale-95"
          title="Reset Countdown"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          id="focus-toggle-btn"
          onClick={handleToggle}
          className="cursor-pointer flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 text-slate-950 hover:bg-yellow-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        >
          {isRunning ? (
            <Pause className="w-6 h-6 fill-slate-950" />
          ) : (
            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
          )}
        </button>

        <button
          id="focus-mute-btn"
          onClick={() => setMuted(!muted)}
          className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-xl bg-slate-950 border transition-all active:scale-95 ${
            muted ? 'border-rose-500/20 text-rose-400' : 'border-slate-800 text-slate-400'
          }`}
          title={muted ? 'Unmute Noise' : 'Mute Noise'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive Web Audio Synthesizer control bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-xs text-left">
        <div className="flex items-center gap-1.5 font-mono text-slate-400 mb-3">
          <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>SYNTH SOUNDTRACK GENERATOR:</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'none', label: 'Mute Channel' },
            { id: 'cyberpunk-pulse', label: '🔌 Cyber-Hum' },
            { id: 'rain-cafe', label: '🌧️ Static Rain' },
            { id: 'lofi-synthetics', label: '🛸 Space Drone' },
          ].map((track) => {
            const isUnlocked = track.id === 'none' || track.id === 'cyberpunk-pulse' || unlockedTracks.includes(track.id);
            return (
              <button
                id={`synth-track-${track.id}`}
                key={track.id}
                disabled={!isUnlocked}
                onClick={() => setSelectedTrack(track.id)}
                className={`cursor-pointer text-left px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-colors truncate ${
                  selectedTrack === track.id
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                    : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:text-slate-350 disabled:opacity-30 disabled:hover:text-slate-500'
                }`}
                title={!isUnlocked ? 'Reach Level 2/4 in Discipline to unlock additional focus waves' : ''}
              >
                {track.label} {!isUnlocked && '🔒'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Exit count summary pill representation */}
      {isRunning && (
        <div className="mt-4 flex items-center justify-between gap-2 px-3 py-1 bg-slate-950/40 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-500 text-[10px]">CURRENT EXITS DETECTED:</span>
          <span className={`font-bold ${focusExits > 2 ? 'text-rose-500' : focusExits > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {focusExits} switches
          </span>
        </div>
      )}
    </div>
  );
}
