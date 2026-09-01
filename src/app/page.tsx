'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff } from '@/components/icons';
import Link from 'next/link';

export default function LoginPage() {
  const { user, login, setPassword, hasPassword, forgotPassword } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [username, setUsername] = useState(user.name);
  const [password, setPasswordState] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Muy Débil', color: 'bg-destructive' });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user.name) {
      setUsername(user.name);
    }
  }, [user.name]);


  const t = {
    es: {
      welcome: "Bienvenido a VulnForce",
      description: "Tu herramienta profesional para informes de pentesting.",
      loginTitle: "Iniciar Sesión",
      usernameLabel: "Nombre de Usuario",
      passwordLabel: "Contraseña",
      loginButton: "Entrar",
      setupTitle: "Crear usuario",
      setupDescription: "Es tu primera vez. Por favor, crea un usuario y una contraseña segura.",
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
      forgotPassword: "¿Olvidaste tu contraseña?",
      passwordReset: "Contraseña reiniciada. Por favor, establece una nueva.",
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPassword()) {
        toast({
            variant: 'destructive',
            title: t.es.setupTitle,
            description: t.es.setupDescription,
        });
        return;
    }
    if (await login(username, password)) {
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: t.es.errorTitle,
        description: t.es.errorDescription,
      });
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ variant: 'destructive', title: t.es.passwordLengthError });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: 'destructive', title: t.es.passwordMismatch });
      return;
    }
    await setPassword(username, newPassword);
    toast({ title: t.es.passwordSetSuccess });
  };

  const handleForgotPassword = () => {
    forgotPassword();
    toast({
      title: t.es.passwordReset,
    });
  };

  if (!hasPassword()) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
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
                    <div className="relative">
                      <Input id="new-password" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={handleNewPasswordChange} required />
                       <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(false)} />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(true)} />
                        )}
                       </div>
                    </div>
                </div>
                {newPassword.length > 0 && (
                    <div className="space-y-2">
                    <Progress value={passwordStrength.score * (100/6)} className={passwordStrength.color} />
                    <p className="text-sm text-muted-foreground">{passwordStrength.label}</p>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t.es.confirmPasswordLabel}</Label>
                     <div className="relative">
                        <Input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(false)} />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmPassword(true)} />
                        )}
                       </div>
                    </div>
                </div>
                <Button type="submit" className="w-full !mt-6">{t.es.setPasswordButton}</Button>
                </form>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Developed by{' '}
                    <a
                        href="https://github.com/afsh4ck"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-primary"
                    >
                        afsh4ck
                    </a>
                </p>
            </CardContent>
            </Card>
        </main>
      );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
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
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t.es.passwordLabel}</Label>
                     <Button variant="link" type="button" onClick={handleForgotPassword} className="p-0 h-auto text-xs">
                        {t.es.forgotPassword}
                    </Button>
                </div>
               <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPasswordState(e.target.value)} required />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(false)} />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowPassword(true)} />
                    )}
                  </div>
              </div>
            </div>
            <Button type="submit" className="w-full !mt-8">{t.es.loginButton}</Button>
          </form>
           <p className="mt-4 text-center text-xs text-muted-foreground">
              Developed by{' '}
              <a
                  href="https://github.com/afsh4ck"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
              >
                  afsh4ck
              </a>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
