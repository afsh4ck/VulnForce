'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileUp } from "lucide-react";
import { clients, projects, findings, vulnerabilities } from '@/lib/data';
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
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [backupFile, setBackupFile] = React.useState<File | null>(null);

  const handleCreateBackup = () => {
    const backupData = {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      data: {
        clients,
        projects,
        findings,
        vulnerabilities,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vulnforce-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Backup Created",
      description: "Your data has been successfully exported.",
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
          title: "Invalid File Type",
          description: "Please select a valid JSON backup file.",
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
        const parsedData = JSON.parse(text);
        
        // Here you would typically validate and process the data.
        // For this demo, we'll just log it and show a success message.
        console.log("Imported data:", parsedData);
        
        toast({
          title: "Import Successful",
          description: "Your data has been restored from the backup.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "The backup file is corrupted or not formatted correctly.",
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
      <h1 className="font-headline text-3xl font-bold tracking-tight">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Backup & Import</CardTitle>
          <CardDescription>
            Create a local backup of all your data or import an existing backup file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">Create Backup</h3>
              <p className="text-sm text-muted-foreground">Download a complete backup of your clients, projects, and findings.</p>
            </div>
            <Button onClick={handleCreateBackup}>
              <FileDown className="mr-2 h-4 w-4" /> Create Backup
            </Button>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between">
             <div>
              <h3 className="font-semibold">Import from Backup</h3>
              <p className="text-sm text-muted-foreground">Restore data from a .json backup file. This will overwrite existing data.</p>
            </div>
            <div>
              <Label htmlFor="backup-file" className="sr-only">Import Backup</Label>
              <Input id="backup-file" type="file" accept=".json" onChange={handleFileChange} className="hidden" />
              <Button onClick={() => document.getElementById('backup-file')?.click()}>
                <FileUp className="mr-2 h-4 w-4" /> Import Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to import this backup?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Importing a backup will overwrite all current data. Please ensure you have a recent backup of your current data if you wish to restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBackupFile(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImport}>Continue Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
