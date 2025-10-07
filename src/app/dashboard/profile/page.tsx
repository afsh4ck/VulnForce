'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { Upload } from 'lucide-react';
import { useUser } from '@/context/user-context';

export default function ProfilePage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user, setUser } = useUser();
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [avatar, setAvatar] = React.useState(user.avatar);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar);
  }, [user]);

  const t = {
    en: {
      title: 'User Profile',
      description: 'Manage your profile information.',
      avatar: 'Avatar',
      upload: 'Upload',
      name: 'Name',
      email: 'Email',
      save: 'Save Changes',
      success: 'Profile updated successfully!',
      error: 'Could not update profile.',
      fileSelected: 'New profile picture selected.',
      uploadError: 'Please select an image file.',
    },
    es: {
      title: 'Perfil de Usuario',
      description: 'Gestiona la información de tu perfil.',
      avatar: 'Avatar',
      upload: 'Subir',
      name: 'Nombre',
      email: 'Email',
      save: 'Guardar Cambios',
      success: '¡Perfil actualizado correctamente!',
      error: 'No se pudo actualizar el perfil.',
      fileSelected: 'Nueva foto de perfil seleccionada.',
      uploadError: 'Por favor, selecciona un archivo de imagen.',
    },
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newAvatar = reader.result as string;
          setAvatar(newAvatar);
          toast({
            title: t[language].fileSelected,
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
            variant: 'destructive',
            title: t[language].uploadError,
        });
      }
    }
  };

  const handleSave = () => {
    setUser({ name, email, avatar });
    toast({
      title: t[language].success,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>

      <Card>
        <CardHeader>
          <CardDescription>{t[language].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                {t[language].upload}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t[language].name}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t[language].email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          
          <div>
            <Button onClick={handleSave}>{t[language].save}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
