'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Upload } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  aspect: number;
  onConfirm: (croppedDataUrl: string) => void;
  title?: string;
  outputSize?: number;
  cropShape?: 'rect' | 'round';
}

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });

async function getCroppedImg(
  imageSrc: string,
  areaPixels: Area,
  outputSize: number
): Promise<string> {
  const image = await loadImage(imageSrc);

  const sourceWidth = Math.max(1, Math.round(areaPixels.width));
  const sourceHeight = Math.max(1, Math.round(areaPixels.height));

  // Scale the output so the longer side matches `outputSize`, but never upscale.
  const longestSide = Math.max(sourceWidth, sourceHeight);
  const scale = longestSide > outputSize ? outputSize / longestSide : 1;

  const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(
    image,
    areaPixels.x,
    areaPixels.y,
    areaPixels.width,
    areaPixels.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return canvas.toDataURL('image/png');
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  aspect,
  onConfirm,
  title,
  outputSize = 512,
  cropShape = 'rect',
}: ImageCropDialogProps) {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [internalSrc, setInternalSrc] = useState<string | null>(imageSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    en: {
      title: title ?? 'Edit image',
      description: 'Drag to reposition, use the slider to zoom.',
      zoom: 'Zoom',
      loadAnother: 'Load another image',
      cancel: 'Cancel',
      confirm: 'Apply',
      noImage: 'Select an image to start cropping.',
      pickImage: 'Choose image',
      invalidFile: 'Please select a valid image file.',
      cropError: 'Could not crop the image.',
    },
    es: {
      title: title ?? 'Editar imagen',
      description: 'Arrastra para reposicionar y usa el slider para hacer zoom.',
      zoom: 'Zoom',
      loadAnother: 'Cargar otra imagen',
      cancel: 'Cancelar',
      confirm: 'Aplicar',
      noImage: 'Selecciona una imagen para empezar a recortar.',
      pickImage: 'Elegir imagen',
      invalidFile: 'Selecciona un archivo de imagen válido.',
      cropError: 'No se pudo recortar la imagen.',
    },
  };

  // Sync external src when the dialog opens.
  useEffect(() => {
    if (open) {
      setInternalSrc(imageSrc);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    }
  }, [open, imageSrc]);

  // If opened without a source, prompt for a file immediately.
  useEffect(() => {
    if (open && !internalSrc) {
      // Defer so the dialog mounts first.
      const id = window.setTimeout(() => fileInputRef.current?.click(), 50);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open, internalSrc]);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: t[language].invalidFile });
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setInternalSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = async () => {
    if (!internalSrc || !croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const dataUrl = await getCroppedImg(internalSrc, croppedAreaPixels, outputSize);
      onConfirm(dataUrl);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({ variant: 'destructive', title: t[language].cropError });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{t[language].title}</DialogTitle>
          <DialogDescription>{t[language].description}</DialogDescription>
        </DialogHeader>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        {internalSrc ? (
          <div className="space-y-4">
            <div className="relative h-[320px] w-full overflow-hidden rounded-md bg-muted">
              <Cropper
                image={internalSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={cropShape}
                showGrid={false}
                objectFit="contain"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                {t[language].zoom}
              </Label>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={(value) => setZoom(value[0] ?? 1)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-[320px] flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-muted/40 text-center">
            <p className="text-sm text-muted-foreground">{t[language].noImage}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {t[language].pickImage}
            </Button>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t[language].loadAnother}
          </Button>
          <div className="flex gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t[language].cancel}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!internalSrc || !croppedAreaPixels || isProcessing}
            >
              {t[language].confirm}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImageCropDialog;
