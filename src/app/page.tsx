
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function LoginPage() {
  const { user, login, setPassword, hasPassword } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [username, setUsername] = useState(user.name);
  const [password, setPasswordState] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Muy Débil', color: 'bg-destructive' });

  const t = {
    es: {
      welcome: "Bienvenido a VulnForce",
      description: "Tu herramienta profesional para informes de pentesting.",
      loginTitle: "Iniciar Sesión",
      usernameLabel: "Nombre de Usuario",
      passwordLabel: "Contraseña",
      loginButton: "Entrar",
      setupTitle: "Configura tu Contraseña",
      setupDescription: "Es tu primera vez. Por favor, establece una contraseña segura para tu cuenta.",
      newPasswordLabel: "Nueva Contraseña",
      confirmPasswordLabel: "Confirmar Contraseña",
      setPasswordButton: "Guardar Contraseña",
      errorTitle: "Error de autenticación",
      errorDescription: "Usuario o contraseña incorrectos.",
      passwordMismatch: "Las contraseñas no coinciden.",
      passwordSetSuccess: "Contraseña establecida correctamente. Ahora puedes iniciar sesión.",
      passwordStrengthWeak: "Débil",
      passwordStrengthMedium: "Media",
      passwordStrengthStrong: "Fuerte",
      passwordStrengthVeryStrong: "Muy Fuerte",
      passwordLengthError: "La contraseña debe tener al menos 8 caracteres.",
    }
  }

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    let label = t.es.passwordStrengthWeak;
    let color = 'bg-destructive';

    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score < 2) {
        label = t.es.passwordStrengthWeak;
        color = 'bg-destructive';
    } else if (score < 4) {
        label = t.es.passwordStrengthMedium;
        color = 'bg-yellow-500';
    } else if (score < 6) {
        label = t.es.passwordStrengthStrong;
        color = 'bg-blue-500';
    } else {
        label = t.es.passwordStrengthVeryStrong;
        color = 'bg-green-500';
    }
    setPasswordStrength({ score, label, color });
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPass = e.target.value;
    setNewPassword(newPass);
    checkPasswordStrength(newPass);
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: t.es.errorTitle,
        description: t.es.errorDescription,
      });
    }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ variant: 'destructive', title: t.es.passwordLengthError });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: t.es.passwordMismatch });
      return;
    }
    setPassword(newPassword);
    toast({ title: t.es.passwordSetSuccess });
    // Reset state to show login form
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!hasPassword) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <main className="flex flex-1 flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="items-center text-center">
              <div className="mb-4"><Logo /></div>
              <CardTitle className="font-headline text-3xl">{t.es.setupTitle}</CardTitle>
              <CardDescription className="text-base">{t.es.setupDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username-setup">{t.es.usernameLabel}</Label>
                  <Input id="username-setup" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t.es.newPasswordLabel}</Label>
                  <Input id="new-password" type="password" value={newPassword} onChange={handleNewPasswordChange} required />
                </div>
                {newPassword.length > 0 && (
                  <div className="space-y-2">
                    <Progress value={passwordStrength.score * (100/6)} className={passwordStrength.color} />
                    <p className="text-sm text-muted-foreground">{t.es[passwordStrength.label.replace(' ', '') as keyof typeof t.es]}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t.es.confirmPasswordLabel}</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">{t.es.setPasswordButton}</Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="items-center text-center">
            <div className="mb-4"><Logo /></div>
            <CardTitle className="font-headline text-3xl">{t.es.welcome}</CardTitle>
            <CardDescription className="text-base">{t.es.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t.es.usernameLabel}</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.es.passwordLabel}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPasswordState(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">{t.es.loginButton}</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
