'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Upload } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { ImageCropDialog } from '@/components/image-crop-dialog';

interface ImageUploadButtonProps {
  value: string | null | undefined;
  onChange: (dataUrl: string) => void;
  aspect: number;
  cropShape?: 'rect' | 'round';
  previewClassName?: string;
  label?: string;
  cropTitle?: string;
  outputSize?: number;
  showRemove?: boolean;
}

export function ImageUploadButton({
  value,
  onChange,
  aspect,
  cropShape = 'rect',
  previewClassName,
  label,
  cropTitle,
  outputSize = 512,
  showRemove = true,
}: ImageUploadButtonProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSrc, setDialogSrc] = useState<string | null>(null);

  const t = {
    en: {
      upload: label ?? 'Upload',
      edit: 'Edit image',
      remove: 'Remove',
      placeholder: 'No image',
      invalidFile: 'Please select a valid image file.',
    },
    es: {
      upload: label ?? 'Subir',
      edit: 'Editar imagen',
      remove: 'Quitar',
      placeholder: 'Sin imagen',
      invalidFile: 'Selecciona un archivo de imagen válido.',
    },
  };

  const openCropper = (src: string | null) => {
    setDialogSrc(src);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so selecting the same file again still triggers onChange.
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: t[language].invalidFile });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      openCropper(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const previewBaseShape = cropShape === 'round' ? 'rounded-full' : 'rounded-md';

  return (
    <div className="flex items-center gap-4">
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden border bg-muted',
          previewBaseShape,
          previewClassName ?? 'h-16 w-16'
        )}
      >
        {value ? (
          <img
            src={value}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="px-1 text-center text-[10px] uppercase tracking-wide text-muted-foreground">
            {t[language].placeholder}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-wrap gap-2">
        {!value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t[language].upload}
          </Button>
        )}
        {value && (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openCropper(value)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t[language].edit}
            </Button>
            {showRemove && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onChange('')}
                className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t[language].remove}
              </Button>
            )}
          </>
        )}
      </div>

      <ImageCropDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        imageSrc={dialogSrc}
        aspect={aspect}
        cropShape={cropShape}
        outputSize={outputSize}
        title={cropTitle}
        onConfirm={(dataUrl) => onChange(dataUrl)}
      />
    </div>
  );
}

export default ImageUploadButton;
