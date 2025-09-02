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
          url: "#",
        },
        {
          title: "Listar OS's",
          url: "#",
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
          url: "#",
        },
        {
          title: "Listar clientes",
          url: "#",
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
          url: "#",
        },
        {
          title: "Listar funcionários",
          url: "#",
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
