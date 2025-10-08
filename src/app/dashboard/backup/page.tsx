'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/language-context";
import { useData } from "@/context/data-context";

export default function BackupPage() {
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [backupFile, setBackupFile] = React.useState<File | null>(null);
  const { language } = useLanguage();
  const { exportData, importData } = useData();

  const t = {
    en: {
      title: "Backup & Import",
      description: "Create a local backup of all your data or import an existing backup file.",
      createBackupTitle: "Create Backup",
      createBackupDesc: "Download a complete backup of your clients, projects, and findings.",
      createBackupBtn: "Create Backup",
      backupCreated: "Backup Created",
      backupCreatedDesc: "Your data has been successfully exported.",
      importBackupTitle: "Import from Backup",
      importBackupDesc: "Restore data from a .json backup file. This will overwrite existing data.",
      importBackupBtn: "Import Backup",
      invalidFileType: "Invalid File Type",
      invalidFileTypeDesc: "Please select a valid JSON backup file.",
      importSuccess: "Import Successful",
      importSuccessDesc: "Your data has been restored from the backup.",
      importFailed: "Import Failed",
      importFailedDesc: "The backup file is corrupted or not formatted correctly.",
      confirmImportTitle: "Are you sure you want to import this backup?",
      confirmImportDesc: "This action cannot be undone. Importing a backup will overwrite all current data. Please ensure you have a recent backup of your current data if you wish to restore it later.",
      cancel: "Cancel",
      continueImport: "Continue Import",
    },
    es: {
      title: "Copia de Seguridad e Importación",
      description: "Crea una copia de seguridad local de todos tus datos o importa un archivo de copia de seguridad existente.",
      createBackupTitle: "Crear Copia de Seguridad",
      createBackupDesc: "Descarga una copia de seguridad completa de tus clientes, proyectos y hallazgos.",
      createBackupBtn: "Crear Copia",
      backupCreated: "Copia de Seguridad Creada",
      backupCreatedDesc: "Tus datos han sido exportados exitosamente.",
      importBackupTitle: "Importar desde Copia de Seguridad",
      importBackupDesc: "Restaura datos desde un archivo de copia de seguridad .json. Esto sobrescribirá los datos existentes.",
      importBackupBtn: "Importar Copia",
      invalidFileType: "Tipo de Archivo Inválido",
      invalidFileTypeDesc: "Por favor, selecciona un archivo de copia de seguridad JSON válido.",
      importSuccess: "Importación Exitosa",
      importSuccessDesc: "Tus datos han sido restaurados desde la copia de seguridad.",
      importFailed: "Importación Fallida",
      importFailedDesc: "El archivo de copia de seguridad está corrupto o no tiene el formato correcto.",
      confirmImportTitle: "¿Estás seguro de que quieres importar esta copia de seguridad?",
      confirmImportDesc: "Esta acción no se puede deshacer. Importar una copia de seguridad sobrescribirá todos los datos actuales. Asegúrate de tener una copia de seguridad reciente de tus datos actuales si deseas restaurarlos más tarde.",
      cancel: "Cancelar",
      continueImport: "Continuar Importación",
    }
  }

  const handleCreateBackup = () => {
    exportData();
    toast({
      title: t[language].backupCreated,
      description: t[language].backupCreatedDesc,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === 'application/json') {
        setBackupFile(file);
        setShowConfirmDialog(true);
      } else {
        toast({
          variant: "destructive",
          title: t[language].invalidFileType,
          description: t[language].invalidFileTypeDesc,
        });
      }
    }
  };

  const handleImport = () => {
    if (!backupFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        importData(text);
        
        toast({
          title: t[language].importSuccess,
          description: t[language].importSuccessDesc,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: t[language].importFailed,
          description: t[language].importFailedDesc,
        });
      } finally {
        setShowConfirmDialog(false);
        setBackupFile(null);
      }
    };
    reader.readAsText(backupFile);
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight">{t[language].title}</h1>

        <div className="space-y-4">
            <div className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold">{t[language].createBackupTitle}</h3>
                <p className="text-sm text-muted-foreground">{t[language].createBackupDesc}</p>
              </div>
              <Button onClick={handleCreateBackup}>
                <FileDown className="mr-2 h-4 w-4" /> {t[language].createBackupBtn}
              </Button>
            </div>
            <div className="flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:flex-row md:items-center md:justify-between">
               <div>
                <h3 className="font-semibold">{t[language].importBackupTitle}</h3>
                <p className="text-sm text-muted-foreground">{t[language].importBackupDesc}</p>
              </div>
              <div>
                <Label htmlFor="backup-file" className="sr-only">{t[language].importBackupBtn}</Label>
                <Input id="backup-file" type="file" accept=".json" onChange={handleFileChange} className="hidden" />
                <Button onClick={() => document.getElementById('backup-file')?.click()}>
                  <FileUp className="mr-2 h-4 w-4" /> {t[language].importBackupBtn}
                </Button>
              </div>
            </div>
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t[language].confirmImportTitle}</AlertDialogTitle>
              <AlertDialogDescription>
                {t[language].confirmImportDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBackupFile(null)}>{t[language].cancel}</AlertDialogCancel>
              <AlertDialogAction onClick={handleImport}>{t[language].continueImport}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
