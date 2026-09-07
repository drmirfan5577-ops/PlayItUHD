import { useState, useCallback } from 'react';
import { MediaFile } from '@/types/media';
import VideoPlayer from '@/components/features/VideoPlayer';
import MediaPlaylist from '@/components/features/MediaPlaylist';
import FileImport from '@/components/features/FileImport';
import { Film, ListVideo, Keyboard, X } from 'lucide-react';
import { KEYBOARD_SHORTCUTS } from '@/constants/mediaFormats';
import { cn } from '@/lib/utils';

export default function PlayerPage() {
  const [playlist, setPlaylist] = useState<MediaFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [tab, setTab] = useState<'playlist' | 'import'>('playlist');

  const videoPlaylist = playlist.filter(m => m.type === 'video');

  const handleFilesAdded = useCallback((files: MediaFile[]) => {
    setPlaylist(prev => [...prev, ...files]);
    setTab('playlist');
  }, []);

  const handleRemove = useCallback((id: string) => {
    setPlaylist(prev => {
      const idx = prev.findIndex(f => f.id === id);
      const newList = prev.filter(f => f.id !== id);
      if (idx <= currentIndex && currentIndex > 0) setCurrentIndex(c => c - 1);
      return newList;
    });
  }, [currentIndex]);

  const handleSelect = useCallback((media: MediaFile, index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a12] pt-16">
      <div className="max-w-screen-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Video Player</h1>
              <p className="text-slate-500 text-sm">1K · 2K · 4K · 8K Ultra HD</p>
            </div>
          </div>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white rounded-xl text-sm transition-all"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Shortcuts</span>
          </button>
        </div>

        {/* Keyboard Shortcuts Panel */}
        {showShortcuts && (
          <div className="mb-6 bg-[#0e1420] rounded-2xl border border-white/10 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {KEYBOARD_SHORTCUTS.map(({ key, action }) => (
                <div key={key} className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-white/10 border border-white/20 rounded-md text-white text-xs font-mono min-w-[32px] text-center">{key}</kbd>
                  <span className="text-slate-400 text-xs">{action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Player - 2/3 */}
          <div className="xl:col-span-2">
            <VideoPlayer playlist={videoPlaylist} initialIndex={0} />

            {/* Specs Bar */}
            <div className="mt-3 flex flex-wrap gap-2 px-1">
              {['H.264', 'H.265/HEVC', 'VP9', 'AV1', 'HDR10', 'Dolby Vision', 'PiP', 'Subtitles'].map(spec => (
                <span key={spec} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-500">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-[#0e1420] rounded-xl p-1 border border-white/10">
              <button
                onClick={() => setTab('playlist')}
                className={cn('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all', tab === 'playlist' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white')}
              >
                <ListVideo className="w-4 h-4" />
                Playlist ({videoPlaylist.length})
              </button>
              <button
                onClick={() => setTab('import')}
                className={cn('flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all', tab === 'import' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-white')}
              >
                + Add Files
              </button>
            </div>

            <div className="bg-[#0a0f1a] rounded-2xl border border-white/10 flex-1 min-h-[400px] overflow-hidden p-3">
              {tab === 'playlist' ? (
                <MediaPlaylist
                  items={videoPlaylist}
                  currentIndex={currentIndex}
                  isPlaying={isPlaying}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                />
              ) : (
                <div className="p-2">
                  <FileImport onFilesAdded={handleFilesAdded} />
                  <div className="mt-4 space-y-1.5">
                    <p className="text-slate-600 text-xs uppercase tracking-wider mb-2">Supported</p>
                    {['MP4, WebM, MKV, AVI, MOV', 'FLV, WMV, 3GP, M4V, MPEG', 'TS, OGV and more...'].map(f => (
                      <p key={f} className="text-slate-500 text-xs">{f}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
