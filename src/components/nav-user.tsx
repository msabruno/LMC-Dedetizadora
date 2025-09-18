// src/components/nav-user.tsx

"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  UserRound,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"


export function NavUser() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null)
  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut()
    if (!error) {  
        router.push("/");
      }
    };

  function setUserData(data: { name: string; email: string; avatar: string }) {
    setUser(data);
  }

  useEffect(() => {
    async function loadUser() {
      
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();
      
      

      if (session?.session?.user?.email) {
        console.log(session.session.user.email)
        const { data: userInfo } = await supabase
          .from("funcionario")
          .select()
          .eq("fun_email", session.session.user.email)
          .single();

        if (userInfo) {
          console.log(userInfo)
          setUserData({
            name: userInfo.fun_nome,
            email: userInfo.fun_email,
            avatar: userInfo.fun_avatar || "",
          });
        }
      }
    }
    loadUser()
    
  }, [])

  if(!user) return <p>Carregando...</p>

  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="dadosUsuario-[state=open]:bg-sidebar-accent dadosUsuario-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name}/>
                  <AvatarFallback className="rounded-lg">{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            
            <DropdownMenuSeparator />
            
            
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
                Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}