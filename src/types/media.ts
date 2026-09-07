export type MediaType = 'video' | 'audio' | 'image';

export type VideoResolution = '8K' | '4K' | '2K' | '1080p' | '720p' | '480p' | '360p' | 'Unknown';

export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  url: string;
  size: number;
  duration?: number;
  resolution?: VideoResolution;
  width?: number;
  height?: number;
  mimeType: string;
  addedAt: Date;
  thumbnail?: string;
}

export interface Playlist {
  id: string;
  name: string;
  items: MediaFile[];
  createdAt: Date;
}

export interface PlayerState {
  currentMedia: MediaFile | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  quality: VideoResolution;
  showSubtitles: boolean;
}

export interface ImageEditorState {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  filter: string;
  cropMode: boolean;
}

export const SUPPORTED_VIDEO_FORMATS = [
  'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov',
  'video/mkv', 'video/flv', 'video/wmv', 'video/3gp', 'video/m4v',
  'video/mpeg', 'video/ts', 'video/hevc'
];

export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac',
  'audio/aac', 'audio/m4a', 'audio/wma', 'audio/opus', 'audio/webm',
  'audio/aiff', 'audio/amr'
];

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'image/bmp', 'image/svg+xml', 'image/tiff', 'image/avif', 'image/heic'
];

export function getMediaType(mimeType: string): MediaType | null {
  if (SUPPORTED_VIDEO_FORMATS.some(f => mimeType.startsWith('video'))) return 'video';
  if (SUPPORTED_AUDIO_FORMATS.some(f => mimeType.startsWith('audio'))) return 'audio';
  if (SUPPORTED_IMAGE_FORMATS.some(f => mimeType.startsWith('image'))) return 'image';
  return null;
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function detectResolution(width: number, height: number): VideoResolution {
  const maxDim = Math.max(width, height);
  if (maxDim >= 7680) return '8K';
  if (maxDim >= 3840) return '4K';
  if (maxDim >= 2560) return '2K';
  if (maxDim >= 1920) return '1080p';
  if (maxDim >= 1280) return '720p';
  if (maxDim >= 854) return '480p';
  return '360p';
}
