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
          <CardTitle className="font-headline text-3xl">Welcome to VulnForce</CardTitle>
          <CardDescription className="text-base">
            Your professional pentesting reporting tool.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <p className="text-center text-muted-foreground">
            Streamline your security audits with efficient finding management, AI-powered suggestions, and professional report generation. All running locally on your machine.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/dashboard">Enter Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-8 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} VulnForce. All rights reserved.</p>
      </footer>
    </div>
  );
}
