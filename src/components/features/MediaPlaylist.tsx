import { MediaFile, formatFileSize, formatDuration } from '@/types/media';
import { Play, Music, Image, Trash2, ChevronRight } from 'lucide-react';
import ResolutionBadge from './ResolutionBadge';
import { cn } from '@/lib/utils';

interface MediaPlaylistProps {
  items: MediaFile[];
  currentIndex: number;
  isPlaying: boolean;
  onSelect: (media: MediaFile, index: number) => void;
  onRemove: (id: string) => void;
}

function MediaIcon({ type }: { type: MediaFile['type'] }) {
  if (type === 'video') return <Play className="w-3.5 h-3.5 text-cyan-400" />;
  if (type === 'audio') return <Music className="w-3.5 h-3.5 text-purple-400" />;
  return <Image className="w-3.5 h-3.5 text-emerald-400" />;
}

export default function MediaPlaylist({ items, currentIndex, isPlaying, onSelect, onRemove }: MediaPlaylistProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <Play className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-400 text-sm">Playlist is empty</p>
        <p className="text-slate-600 text-xs mt-1">Add files to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 overflow-y-auto max-h-full pr-1 custom-scroll">
      {items.map((item, index) => {
        const active = index === currentIndex;
        return (
          <div
            key={item.id}
            onClick={() => onSelect(item, index)}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border',
              active
                ? 'bg-cyan-500/15 border-cyan-500/30 shadow-inner'
                : 'hover:bg-white/5 border-transparent hover:border-white/10'
            )}
          >
            {/* Icon/Index */}
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold',
              active ? 'bg-cyan-500/30' : 'bg-white/5'
            )}>
              {active && isPlaying ? (
                <span className="flex gap-0.5 items-end h-4">
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
                </span>
              ) : (
                <MediaIcon type={item.type} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium truncate', active ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white')}>
                {item.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">{formatFileSize(item.size)}</span>
                {item.duration && (
                  <span className="text-xs text-slate-600">• {formatDuration(item.duration)}</span>
                )}
                {item.resolution && item.resolution !== 'Unknown' && (
                  <ResolutionBadge resolution={item.resolution} size="sm" />
                )}
              </div>
            </div>

            {/* Delete btn */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
              className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
