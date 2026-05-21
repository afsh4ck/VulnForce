'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { User } from "@/components/icons";

export function UserNav() {
    const { language } = useLanguage();
    const { user, logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    }

    const t = {
      en: {
        profile: "Profile",
        settings: "Settings",
        logout: "Log out"
      },
      es: {
        profile: "Perfil",
        settings: "Ajustes",
        logout: "Cerrar sesión"
      }
    }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden"
          aria-label={user.name}
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person avatar" />
            <AvatarFallback className="bg-transparent">
              {user.avatar ? user.name.charAt(0) : <User className="h-4 w-4 text-primary" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">{t[language].profile}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">{t[language].settings}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {t[language].logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
