'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewProjectDialog } from "@/components/new-project-dialog";

export default function NewProjectPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      router.push('/dashboard/projects');
    }
  };

  return (
    <NewProjectDialog
      open={open}
      onOpenChange={handleOpenChange}
      onCreated={(id) => router.push(`/dashboard/projects/${id}`)}
    />
  );
}
