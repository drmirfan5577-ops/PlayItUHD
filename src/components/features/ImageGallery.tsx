import { useState } from 'react';
import { MediaFile, formatFileSize } from '@/types/media';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, RotateCcw, Info, Edit3 } from 'lucide-react';
import ResolutionBadge from './ResolutionBadge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ImageGalleryProps {
  images: MediaFile[];
  onRemove?: (id: string) => void;
  onOpenEditor?: (image: MediaFile) => void;
}

export default function ImageGallery({ images, onRemove, onOpenEditor }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const navigate = useNavigate();

  const lightboxImage = lightboxIndex !== null ? images[lightboxIndex] : null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setZoom(1);
    setRotation(0);
    setShowInfo(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoom(1);
    setRotation(0);
  };

  const goNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
    setZoom(1);
    setRotation(0);
  };

  const goPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
    setZoom(1);
    setRotation(0);
  };

  const downloadImage = (img: MediaFile) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `${img.name}.${img.mimeType.split('/')[1] || 'jpg'}`;
    a.click();
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-slate-400">No images added yet</p>
        <p className="text-slate-600 text-sm mt-1">Add images to view your gallery</p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {images.map((img, index) => (
          <div
            key={img.id}
            className="relative group aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-emerald-500/40 transition-all"
            onClick={() => openLightbox(index)}
          >
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {img.resolution && img.resolution !== 'Unknown' && (
              <div className="absolute top-1.5 left-1.5">
                <ResolutionBadge resolution={img.resolution} size="sm" />
              </div>
            )}
            {onRemove && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(img.id); }}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs truncate">{img.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="relative w-full h-full flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/60">
              <div className="flex items-center gap-3">
                <h3 className="text-white font-medium truncate max-w-xs">{lightboxImage.name}</h3>
                {lightboxImage.resolution && <ResolutionBadge resolution={lightboxImage.resolution} />}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.min(z + 0.25, 4))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button onClick={() => setRotation(r => r + 90)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => setShowInfo(!showInfo)} className={cn('w-8 h-8 rounded-lg flex items-center justify-center transition-all', showInfo ? 'bg-cyan-500/30 text-cyan-400' : 'bg-white/10 hover:bg-white/20 text-white')}>
                  <Info className="w-4 h-4" />
                </button>
                {onOpenEditor && (
                  <button
                    onClick={() => { onOpenEditor(lightboxImage); closeLightbox(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 rounded-lg text-sm transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                )}
                <button onClick={() => downloadImage(lightboxImage)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={closeLightbox} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Area */}
            <div className="flex-1 flex items-center justify-center overflow-hidden relative">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.name}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
              />

              {/* Nav buttons */}
              {images.length > 1 && (
                <>
                  <button onClick={goPrev} className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={goNext} className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Info Panel */}
            {showInfo && (
              <div className="absolute right-4 top-20 bg-black/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 min-w-[200px]">
                <h4 className="text-white text-sm font-semibold mb-3">File Info</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Size', value: formatFileSize(lightboxImage.size) },
                    { label: 'Type', value: lightboxImage.mimeType },
                    { label: 'Dimensions', value: lightboxImage.width ? `${lightboxImage.width} × ${lightboxImage.height}` : 'Unknown' },
                    { label: 'Resolution', value: lightboxImage.resolution || 'Unknown' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-slate-500 text-xs">{label}</span>
                      <span className="text-slate-300 text-xs font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Counter */}
            <div className="text-center py-3 text-slate-500 text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>

            {/* Thumbnails strip */}
            <div className="flex gap-1.5 justify-center pb-4 px-4 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => { setLightboxIndex(i); setZoom(1); setRotation(0); }}
                  className={cn(
                    'w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all',
                    i === lightboxIndex ? 'border-cyan-400 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                  )}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
