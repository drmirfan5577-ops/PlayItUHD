import { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Minimize, RotateCcw, Settings, Subtitles,
  PictureInPicture2, Repeat, Shuffle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useMediaPlayer } from '@/hooks/useMediaPlayer';
import { MediaFile, formatDuration } from '@/types/media';
import { PLAYBACK_SPEEDS } from '@/constants/mediaFormats';
import ResolutionBadge from './ResolutionBadge';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  playlist: MediaFile[];
  initialIndex?: number;
}

export default function VideoPlayer({ playlist, initialIndex = 0 }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    videoRef, state, currentIndex,
    togglePlay, seek, setVolume, toggleMute,
    setPlaybackRate, toggleLoop, toggleShuffle,
    playNext, playPrev, selectMedia,
    onTimeUpdate, onLoadedMetadata, onEnded,
    skipForward, skipBackward, toggleFullscreen,
  } = useMediaPlayer(playlist);

  const currentMedia = playlist[currentIndex] || state.currentMedia;

  useEffect(() => {
    if (playlist.length > 0 && initialIndex !== undefined) {
      selectMedia(playlist[initialIndex], initialIndex);
    }
  }, []);

  useEffect(() => {
    if (videoRef.current && currentMedia?.url) {
      videoRef.current.src = currentMedia.url;
      videoRef.current.load();
    }
  }, [currentMedia?.url]);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => {
      if (state.isPlaying) setShowControls(false);
    }, 3000);
  }, [state.isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.code) {
        case 'Space': e.preventDefault(); togglePlay(); break;
        case 'ArrowLeft': skipBackward(10); break;
        case 'ArrowRight': skipForward(10); break;
        case 'ArrowUp': e.preventDefault(); setVolume(Math.min(1, state.volume + 0.1)); break;
        case 'ArrowDown': e.preventDefault(); setVolume(Math.max(0, state.volume - 0.1)); break;
        case 'KeyM': toggleMute(); break;
        case 'KeyF': toggleFullscreen(containerRef); break;
        case 'KeyL': toggleLoop(); break;
        case 'KeyN': playNext(); break;
        case 'KeyP': playPrev(); break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, skipBackward, skipForward, setVolume, toggleMute, toggleFullscreen, toggleLoop, playNext, playPrev, state.volume]);

  const handlePiP = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (e) {
        console.log('PiP not supported');
      }
    }
  };

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * state.duration);
  };

  if (!currentMedia || currentMedia.type !== 'video') {
    return (
      <div className="aspect-video bg-black/60 rounded-2xl flex items-center justify-center border border-white/10">
        <p className="text-slate-500 text-sm">No video selected</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden group select-none"
      onMouseMove={resetControlsTimer}
      onMouseLeave={() => state.isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full aspect-video object-contain bg-black"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        onClick={togglePlay}
        playsInline
        crossOrigin="anonymous"
      />

      {/* Overlay gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 transition-opacity duration-300',
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )} />

      {/* Top Bar */}
      <div className={cn(
        'absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between transition-opacity duration-300',
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div className="flex items-center gap-2">
          <h3 className="text-white text-sm font-medium truncate max-w-[200px] md:max-w-md">
            {currentMedia.name}
          </h3>
          {currentMedia.resolution && <ResolutionBadge resolution={currentMedia.resolution} size="sm" />}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePiP} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <PictureInPicture2 className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-14 right-4 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-50 min-w-[180px]">
          <p className="text-white text-xs font-semibold mb-3 uppercase tracking-wider">Speed</p>
          <div className="grid grid-cols-3 gap-1.5">
            {PLAYBACK_SPEEDS.map(speed => (
              <button
                key={speed}
                onClick={() => { setPlaybackRate(speed); setShowSettings(false); }}
                className={cn(
                  'text-xs py-1.5 px-2 rounded-lg font-medium transition-all',
                  state.playbackRate === speed
                    ? 'bg-cyan-500 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                )}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Center Play Button */}
      {!state.isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </button>
      )}

      {/* Bottom Controls */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8 transition-opacity duration-300',
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        {/* Progress Bar */}
        <div
          className="h-1.5 bg-white/20 rounded-full cursor-pointer mb-3 relative group/bar hover:h-2.5 transition-all"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-all" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button onClick={playPrev} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <SkipBack className="w-4 h-4 fill-white" />
            </button>
            <button onClick={() => skipBackward(10)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center text-white transition-all shadow-lg shadow-cyan-500/40 mx-1"
            >
              {state.isPlaying
                ? <Pause className="w-5 h-5 fill-white" />
                : <Play className="w-5 h-5 fill-white ml-0.5" />
              }
            </button>
            <button onClick={() => skipForward(10)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={playNext} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all">
              <SkipForward className="w-4 h-4 fill-white" />
            </button>
          </div>

          {/* Time */}
          <div className="text-white/70 text-xs font-mono hidden sm:block">
            {formatDuration(state.currentTime)} / {formatDuration(state.duration)}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1">
            <button onClick={toggleLoop} className={cn('w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all', state.isLooping ? 'text-cyan-400' : 'text-white/70')}>
              <Repeat className="w-4 h-4" />
            </button>
            <button onClick={toggleShuffle} className={cn('w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-all', state.isShuffle ? 'text-cyan-400' : 'text-white/70')}>
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1 group/vol">
              <button onClick={toggleMute} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all">
                {state.isMuted || state.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min="0" max="1" step="0.05"
                value={state.isMuted ? 0 : state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-0 group-hover/vol:w-16 transition-all duration-300 overflow-hidden accent-cyan-400 h-1"
              />
            </div>

            <button onClick={() => toggleFullscreen(containerRef)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white transition-all">
              {state.isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
