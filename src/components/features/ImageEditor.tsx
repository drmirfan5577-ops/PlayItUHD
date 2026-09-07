import { useState } from 'react';
import { MediaFile, formatFileSize } from '@/types/media';
import { useImageEditor, IMAGE_FILTERS } from '@/hooks/useImageEditor';
import {
  RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Download,
  Undo, Redo, RefreshCw, Sun, Contrast, Droplets, Palette,
  Wind, Filter, Image
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageEditorProps {
  image: MediaFile | null;
  onClose?: () => void;
}

type EditorTab = 'adjust' | 'filters' | 'transform';

export default function ImageEditor({ image, onClose }: ImageEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('adjust');
  const {
    editorState, setEditorState,
    undo, redo, reset, rotate,
    getCSSFilter, getTransform,
    downloadImage, canUndo, canRedo,
  } = useImageEditor();

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
          <Image className="w-8 h-8 text-amber-400/50" />
        </div>
        <p className="text-slate-400">No image selected for editing</p>
        <p className="text-slate-600 text-sm mt-1">Select an image from the Gallery to edit</p>
      </div>
    );
  }

  const TABS: { id: EditorTab; label: string; icon: React.ElementType }[] = [
    { id: 'adjust', label: 'Adjust', icon: Sun },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'transform', label: 'Transform', icon: RotateCw },
  ];

  const ADJUST_CONTROLS = [
    { key: 'brightness' as const, label: 'Brightness', icon: Sun, min: 0, max: 200, default: 100, unit: '%' },
    { key: 'contrast' as const, label: 'Contrast', icon: Contrast, min: 0, max: 200, default: 100, unit: '%' },
    { key: 'saturation' as const, label: 'Saturation', icon: Droplets, min: 0, max: 300, default: 100, unit: '%' },
    { key: 'hue' as const, label: 'Hue Rotate', icon: Palette, min: -180, max: 180, default: 0, unit: '°' },
    { key: 'blur' as const, label: 'Blur', icon: Wind, min: 0, max: 10, default: 0, unit: 'px', step: 0.1 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Preview */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-[#0a0f1a] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[300px] lg:min-h-[400px] relative">
          <div
            className="checker-bg absolute inset-0 opacity-20"
            style={{ backgroundImage: 'repeating-conic-gradient(#444 0% 25%, transparent 0% 50%)', backgroundSize: '20px 20px' }}
          />
          <img
            src={image.url}
            alt={image.name}
            className="relative z-10 max-w-full max-h-full object-contain transition-all duration-300"
            style={{
              filter: getCSSFilter(),
              transform: getTransform(),
            }}
          />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between bg-[#0e1420] rounded-xl px-4 py-3 border border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Undo className="w-3.5 h-3.5" />
              Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Redo className="w-3.5 h-3.5" />
              Redo
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
          <button
            onClick={() => {
              downloadImage(image.url, image.name);
              toast.success('Image downloaded!');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="lg:w-72 bg-[#0e1420] rounded-2xl border border-white/10 overflow-hidden">
        {/* File info */}
        <div className="px-4 py-3 border-b border-white/10 bg-white/3">
          <p className="text-white text-sm font-medium truncate">{image.name}</p>
          <p className="text-slate-500 text-xs">{formatFileSize(image.size)}{image.width ? ` • ${image.width}×${image.height}` : ''}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-all',
                activeTab === id
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-slate-500 hover:text-slate-300'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[500px] custom-scroll">
          {/* Adjust Tab */}
          {activeTab === 'adjust' && ADJUST_CONTROLS.map(({ key, label, icon: Icon, min, max, default: def, unit, step }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300 text-xs font-medium">{label}</span>
                </div>
                <span className="text-cyan-400 text-xs font-mono">
                  {editorState[key]}{unit}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={step || 1}
                value={editorState[key]}
                onChange={(e) => setEditorState({ [key]: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 h-1.5"
              />
              <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                <span>{min}{unit}</span>
                <button onClick={() => setEditorState({ [key]: def })} className="text-slate-600 hover:text-slate-400 transition-colors">Reset</button>
                <span>{max}{unit}</span>
              </div>
            </div>
          ))}

          {/* Filters Tab */}
          {activeTab === 'filters' && (
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setEditorState({ filter: f.value })}
                  className={cn(
                    'relative rounded-xl overflow-hidden border-2 transition-all',
                    editorState.filter === f.value ? 'border-cyan-400' : 'border-transparent hover:border-white/20'
                  )}
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-600 to-slate-800 relative">
                    <img
                      src={image.url}
                      alt={f.name}
                      className="w-full h-full object-cover"
                      style={{ filter: f.css }}
                    />
                  </div>
                  <div className="py-1 bg-black/60 text-center">
                    <span className="text-[10px] text-white">{f.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Transform Tab */}
          {activeTab === 'transform' && (
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-xs mb-3">Rotation</p>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => rotate(-90)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-all">
                    <RotateCcw className="w-4 h-4" />
                    -90°
                  </button>
                  <button onClick={() => rotate(90)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-all">
                    <RotateCw className="w-4 h-4" />
                    +90°
                  </button>
                  <button onClick={() => rotate(180)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm transition-all col-span-2">
                    <RotateCw className="w-4 h-4" />
                    180°
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-3">Flip</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEditorState({ flipH: !editorState.flipH })}
                    className={cn('flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all border', editorState.flipH ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10')}
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    Horizontal
                  </button>
                  <button
                    onClick={() => setEditorState({ flipV: !editorState.flipV })}
                    className={cn('flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm transition-all border', editorState.flipV ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10')}
                  >
                    <FlipVertical className="w-4 h-4" />
                    Vertical
                  </button>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs mb-2">Current Rotation</p>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-cyan-400 text-2xl font-bold font-mono">{editorState.rotation}°</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
