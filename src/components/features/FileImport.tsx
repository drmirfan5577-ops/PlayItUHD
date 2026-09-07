import { useRef, useCallback, DragEvent } from 'react';
import { Upload, FolderOpen, Film, Music, Image } from 'lucide-react';
import { MediaFile, getMediaType, detectResolution, SUPPORTED_VIDEO_FORMATS, SUPPORTED_AUDIO_FORMATS, SUPPORTED_IMAGE_FORMATS } from '@/types/media';
import { ALL_ACCEPT } from '@/constants/mediaFormats';
import { toast } from 'sonner';

interface FileImportProps {
  onFilesAdded: (files: MediaFile[]) => void;
  compact?: boolean;
}

function createMediaFile(file: File): Promise<MediaFile> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const type = getMediaType(file.type) || (
      file.name.match(/\.(mp4|webm|mkv|avi|mov|flv|wmv|3gp|m4v|ogv)$/i) ? 'video' :
      file.name.match(/\.(mp3|wav|ogg|flac|aac|m4a|opus|wma|aiff)$/i) ? 'audio' : 'image'
    );

    const mediaFile: MediaFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      type: type || 'video',
      url,
      size: file.size,
      mimeType: file.type || 'application/octet-stream',
      addedAt: new Date(),
      resolution: 'Unknown',
    };

    if (type === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        mediaFile.duration = video.duration;
        mediaFile.width = video.videoWidth;
        mediaFile.height = video.videoHeight;
        mediaFile.resolution = detectResolution(video.videoWidth, video.videoHeight);
        URL.revokeObjectURL(video.src);
        resolve(mediaFile);
      };
      video.onerror = () => resolve(mediaFile);
      video.src = url;
    } else if (type === 'audio') {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        mediaFile.duration = audio.duration;
        resolve(mediaFile);
      };
      audio.onerror = () => resolve(mediaFile);
      audio.src = url;
    } else if (type === 'image') {
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        mediaFile.width = img.naturalWidth;
        mediaFile.height = img.naturalHeight;
        mediaFile.resolution = detectResolution(img.naturalWidth, img.naturalHeight);
        mediaFile.thumbnail = url;
        resolve(mediaFile);
      };
      img.onerror = () => resolve(mediaFile);
      img.src = url;
    } else {
      resolve(mediaFile);
    }
  });
}

export default function FileImport({ onFilesAdded, compact = false }: FileImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const promises = fileArray.map(createMediaFile);
    const results = await Promise.all(promises);
    onFilesAdded(results);
    toast.success(`Added ${results.length} file${results.length > 1 ? 's' : ''} to playlist`);
  }, [onFilesAdded]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) processFiles(files);
  }, [processFiles]);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  if (compact) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALL_ACCEPT}
          className="hidden"
          onChange={(e) => e.target.files && processFiles(e.target.files)}
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 rounded-xl text-sm font-medium transition-all"
        >
          <FolderOpen className="w-4 h-4" />
          Open Files
        </button>
      </>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl p-8 text-center bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer group"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALL_ACCEPT}
        className="hidden"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      <div className="flex justify-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Film className="w-5 h-5 text-blue-400" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <Music className="w-5 h-5 text-purple-400" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <Image className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-cyan-500/30 transition-all">
        <Upload className="w-6 h-6 text-cyan-400" />
      </div>

      <p className="text-white font-semibold mb-1">Drop files or click to browse</p>
      <p className="text-slate-500 text-sm">Video • Audio • Images — All formats supported</p>
      <p className="text-slate-600 text-xs mt-2">MP4, WebM, MKV, MP3, FLAC, JPG, PNG, GIF and more</p>
    </div>
  );
}
