import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <div className="mb-4">
            <Logo />
          </div>
          <CardTitle className="font-headline text-3xl">Bienvenido a VulnForce</CardTitle>
          <CardDescription className="text-base">
            Tu herramienta profesional para informes de pentesting.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-center text-muted-foreground">
            Agiliza tus auditorías de seguridad con gestión eficiente de hallazgos, sugerencias potenciadas por IA y generación de informes profesionales. Todo ejecutándose localmente en tu máquina.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/dashboard">Entrar al Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} VulnForce. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}