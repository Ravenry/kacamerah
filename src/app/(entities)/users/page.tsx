import * as React from "react"
import { type UserSearchParams, userSearchParamsSchema } from "@/app/_lib/validations"
import { Shell } from "@/components/shell"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { type ViewItem } from "@/components/data-table/advanced/views/data-table-views-dropdown"
import { UsersTable } from "./components/users-table"
import { type User } from "./components/users-table-columns"
import { headers } from "next/headers"

interface UsersPageProps {
    searchParams: Record<string, string | string[] | undefined>
}

interface UsersResponse {
    data: User[]
    pageCount: number
}

function getBaseUrl() {
    const headersList = headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.includes("localhost") ? "http" : "https"
    return `${protocol}://${host}`
}

async function getUsers(searchParams: Record<string, string | string[] | undefined>): Promise<UsersResponse> {
    // Parse and validate searchParams with defaults
    const validatedParams = userSearchParamsSchema.parse({
        page: searchParams.page ? Number(searchParams.page) : undefined,
        per_page: searchParams.per_page ? Number(searchParams.per_page) : undefined,
        sort: searchParams.sort,
        name: searchParams.name,
        email: searchParams.email,
        role: searchParams.role,
        status: searchParams.status,
    })

    const baseUrl = getBaseUrl()
    const url = new URL("/api/users", baseUrl)
    url.search = new URLSearchParams({
        page: validatedParams.page.toString(),
        per_page: validatedParams.per_page.toString(),
        ...(validatedParams.sort && { sort: validatedParams.sort }),
        ...(validatedParams.name && { name: validatedParams.name }),
        ...(validatedParams.email && { email: validatedParams.email }),
        ...(validatedParams.role && { role: validatedParams.role }),
        ...(validatedParams.status && { status: validatedParams.status }),
    }).toString()

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch users")
    }

    const data = await response.json()
    return data as UsersResponse
}

async function getViews(): Promise<ViewItem[]> {
    const baseUrl = getBaseUrl()
    const url = new URL("/api/views", baseUrl)
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch views")
    }
    const data = await response.json()
    return data as ViewItem[]
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    let params = await searchParams;
    const usersPromise = getUsers(params)
    const viewsPromise = getViews()

    return (
        <Shell className="gap-4">
            <React.Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={6}
                        cellWidths={["12rem", "20rem", "10rem", "10rem", "12rem", "12rem"]}
                    />
                }
            >
                <UsersTable
                    usersPromise={usersPromise}
                    viewsPromise={viewsPromise}
                />
            </React.Suspense>
        </Shell>
    )
} 