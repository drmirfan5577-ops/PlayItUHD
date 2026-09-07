import { useState, useCallback, useRef } from 'react';
import { ImageEditorState } from '@/types/media';

const DEFAULT_STATE: ImageEditorState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  rotation: 0,
  flipH: false,
  flipV: false,
  filter: 'none',
  cropMode: false,
};

export const IMAGE_FILTERS = [
  { name: 'None', value: 'none', css: '' },
  { name: 'Grayscale', value: 'grayscale', css: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia', css: 'sepia(100%)' },
  { name: 'Invert', value: 'invert', css: 'invert(100%)' },
  { name: 'Vintage', value: 'vintage', css: 'sepia(50%) contrast(120%) brightness(90%)' },
  { name: 'Cool', value: 'cool', css: 'hue-rotate(180deg) saturate(120%)' },
  { name: 'Warm', value: 'warm', css: 'hue-rotate(-30deg) saturate(130%) brightness(105%)' },
  { name: 'Dramatic', value: 'dramatic', css: 'contrast(150%) brightness(90%) saturate(80%)' },
  { name: 'Fade', value: 'fade', css: 'opacity(70%) brightness(110%) contrast(80%)' },
  { name: 'Vivid', value: 'vivid', css: 'saturate(200%) contrast(110%)' },
  { name: 'Noir', value: 'noir', css: 'grayscale(100%) contrast(150%) brightness(80%)' },
  { name: 'Bloom', value: 'bloom', css: 'brightness(120%) contrast(90%) saturate(120%)' },
];

export function useImageEditor() {
  const [editorState, setEditorState] = useState<ImageEditorState>({ ...DEFAULT_STATE });
  const [history, setHistory] = useState<ImageEditorState[]>([{ ...DEFAULT_STATE }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const pushHistory = useCallback((newState: ImageEditorState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { ...newState }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const updateState = useCallback((updates: Partial<ImageEditorState>) => {
    setEditorState(prev => {
      const newState = { ...prev, ...updates };
      pushHistory(newState);
      return newState;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setEditorState({ ...history[newIndex] });
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setEditorState({ ...history[newIndex] });
    }
  }, [historyIndex, history]);

  const reset = useCallback(() => {
    setEditorState({ ...DEFAULT_STATE });
    setHistory([{ ...DEFAULT_STATE }]);
    setHistoryIndex(0);
  }, []);

  const rotate = useCallback((degrees: number) => {
    updateState({ rotation: (editorState.rotation + degrees) % 360 });
  }, [editorState.rotation, updateState]);

  const getCSSFilter = useCallback(() => {
    const filterPreset = IMAGE_FILTERS.find(f => f.value === editorState.filter);
    const base = filterPreset?.css || '';
    return `brightness(${editorState.brightness}%) contrast(${editorState.contrast}%) saturate(${editorState.saturation}%) hue-rotate(${editorState.hue}deg) blur(${editorState.blur}px) ${base}`;
  }, [editorState]);

  const getTransform = useCallback(() => {
    const scaleX = editorState.flipH ? -1 : 1;
    const scaleY = editorState.flipV ? -1 : 1;
    return `rotate(${editorState.rotation}deg) scale(${scaleX}, ${scaleY})`;
  }, [editorState]);

  const downloadImage = useCallback((imageUrl: string, filename: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.filter = getCSSFilter();
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((editorState.rotation * Math.PI) / 180);
        ctx.scale(editorState.flipH ? -1 : 1, editorState.flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        ctx.restore();
      }
      const link = document.createElement('a');
      link.download = `edited_${filename}`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = imageUrl;
  }, [getCSSFilter, editorState]);

  return {
    editorState, setEditorState: updateState,
    undo, redo, reset, rotate,
    getCSSFilter, getTransform,
    downloadImage, canvasRef,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    IMAGE_FILTERS,
  };
}
