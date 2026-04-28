'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { uploadImage } from '@/actions/upload';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

import { useParams } from 'next/navigation';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
  bucket?: string;
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className,
  bucket = 'public_images'
}: ImageUploadProps) {
  const params = useParams();
  const isAr = params?.lang === 'ar';
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Create a local preview immediately for better UX
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // 🚀 Step 1: Optional client-side compression to save bandwidth
      let fileToUpload = file;
      try {
        const { default: imageCompression } = await import('browser-image-compression');
        fileToUpload = await imageCompression(file, {
          maxSizeMB: 1.5,
          maxWidthOrHeight: 2560,
          useWebWorker: true,
        });
      } catch (err) {
        console.warn('Compression failed, using original', err);
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('bucket', bucket);

      // 🚀 Step 2: Server-side conversion to WebP and storage
      const result = await uploadImage(formData);

      if (result.success && result.url) {
        onChange(result.url);
        // The preview will be updated by the useEffect when 'value' changes
        toast({
          title: "Upload complete",
          description: "Image optimized and saved as WebP."
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong during the upload.",
        variant: "destructive"
      });
      // Revert preview on failure
      setPreviewUrl(value || null);
    } finally {
      setIsUploading(false);
      // Note: We don't revokeObjectURL here because it's being used by the img tag
      // It's better to let the browser handle it or use a cleanup effect
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange('');
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-colors overflow-hidden",
          previewUrl ? "border-primary/50 bg-card/50" : "border-muted-foreground/25 hover:border-primary/50 bg-muted/20 hover:bg-muted/40",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "animate-pulse"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
          disabled={disabled || isUploading}
        />

        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-contain p-2 z-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.classList.add('opacity-0');
                target.classList.add('invisible');
                const parent = target.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.image-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
            <div className="image-fallback hidden absolute inset-0 flex flex-col items-center justify-center bg-muted/20 z-10">
              <ImageIcon className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/30">Logo Missing</p>
            </div>
            {/* The remove button needs to be above the input to be clickable */}
            <div className="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled || isUploading}
                className="rounded-full h-8 w-8 shadow-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            {isUploading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
            ) : (
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
            )}
            <p className="text-sm font-medium text-muted-foreground text-center px-4">
              {isUploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "اضغط لرفع الصورة" : "Click to upload image")}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-tighter">
              SVG, PNG, JPG (max. 5MB)
            </p>
          </div>
        )}
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading to storage...
        </div>
      )}
    </div>
  );
}
