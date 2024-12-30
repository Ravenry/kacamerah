import { type Metadata } from "next"
import { ProjectsTable } from "./components/projects-table"
import { Shell } from "@/components/shell"
import { getProjects } from "@/app/_lib/api"
import { getViews } from "@/app/_lib/queries"

export const metadata: Metadata = {
    title: "Projects",
    description: "Manage your research projects",
}

interface ProjectsPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
    const projectsPromise = getProjects({
        page: searchParams.page?.toString(),
        per_page: searchParams.per_page?.toString(),
        sort: searchParams.sort?.toString(),
        name: searchParams.name?.toString(),
        status: searchParams.status?.toString(),
        service_type: searchParams.service_type?.toString(),
        business_type: searchParams.business_type?.toString(),
        industries: searchParams.industries?.toString(),
        regions: searchParams.regions?.toString(),
    })
    const viewsPromise = getViews()

    return (
        <Shell>
            {/* <Shell.Header>
                <Shell.Title>Projects</Shell.Title>
                <Shell.Description>
                    Manage your research projects and track their progress.
                </Shell.Description>
            </Shell.Header> */}
            <Shell.Content>
                <ProjectsTable
                    projectsPromise={projectsPromise}
                    viewsPromise={viewsPromise}
                />
            </Shell.Content>
        </Shell>
    )
} 