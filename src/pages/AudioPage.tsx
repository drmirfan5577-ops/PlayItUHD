import { useState, useCallback } from 'react';
import { MediaFile, formatFileSize, formatDuration } from '@/types/media';
import AudioPlayer from '@/components/features/AudioPlayer';
import FileImport from '@/components/features/FileImport';
import MediaPlaylist from '@/components/features/MediaPlaylist';
import { Music, ListMusic, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AudioPage() {
  const [playlist, setPlaylist] = useState<MediaFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tab, setTab] = useState<'playlist' | 'import'>('playlist');

  const audioPlaylist = playlist.filter(m => m.type === 'audio');

  const handleFilesAdded = useCallback((files: MediaFile[]) => {
    setPlaylist(prev => [...prev, ...files]);
    setTab('playlist');
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPlaylist(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleSelect = useCallback((_media: MediaFile, index: number) => {
    setCurrentIndex(index);
  }, []);

  const totalDuration = audioPlaylist.reduce((acc, f) => acc + (f.duration || 0), 0);
  const totalSize = audioPlaylist.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen bg-[#060a12] pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Audio Player</h1>
              <p className="text-slate-500 text-sm">Hi-Fi · Lossless · All Formats</p>
            </div>
          </div>
          {audioPlaylist.length > 0 && (
            <div className="hidden sm:flex items-center gap-4 text-sm text-slate-500">
              <span>{audioPlaylist.length} tracks</span>
              <span>•</span>
              <span>{formatDuration(totalDuration)}</span>
              <span>•</span>
              <span>{formatFileSize(totalSize)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Player — left 2 cols */}
          <div className="lg:col-span-2">
            <AudioPlayer playlist={audioPlaylist} />

            {/* Format badges */}
            <div className="mt-4 p-4 bg-[#0a0f1a] rounded-2xl border border-white/10">
              <p className="text-slate-600 text-xs uppercase tracking-wider mb-3">Supported Formats</p>
              <div className="flex flex-wrap gap-1.5">
                {['MP3', 'FLAC', 'WAV', 'OGG', 'AAC', 'M4A', 'WMA', 'OPUS', 'AIFF', 'AMR', 'WebM Audio'].map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Playlist — right 3 cols */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="flex gap-1 bg-[#0e1420] rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setTab('playlist')}
                className={cn('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all', tab === 'playlist' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-white')}
              >
                <ListMusic className="w-4 h-4" />
                Playlist ({audioPlaylist.length})
              </button>
              <button
                onClick={() => setTab('import')}
                className={cn('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all', tab === 'import' ? 'bg-purple-500/20 text-purple-400' : 'text-slate-500 hover:text-white')}
              >
                <Upload className="w-4 h-4" />
                Add Tracks
              </button>
            </div>

            <div className="bg-[#0a0f1a] rounded-2xl border border-white/10 flex-1 min-h-[400px] overflow-hidden p-3">
              {tab === 'playlist' ? (
                <MediaPlaylist
                  items={audioPlaylist}
                  currentIndex={currentIndex}
                  isPlaying={false}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                />
              ) : (
                <div className="p-2">
                  <FileImport onFilesAdded={handleFilesAdded} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
