import { useRef, useEffect, useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Music2
} from 'lucide-react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { MediaFile, formatDuration } from '@/types/media';
import { PLAYBACK_SPEEDS } from '@/constants/mediaFormats';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  playlist: MediaFile[];
}

export default function AudioPlayer({ playlist }: AudioPlayerProps) {
  const {
    audioRef, state, currentIndex,
    togglePlay, seek, setVolume, toggleMute,
    setPlaybackRate, toggleLoop, toggleShuffle,
    playNext, playPrev, selectMedia,
    onTimeUpdate, onLoadedMetadata, onEnded,
  } = useMediaPlayer(playlist);

  const currentMedia = playlist[currentIndex] || null;

  useEffect(() => {
    if (audioRef.current && currentMedia?.url) {
      audioRef.current.src = currentMedia.url;
      audioRef.current.load();
    }
  }, [currentMedia?.url]);

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * state.duration);
  };

  if (!currentMedia) {
    return (
      <div className="bg-[#0e1420] rounded-2xl p-8 flex flex-col items-center justify-center min-h-[280px] border border-white/10">
        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
          <Music2 className="w-10 h-10 text-purple-400/50" />
        </div>
        <p className="text-slate-400">No audio selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0e1420] to-[#12182a] rounded-2xl overflow-hidden border border-white/10">
      {/* Animated Visualizer */}
      <div className="relative h-40 bg-gradient-to-b from-purple-900/30 to-transparent overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-center gap-0.5 pb-4 px-8">
          {Array.from({ length: 48 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-t-sm bg-gradient-to-t from-purple-500 to-cyan-400 opacity-70',
                state.isPlaying ? 'animate-pulse' : ''
              )}
              style={{
                height: state.isPlaying
                  ? `${20 + Math.abs(Math.sin(i * 0.5 + Date.now() * 0.001)) * 80}%`
                  : `${10 + Math.sin(i * 0.8) * 10}%`,
                animationDelay: `${i * 30}ms`,
                animationDuration: `${600 + Math.random() * 600}ms`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn(
            'w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/40 mb-2',
            state.isPlaying ? 'animate-spin' : ''
          )} style={{ animationDuration: '8s' }}>
            <div className="w-6 h-6 rounded-full bg-[#0e1420]" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Track Info */}
        <div className="text-center mb-6">
          <h3 className="text-white font-bold text-lg truncate">{currentMedia.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-slate-500 text-sm capitalize">{currentMedia.mimeType.split('/')[1]?.toUpperCase() || 'Audio'}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 text-sm">
              {currentIndex + 1} / {playlist.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div
            className="h-2 bg-white/10 rounded-full cursor-pointer mb-2 relative hover:h-3 transition-all"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>{formatDuration(state.currentTime)}</span>
            <span>{formatDuration(state.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={toggleShuffle} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-all', state.isShuffle ? 'text-purple-400' : 'text-white/40 hover:text-white/70')}>
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={toggleLoop} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-all', state.isLooping ? 'text-purple-400' : 'text-white/40 hover:text-white/70')}>
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={playPrev} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <SkipBack className="w-4 h-4 fill-white" />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-105"
            >
              {state.isPlaying
                ? <Pause className="w-6 h-6 fill-white" />
                : <Play className="w-6 h-6 fill-white ml-1" />
              }
            </button>
            <button onClick={playNext} className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <SkipForward className="w-4 h-4 fill-white" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1">
            <button onClick={toggleMute} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-all">
              {state.isMuted || state.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range" min="0" max="1" step="0.05"
              value={state.isMuted ? 0 : state.volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-purple-400 h-1"
            />
          </div>
        </div>

        {/* Speed */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-slate-600 text-xs">Speed</span>
          <div className="flex gap-1">
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackRate(speed)}
                className={cn(
                  'text-xs px-2 py-1 rounded-md transition-all',
                  state.playbackRate === speed
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
    </div>
  );
}
