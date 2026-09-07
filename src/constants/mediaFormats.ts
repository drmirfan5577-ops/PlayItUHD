export const RESOLUTION_BADGES: Record<string, { color: string; glow: string }> = {
  '8K': { color: 'from-rose-500 to-pink-600', glow: 'shadow-rose-500/50' },
  '4K': { color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/50' },
  '2K': { color: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/50' },
  '1080p': { color: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/50' },
  '720p': { color: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/50' },
  '480p': { color: 'from-slate-400 to-slate-600', glow: 'shadow-slate-400/50' },
  '360p': { color: 'from-slate-400 to-slate-600', glow: 'shadow-slate-400/50' },
  'Unknown': { color: 'from-slate-500 to-slate-700', glow: 'shadow-slate-500/50' },
};

export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];

export const AUDIO_EXTENSIONS = [
  '.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma',
  '.opus', '.aiff', '.amr', '.webm'
];

export const VIDEO_EXTENSIONS = [
  '.mp4', '.webm', '.ogv', '.avi', '.mov', '.mkv', '.flv',
  '.wmv', '.3gp', '.m4v', '.mpeg', '.mpg', '.ts', '.m2ts'
];

export const IMAGE_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp',
  '.svg', '.tiff', '.tif', '.avif', '.heic', '.ico'
];

export const ALL_ACCEPT = [
  ...AUDIO_EXTENSIONS, ...VIDEO_EXTENSIONS, ...IMAGE_EXTENSIONS
].join(',');

export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play / Pause' },
  { key: '←', action: 'Rewind 10s' },
  { key: '→', action: 'Forward 10s' },
  { key: '↑', action: 'Volume Up' },
  { key: '↓', action: 'Volume Down' },
  { key: 'M', action: 'Mute / Unmute' },
  { key: 'F', action: 'Fullscreen' },
  { key: 'L', action: 'Loop Toggle' },
  { key: 'N', action: 'Next Track' },
  { key: 'P', action: 'Previous Track' },
];
