"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  ClipboardPlus,
  UserRound,
  IdCardLanyard
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "LMC",
      logo: GalleryVerticalEnd,
      plan: "Dedetizadora",
    },
  ],
  navMain: [
    {
      title: "Ordens de Serviço",
      url: "#",
      icon: ClipboardPlus,
      isActive: true,
      items: [
        {
          title: "Gerar nova OS",
          url: "/dashboard/os/cadastrar",
        },
        {
          title: "Listar OS's",
          url: "/dashboard/os/",
        
        },
      ],
    },
    {
      title: "Clientes",
      url: "#",
      icon: UserRound,
      items: [
        {
          title: "Cadastrar novo cliente",
          url: "/dashboard/clientes/cadastrar",
        },
        {
          title: "Listar clientes",
          url: "/dashboard/clientes",
        },
      ],
    },
    {
      title: "Funcionários",
      url: "#",
      icon: IdCardLanyard,
      items: [
        {
          title: "Cadastrar funcionário",
          url: "/dashboard/funcionarios/cadastrar",
        },
        {
          title: "Listar funcionários",
          url: "/dashboard/funcionarios/",
        },
        
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
  
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
