'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Eye, EyeOff, Trash2 } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { useUser } from "@/context/user-context";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const { changePassword, logout } = useUser();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


  const t = {
    en: {
      title: "Settings",
      changePasswordTitle: "Change Password",
      changePasswordDesc: "Update your account password.",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      confirmNewPasswordLabel: "Confirm New Password",
      updatePasswordBtn: "Update Password",
      passwordUpdateSuccess: "Password updated successfully!",
      passwordUpdateError: "Could not update password. Check your current password.",
      passwordMismatch: "New passwords do not match.",
      deleteAccountTitle: "Delete Account",
      deleteAccountDesc: "Permanently delete your account and all associated data.",
      deleteAccountBtn: "Delete Account",
      confirmDeleteTitle: "Are you sure you want to delete your account?",
      confirmDeleteDesc: "This action cannot be undone. All your data, including clients, projects, and findings, will be permanently deleted. Make sure you have a backup if you wish to restore your data later.",
      cancel: "Cancel",
      delete: "Delete",
    },
    es: {
      title: "Ajustes",
      changePasswordTitle: "Cambiar Contraseña",
      changePasswordDesc: "Actualiza la contraseña de tu cuenta.",
      currentPasswordLabel: "Contraseña Actual",
      newPasswordLabel: "Nueva Contraseña",
      confirmNewPasswordLabel: "Confirmar Nueva Contraseña",
      updatePasswordBtn: "Actualizar Contraseña",
      passwordUpdateSuccess: "¡Contraseña actualizada correctamente!",
      passwordUpdateError: "No se pudo actualizar la contraseña. Verifica tu contraseña actual.",
      passwordMismatch: "Las nuevas contraseñas no coinciden.",
      deleteAccountTitle: "Eliminar Cuenta",
      deleteAccountDesc: "Elimina permanentemente tu cuenta y todos los datos asociados.",
      deleteAccountBtn: "Eliminar Cuenta",
      confirmDeleteTitle: "¿Estás seguro de que quieres eliminar tu cuenta?",
      confirmDeleteDesc: "Esta acción no se puede deshacer. Todos tus datos, incluyendo clientes, proyectos y hallazgos, serán eliminados permanentemente. Asegúrate de tener una copia de seguridad si deseas restaurar tus datos más tarde.",
      cancel: "Cancelar",
      delete: "Eliminar",
    }
  }

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      toast({ variant: 'destructive', title: t[language].passwordMismatch });
      return;
    }
    if (changePassword(currentPassword, newPassword)) {
      toast({ title: t[language].passwordUpdateSuccess });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      toast({ variant: 'destructive', title: t[language].passwordUpdateError });
    }
  };

  const handleDeleteAccount = () => {
    logout(true); // Pass true to indicate a full account deletion and data wipe
  }


  return (
    <>
      <div className="space-y-6 p-4 sm:p-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>

        <Card>
            <CardHeader>
                <CardTitle>{t[language].changePasswordTitle}</CardTitle>
                <CardDescription>{t[language].changePasswordDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="current-password">{t[language].currentPasswordLabel}</Label>
                    <div className="relative">
                        <Input id="current-password" type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowCurrentPassword(false)} />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowCurrentPassword(true)} />
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="new-password">{t[language].newPasswordLabel}</Label>
                         <div className="relative">
                            <Input id="new-password" type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showNewPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(false)} />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowNewPassword(true)} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-new-password">{t[language].confirmNewPasswordLabel}</Label>
                        <div className="relative">
                            <Input id="confirm-new-password" type={showConfirmNewPassword ? 'text' : 'password'} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                {showConfirmNewPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmNewPassword(false)} />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 cursor-pointer" onClick={() => setShowConfirmNewPassword(true)} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button onClick={handlePasswordChange}><KeyRound className="mr-2" />{t[language].updatePasswordBtn}</Button>
                </div>
            </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">{t[language].deleteAccountTitle}</CardTitle>
            <CardDescription>{t[language].deleteAccountDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2" />
                  {t[language].deleteAccountBtn}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t[language].confirmDeleteTitle}</AlertDialogTitle>
                  <AlertDialogDescription>{t[language].confirmDeleteDesc}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t[language].cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t[language].delete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
      </>
  );
}
