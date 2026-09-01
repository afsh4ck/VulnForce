
'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Upload, Link, GalleryHorizontal } from '@/components/icons';
import { useLanguage } from '@/context/language-context';
import { useData } from '@/context/data-context';
import type { ImageAsset } from '@/lib/types';
import { compressImageDataUrl } from '@/lib/image-compress';

export const ImageUploadDialog = ({ onInsert, children }: { onInsert: (markdown: string) => void, children: React.ReactNode }) => {
    const { language } = useLanguage();
    const { images, addImage } = useData();
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("upload");
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [url, setUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const t = {
        en: {
            title: "Insert Image",
            upload: "Upload",
            embed: "Embed Link",
            gallery: "Gallery",
            dropOrClick: "Drop image here, or click to browse",
            selectFile: "Select a file",
            imageUrl: "Image URL",
            insertImage: "Insert Image",
            noRecent: "No recent images.",
        },
        es: {
            title: "Insertar Imagen",
            upload: "Subir",
            embed: "Incrustar Enlace",
            gallery: "Galería",
            dropOrClick: "Arrastra una imagen aquí, o haz clic para buscar",
            selectFile: "Seleccionar un archivo",
            imageUrl: "URL de la Imagen",
            insertImage: "Insertar Imagen",
            noRecent: "No hay imágenes recientes.",
        }
    };
    
    const handleFileChange = useCallback((selectedFile: File | null) => {
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const raw = reader.result as string;
                setPreviewUrl(await compressImageDataUrl(raw));
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    }, []);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const resetAndClose = () => {
        setOpen(false);
        setFile(null);
        setPreviewUrl(null);
        setUrl('');
    }

    const handleInsert = () => {
        let markdown = '';
        if (activeTab === 'upload' && previewUrl) {
            const newImage = addImage(previewUrl);
            markdown = `![${file?.name || 'Uploaded Image'}](image://${newImage.id})`;
        } else if (activeTab === 'embed' && url) {
            markdown = `![Pasted Image](${url})`;
        }
        
        if (markdown) {
            onInsert(markdown);
        }
        
        resetAndClose();
    };

    const handleGalleryInsert = (image: ImageAsset) => {
        const markdown = `![Image from Gallery](image://${image.id})`;
        onInsert(markdown);
        resetAndClose();
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{t[language].title}</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upload"><Upload className="w-4 h-4 mr-2"/>{t[language].upload}</TabsTrigger>
                        <TabsTrigger value="embed"><Link className="w-4 h-4 mr-2"/>{t[language].embed}</TabsTrigger>
                        <TabsTrigger value="gallery"><GalleryHorizontal className="w-4 h-4 mr-2"/>{t[language].gallery}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                        <div
                            className="flex items-center justify-center w-full"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="max-h-full w-auto rounded-lg object-contain" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">{t[language].dropOrClick}</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF, etc.</p>
                                    </div>
                                )}
                                <input id="dropzone-file" type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
                            </label>
                        </div>
                    </TabsContent>
                    <TabsContent value="embed" className="mt-4 space-y-4">
                         <div className="space-y-2">
                             <label htmlFor="image-url" className="text-sm font-medium">{t[language].imageUrl}</label>
                             <Input id="image-url" type="url" placeholder="https://example.com/image.png" value={url} onChange={(e) => setUrl(e.target.value)} />
                         </div>
                         {url && (
                             <div className="flex justify-center p-4 border rounded-lg bg-muted">
                                 <img src={url} alt="URL Preview" className="max-h-64 w-auto rounded object-contain" />
                             </div>
                         )}
                    </TabsContent>
                    <TabsContent value="gallery" className="mt-4">
                        {images.length > 0 ? (
                           <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto p-1">
                             {images.map((image: ImageAsset) => (
                               <div key={image.id} className="relative aspect-square cursor-pointer group" onClick={() => handleGalleryInsert(image)}>
                                 <img src={image.dataUrl} alt="Gallery image" className="h-full w-full rounded-md object-cover" />
                                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <p className="text-white text-xs text-center">Insert</p>
                                 </div>
                               </div>
                             ))}
                           </div>
                        ) : (
                           <p className="text-sm text-muted-foreground text-center py-8">{t[language].noRecent}</p>
                        )}
                    </TabsContent>
                </Tabs>
                <DialogFooter>
                    {(activeTab === 'upload' || activeTab === 'embed') && (
                      <Button onClick={handleInsert} disabled={(!file && activeTab === 'upload') || (!url && activeTab === 'embed')}>
                          {t[language].insertImage}
                      </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
