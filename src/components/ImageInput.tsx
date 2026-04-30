import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showPreview?: boolean;
}

export default function ImageInput({ value, onChange, label, showPreview = true }: ImageInputProps) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large
        const MAX_SIZE = 800;
        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress as jpeg/webp to save firestore space
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onChange(dataUrl);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {label && <label className="text-sm font-bold text-primary-brown uppercase tracking-wider">{label}</label>}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            mode === 'url' ? 'bg-primary-yellow text-primary-brown' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <LinkIcon size={18} /> URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex-1 py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            mode === 'upload' ? 'bg-primary-yellow text-primary-brown' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <Upload size={18} /> Upload Image
        </button>
      </div>

      {mode === 'url' ? (
        <input 
          className="w-full bg-bg-cream border-transparent p-4 rounded-2xl focus:ring-2 ring-primary-yellow outline-none transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 p-8 rounded-2xl text-center cursor-pointer hover:border-primary-yellow hover:bg-primary-yellow/5 transition-all group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-primary-brown">
            <ImageIcon size={32} />
            <span className="font-medium">Klik untuk memilih gambar dari perangkat Anda</span>
          </div>
        </div>
      )}
      
      {showPreview && value && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">Preview:</p>
          <img src={value} alt="Preview" className="h-32 object-contain rounded-xl border border-gray-100 bg-white shadow-sm" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
