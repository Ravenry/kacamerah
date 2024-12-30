import { type Metadata } from "next"
import { ClientsTable } from "./components/clients-table"
import { Shell } from "@/components/shell"
import { getClients } from "@/app/_lib/api"
import { getViews } from "@/app/_lib/queries"

export const metadata: Metadata = {
    title: "Clients",
    description: "Manage your client relationships",
}

interface ClientsPageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

export default function ClientsPage({ searchParams }: ClientsPageProps) {
    const clientsPromise = getClients({
        page: searchParams.page?.toString(),
        per_page: searchParams.per_page?.toString(),
        sort: searchParams.sort?.toString(),
        name: searchParams.name?.toString(),
        email: searchParams.email?.toString(),
        organization_type: searchParams.organization_type?.toString(),
        industry: searchParams.industry?.toString(),
        location: searchParams.location?.toString(),
    })
    const viewsPromise = getViews()

    return (
        <Shell>
            {/* <Shell.Header>
                <Shell.Title>Clients</Shell.Title>
                <Shell.Description>
                    Manage your client relationships and track their projects.
                </Shell.Description>
            </Shell.Header> */}
            <Shell.Content>
                <ClientsTable
                    clientsPromise={clientsPromise}
                    viewsPromise={viewsPromise}
                />
            </Shell.Content>
        </Shell>
    )
} 