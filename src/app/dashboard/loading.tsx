import { Loader2 } from '@/components/icons';

// Fallback de Suspense para navegaciones dentro de /dashboard mientras el
// segmento siguiente carga sus datos (evita el parpadeo en blanco).
export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
