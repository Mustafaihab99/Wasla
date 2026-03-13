import {  useEffect, useRef, useState } from "react";
import { FiMic, FiSquare, FiSend, FiX, FiPlay, FiPause } from "react-icons/fi";

interface AudioRecorderButtonProps {
  recording: boolean;
  audioUrl: string | null;
  recordingSeconds: number;
  onStart: () => void;
  onStop: () => void;
  onClear: () => void;
  onSend: () => void;
  disabled?: boolean;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Shared waveform player ───
interface WavePreviewProps {
  audioUrl: string;
  isMine?: boolean;
  onClear?: () => void;
  onSend?: () => void;
  sendDisabled?: boolean;
  showActions?: boolean;
}

export function WavePreview({
  audioUrl,
  isMine = false,
  onClear,
  onSend,
//   sendDisabled,
  showActions = true,
}: WavePreviewProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoaded = () => setDuration(audio.duration);
    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleEnd = () => {
      setPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <button
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isMine ? "bg-white/25 text-white" : "bg-primary/20 text-primary"
        }`}>
        {playing ? <FiPause size={11} /> : <FiPlay size={11} />}
      </button>

      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-100"
          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      <span className={`text-[10px] font-mono ${isMine ? "text-white/65" : "text-foreground/50"}`}>
        {formatTime(Math.floor(currentTime))}/{formatTime(Math.floor(duration || 0))}
      </span>

      {showActions && (
        <>
          <button onClick={onClear} className="w-6 h-6 rounded-full bg-red-700">
            <FiX size={14} className="m-auto" />
          </button>
          <button onClick={onSend} className="w-6 h-6 rounded-full bg-primary">
            <FiSend size={12} className="text-white m-auto" />
          </button>
        </>
      )}
    </div>
  );
}
// ── AudioRecorderButton ────────────────────────────────────────────────────────
export function AudioRecorderButton({
  recording,
  audioUrl,
  recordingSeconds,
  onStart,
  onStop,
  onClear,
  onSend,
  disabled,
}: AudioRecorderButtonProps) {

  if (recording) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-2 flex-1 bg-red-500/10 border border-red-400/30 rounded-2xl px-3 py-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
          <div className="flex items-end gap-[2px] flex-1 h-6 min-w-0">
            {Array.from({ length: 22 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-red-400 rounded-full origin-bottom"
                style={{
                  height: `${35 + Math.sin(i * 0.9) * 35 + Math.cos(i * 1.5) * 20}%`,
                  animation: "waveBarRec 0.7s ease-in-out infinite alternate",
                  animationDelay: `${i * 45}ms`,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-red-500 font-mono shrink-0 tabular-nums">
            {formatTime(recordingSeconds)}
          </span>
        </div>
        <button
          onClick={onStop}
          className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0 active:scale-95 transition-transform shadow-sm">
          <FiSquare size={13} className="text-white" />
        </button>
        <style>{`
          @keyframes waveBarRec {
            from { transform: scaleY(0.3); }
            to   { transform: scaleY(1); }
          }
        `}</style>
      </div>
    );
  }

  if (audioUrl) {
    return (
      <div className="flex items-center gap-2 w-full bg-primary/10 border border-primary/20 rounded-2xl px-3 py-2">
        <WavePreview
          audioUrl={audioUrl}
          isMine={false}
          onClear={onClear}
          onSend={onSend}
          sendDisabled={disabled}
          showActions={true}
        />
      </div>
    );
  }

  return (
    <button
      onClick={onStart}
      disabled={disabled}
      className="w-10 h-10 rounded-full hover:bg-primary/10 transition flex items-center justify-center shrink-0 text-primary/70 active:scale-95 disabled:opacity-50">
      <FiMic size={18} />
    </button>
  );
}