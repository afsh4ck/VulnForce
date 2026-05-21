'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';
import { useUser } from '@/context/user-context';
import { ImageUploadButton } from '@/components/image-upload-button';

export default function ProfilePage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { user, setUser } = useUser();
  const [name, setName] = React.useState(user.name);
  const [email, setEmail] = React.useState(user.email);
  const [avatar, setAvatar] = React.useState(user.avatar);
  const [role, setRole] = React.useState(user.role || '');
  const [company, setCompany] = React.useState(user.company || '');
  const [phone, setPhone] = React.useState(user.phone || '');
  const [website, setWebsite] = React.useState(user.website || '');
  const [location, setLocation] = React.useState(user.location || '');

  React.useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setAvatar(user.avatar);
    setRole(user.role || '');
    setCompany(user.company || '');
    setPhone(user.phone || '');
    setWebsite(user.website || '');
    setLocation(user.location || '');
  }, [user]);

  const t = {
    en: {
      title: 'Pentester Profile',
      description: 'These details can be included in your reports.',
      identitySection: 'Identity',
      contactSection: 'Contact',
      orgSection: 'Organization',
      avatar: 'Avatar / Logo',
      upload: 'Upload image',
      removeAvatar: 'Remove',
      name: 'Full name',
      role: 'Role / Title',
      company: 'Company',
      email: 'Email',
      phone: 'Phone',
      website: 'Website',
      location: 'Location',
      save: 'Save changes',
      success: 'Profile updated successfully.',
      fileSelected: 'New picture selected.',
      uploadError: 'Please select an image file.',
      avatarHint: 'PNG, JPG or SVG up to ~2MB. Recommended 256×256.',
    },
    es: {
      title: 'Perfil del Pentester',
      description: 'Estos datos pueden incluirse en tus reportes.',
      identitySection: 'Identidad',
      contactSection: 'Contacto',
      orgSection: 'Organización',
      avatar: 'Avatar / Logo',
      upload: 'Subir imagen',
      removeAvatar: 'Quitar',
      name: 'Nombre completo',
      role: 'Cargo / Rol',
      company: 'Empresa',
      email: 'Email',
      phone: 'Teléfono',
      website: 'Web',
      location: 'Ubicación',
      save: 'Guardar cambios',
      success: 'Perfil actualizado correctamente.',
      fileSelected: 'Nueva imagen seleccionada.',
      uploadError: 'Selecciona un archivo de imagen.',
      avatarHint: 'PNG, JPG o SVG hasta ~2MB. Recomendado 256×256.',
    },
  };

  const handleSave = () => {
    setUser({
      name,
      email,
      avatar,
      role,
      company,
      phone,
      website,
      location,
    });
    toast({ title: t[language].success });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="space-y-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>
        <p className="text-sm text-muted-foreground">{t[language].description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t[language].avatar}</CardTitle>
            <CardDescription>{t[language].avatarHint}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUploadButton
              value={avatar}
              onChange={(dataUrl) => {
                setAvatar(dataUrl);
                if (dataUrl) {
                  toast({ title: t[language].fileSelected });
                }
              }}
              aspect={1}
              cropShape="round"
              previewClassName="h-24 w-24"
              label={t[language].upload}
              cropTitle={t[language].avatar}
              outputSize={512}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t[language].identitySection}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t[language].name}</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t[language].role}</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Pentester" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t[language].company}</Label>
              <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t[language].location}</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Madrid, ES" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t[language].contactSection}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="email">{t[language].email}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t[language].phone}</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">{t[language].website}</Label>
              <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>{t[language].save}</Button>
      </div>
    </div>
  );
}
