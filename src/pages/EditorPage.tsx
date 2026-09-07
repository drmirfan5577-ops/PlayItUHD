import { useState, useCallback, useEffect } from 'react';
import { MediaFile } from '@/types/media';
import ImageEditor from '@/components/features/ImageEditor';
import FileImport from '@/components/features/FileImport';
import { Edit3, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function EditorPage() {
  const [editImage, setEditImage] = useState<MediaFile | null>(null);

  // Check if image was passed from gallery
  useEffect(() => {
    const stored = sessionStorage.getItem('editImage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as MediaFile;
        setEditImage(parsed);
        sessionStorage.removeItem('editImage');
      } catch (e) {
        console.log('Failed to parse stored image', e);
      }
    }
  }, []);

  const handleFilesAdded = useCallback((files: MediaFile[]) => {
    const imgFiles = files.filter(f => f.type === 'image');
    if (imgFiles.length === 0) {
      toast.error('Please open an image file');
      return;
    }
    setEditImage(imgFiles[0]);
    toast.success(`Opened: ${imgFiles[0].name}`);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a12] pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Image Editor</h1>
              <p className="text-slate-500 text-sm">Adjust · Filters · Transform · Export</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileImport onFilesAdded={handleFilesAdded} compact />
          </div>
        </div>

        {!editImage ? (
          <div className="max-w-xl mx-auto mt-16">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-10 h-10 text-amber-400/60" />
              </div>
              <h2 className="text-white text-xl font-bold mb-2">Open an Image to Edit</h2>
              <p className="text-slate-500 text-sm">Open any image or go to Gallery and click Edit on an image</p>
            </div>
            <FileImport onFilesAdded={handleFilesAdded} />

            {/* Features list */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { label: 'Brightness & Contrast', desc: 'Adjust lighting' },
                { label: 'Saturation & Hue', desc: 'Color correction' },
                { label: '12 Filter Presets', desc: 'Vintage, Noir, Cool...' },
                { label: 'Rotate & Flip', desc: 'Transform tools' },
                { label: 'Blur Control', desc: 'Gaussian blur' },
                { label: 'Export & Download', desc: 'Save edited image' },
              ].map(({ label, desc }) => (
                <div key={label} className="p-3 rounded-xl bg-white/3 border border-white/8">
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ImageEditor image={editImage} onClose={() => setEditImage(null)} />
        )}
      </div>
    </div>
  );
}
