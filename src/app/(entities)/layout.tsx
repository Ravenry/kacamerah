'use client'

import { AppSidebar } from "../../components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import { Users, FolderKanban, Building2, UserCog } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface DashboardLayoutProps {
    children: React.ReactNode
    params: { section?: string }
}

const sectionConfig: Record<string, { title: string, icon: LucideIcon }> = {
    '/freelancers': {
        title: 'Freelancers',
        icon: Users
    },
    '/projects': {
        title: 'Projects',
        icon: FolderKanban
    },
    '/clients': {
        title: 'Clients',
        icon: Building2
    },
    '/users': {
        title: 'Users',
        icon: UserCog
    },
    '/staff': {
        title: 'Staff',
        icon: UserCog
    }
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()
    const section = sectionConfig[`/${pathname.split('/')[1]}`]

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center border-b">
                    <div className="flex items-center gap-4 px-6">
                        <SidebarTrigger className="-ml-2" />
                        <Separator orientation="vertical" className="h-6" />
                        {section && (
                            <div className="flex items-center gap-3">
                                <section.icon className="h-5 w-5 text-muted-foreground" />
                                <h1 className="text-lg font-semibold">{section.title}</h1>
                            </div>
                        )}
                    </div>
                </header>

                <main className="flex flex-col gap-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

