
'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Home, ShieldCheck, FolderKanban, Users, Settings, FileText, PanelLeft, User, LayoutTemplate, History, Bomb } from 'lucide-react';

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

type UseLeavePageHook = (hasChanges: boolean) => void;

const LeavePageContext = React.createContext<{
    setHasUnsavedChanges: UseLeavePageHook;
    handleRequestLeave: (path: string) => void;
} | null>(null);

export const useLeavePage = () => {
    const context = React.useContext(LeavePageContext);
    if (!context) {
        throw new Error('useLeavePage must be used within a LeavePageProvider');
    }
    return context.setHasUnsavedChanges;
};


function DashboardNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const { language } = useLanguage();
  const router = useRouter();
  const isCollapsed = state === 'collapsed';

  const hasUnsavedChangesRef = React.useRef(false);
  const setHasUnsavedChanges = (hasChanges: boolean) => {
    hasUnsavedChangesRef.current = hasChanges;
  };

  const handleRequestLeave = (path: string) => {
    if (hasUnsavedChangesRef.current) {
        window.dispatchEvent(new CustomEvent('requestLeave', { detail: path }));
    } else {
        router.push(path);
    }
  }

  const handleLeaveClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleRequestLeave(path);
  };
  

  const t = {
    en: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      clients: 'Clients',
      findings: 'Findings',
      vulnerabilities: 'Vulnerabilities',
      templates: 'Templates',
      backup: 'Backup',
      settings: 'Settings',
      profile: 'Profile',
    },
    es: {
      dashboard: 'Dashboard',
      projects: 'Proyectos',
      clients: 'Clientes',
      findings: 'Hallazgos',
      vulnerabilities: 'Vulnerabilidades',
      templates: 'Plantillas',
      backup: 'Backup',
      settings: 'Ajustes',
      profile: 'Perfil',
    },
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: t[language].dashboard },
    { href: '/dashboard/projects', icon: FolderKanban, label: t[language].projects },
    { href: '/dashboard/findings', icon: Bomb, label: t[language].findings },
    { href: '/dashboard/clients', icon: Users, label: t[language].clients },
    { href: '/dashboard/vulnerabilities', icon: ShieldCheck, label: t[language].vulnerabilities },
    { href: '/dashboard/templates', icon: LayoutTemplate, label: t[language].templates },
    { href: '/dashboard/backup', icon: History, label: t[language].backup },
  ];
  
  const bottomNavItems = [
      { href: '/dashboard/profile', icon: User, label: t[language].profile },
      { href: '/dashboard/settings', icon: Settings, label: t[language].settings },
  ]

  const NavLink = ({ item }: { item: { href: string, icon: React.ElementType, label: string } }) => {
    return (
      <Link href={item.href} onClick={handleLeaveClick(item.href)}>
        <item.icon />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <LeavePageContext.Provider value={{ setHasUnsavedChanges, handleRequestLeave }}>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
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
                    <NavLink item={item} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
         <SidebarHeader className="pb-20">
          <SidebarMenu>
            {bottomNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label }}
                >
                    <NavLink item={item} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b bg-background px-4 sm:px-6 h-16">
           <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <SidebarTrigger className="hidden md:flex" />
          </div>
          <UserNav />
        </header>
        <main className="flex-1">{children}</main>
      </SidebarInset>
    </LeavePageContext.Provider>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardNav>{children}</DashboardNav>
    </SidebarProvider>
  )
}
