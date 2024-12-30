import * as React from "react"
import { Shell } from "@/components/shell"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getViews } from "@/app/_lib/queries"
import { getFreelancers } from "@/app/_lib/api"
import { FreelancersTable } from "./components/freelancers-table"

export default function FreelancersPage({ searchParams }: {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}) {
    const freelancersPromise = getFreelancers({
        page: searchParams.page?.toString(),
        per_page: searchParams.per_page?.toString(),
        sort: searchParams.sort?.toString(),
        name: searchParams.name?.toString(),
        location: searchParams.location?.toString(),
        services: searchParams.services?.toString(),
        experience: searchParams.experience?.toString(),
        availability: searchParams.availability?.toString(),
        rating: searchParams.rating?.toString(),
    })
    const viewsPromise = getViews()

    return (
        <Shell className="gap-4">
            <React.Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={9}
                        cellWidths={[
                            "4rem",  // Select
                            "16rem", // Name
                            "12rem", // Location
                            "12rem", // Services
                            "16rem", // Current Role
                            "12rem", // Industries
                            "8rem",  // Available
                            "8rem",  // Rating
                            "12rem", // Last Updated
                        ]}
                    />
                }
            >
                <FreelancersTable
                    freelancersPromise={freelancersPromise}
                    viewsPromise={viewsPromise}
                />
            </React.Suspense>
        </Shell>
    )
} 