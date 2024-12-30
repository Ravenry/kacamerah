"use client"

import * as React from "react"
import { LayoutDashboard, Briefcase, Users, UserCircle, Settings2 } from 'lucide-react'

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

const data = {
    user: {
        name: "Admin User",
        email: "admin@example.com",
        avatar: "/avatars/admin-user.jpg",
    },
    teams: [
        {
            name: "Research Co.",
            logo: LayoutDashboard,
            plan: "Enterprise",
        },
    ],
    navMain: [
        {
            title: "Users",
            url: "/users",
            icon: UserCircle,
        },
        {
            title: "Freelancers",
            url: "/freelancers",
            icon: Users,
        },
        {
            title: "Clients",
            url: "/clients",
            icon: Users,
        },
        {
            title: "Staff",
            url: "/staff",
            icon: Users,
        },
        {
            title: "Projects",
            url: "/projects",
            icon: Briefcase,
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
            {/* <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter> */}
            <SidebarRail />
        </Sidebar>
    )
}

