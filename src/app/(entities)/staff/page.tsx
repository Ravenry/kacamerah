import { Suspense } from "react"
import { StaffTable } from "./components/staff-table"
import { getStaff } from "@/app/_lib/api"
import { getViews } from "@/app/_lib/views"

export default async function StaffPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const page = Number(searchParams.page) || 1
    const sort = searchParams.sort?.toString()
    const search = searchParams.search?.toString()
    const role = searchParams.role?.toString()
    const status = searchParams.status?.toString()

    const staffPromise = getStaff({
        page,
        sort,
        search,
        role,
        status,
    })

    const viewsPromise = getViews('staff')

    return (
        <div className="flex flex-col gap-4 p-8">
            <Suspense fallback={<div>Loading...</div>}>
                <StaffTable
                    staffPromise={staffPromise}
                />
            </Suspense>
        </div>
    )
} 