'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShieldCheck, FolderKanban, Users, Settings, FileText, PanelLeft, User, LayoutTemplate } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import { useLanguage } from '@/context/language-context';

function DashboardNav() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const { language } = useLanguage();
  const isCollapsed = state === 'collapsed';

  const t = {
    en: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      clients: 'Clients',
      vulnerabilities: 'Vulnerabilities',
      templates: 'Templates',
      settings: 'Settings',
      profile: 'Profile',
    },
    es: {
      dashboard: 'Dashboard',
      projects: 'Proyectos',
      clients: 'Clientes',
      vulnerabilities: 'Vulnerabilidades',
      templates: 'Plantillas',
      settings: 'Ajustes',
      profile: 'Perfil',
    },
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: t[language].dashboard },
    { href: '/dashboard/projects', icon: FolderKanban, label: t[language].projects },
    { href: '/dashboard/clients', icon: Users, label: t[language].clients },
    { href: '/dashboard/vulnerabilities', icon: ShieldCheck, label: t[language].vulnerabilities },
    { href: '/dashboard/templates', icon: LayoutTemplate, label: t[language].templates },
  ];
  
  const bottomNavItems = [
      { href: '/dashboard/profile', icon: User, label: t[language].profile },
      { href: '/dashboard/settings', icon: Settings, label: t[language].settings },
  ]

  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader>
          <Link href="/dashboard">
            <Logo isCollapsed={isCollapsed} />
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="mt-4">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
         <SidebarHeader>
          <SidebarMenu>
            {bottomNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
           <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <SidebarTrigger className="hidden md:flex" />
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <DashboardNav>{children}</DashboardNav>
    </SidebarProvider>
  )
}