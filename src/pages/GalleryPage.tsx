import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MediaFile } from '@/types/media';
import ImageGallery from '@/components/features/ImageGallery';
import FileImport from '@/components/features/FileImport';
import { Image, Grid3x3, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function GalleryPage() {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [tab, setTab] = useState<'gallery' | 'import'>('gallery');
  const navigate = useNavigate();

  const handleFilesAdded = useCallback((files: MediaFile[]) => {
    const imgFiles = files.filter(f => f.type === 'image');
    if (imgFiles.length === 0) {
      toast.error('Please add image files only (JPG, PNG, WebP, GIF...)');
      return;
    }
    setImages(prev => [...prev, ...imgFiles]);
    setTab('gallery');
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImages(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleOpenEditor = useCallback((image: MediaFile) => {
    sessionStorage.setItem('editImage', JSON.stringify({ id: image.id, name: image.name, url: image.url, size: image.size, mimeType: image.mimeType, type: image.type, width: image.width, height: image.height, resolution: image.resolution, addedAt: image.addedAt }));
    navigate('/editor');
  }, [navigate]);

  const clearAll = () => {
    setImages([]);
    toast.success('Gallery cleared');
  };

  return (
    <div className="min-h-screen bg-[#060a12] pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Image className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Image Gallery</h1>
              <p className="text-slate-500 text-sm">{images.length} image{images.length !== 1 ? 's' : ''} • Lightbox · Zoom · Slideshow</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {images.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
            <FileImport onFilesAdded={handleFilesAdded} compact />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#0e1420] rounded-xl p-1 border border-white/10 mb-6 w-fit">
          <button
            onClick={() => setTab('gallery')}
            className={cn('flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all', tab === 'gallery' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white')}
          >
            <Grid3x3 className="w-4 h-4" />
            Gallery ({images.length})
          </button>
          <button
            onClick={() => setTab('import')}
            className={cn('flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all', tab === 'import' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-white')}
          >
            <Upload className="w-4 h-4" />
            Add Images
          </button>
        </div>

        {tab === 'gallery' ? (
          <ImageGallery images={images} onRemove={handleRemove} onOpenEditor={handleOpenEditor} />
        ) : (
          <div className="max-w-xl">
            <FileImport onFilesAdded={handleFilesAdded} />
            <div className="mt-6 p-4 bg-[#0a0f1a] rounded-2xl border border-white/10">
              <p className="text-slate-600 text-xs uppercase tracking-wider mb-3">Supported Image Formats</p>
              <div className="flex flex-wrap gap-1.5">
                {['JPG', 'JPEG', 'PNG', 'GIF', 'WebP', 'BMP', 'SVG', 'TIFF', 'AVIF', 'HEIC', 'ICO'].map(f => (
                  <span key={f} className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{f}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
