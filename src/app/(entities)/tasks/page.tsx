import * as React from "react"
import { searchParamsSchema, type TaskSearchParams, taskSearchParamsSchema } from "@/app/_lib/validations"
import { Shell } from "@/components/shell"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { type ViewItem } from "@/components/data-table/advanced/views/data-table-views-dropdown"
import { DateRangePicker } from "@/components/date-range-picker"
import { TasksTable } from "./components/tasks-table"
import { type Task } from "./components/tasks-table-columns"
import { headers } from "next/headers"

interface TasksPageProps {
    searchParams: Record<string, string | string[] | undefined>
}

interface TasksResponse {
    data: Task[]
    pageCount: number
}

function getBaseUrl() {
    const headersList = headers()
    const host = headersList.get("host") || "https://kacamerah.vercel.app/"
    const protocol = host.includes("localhost") ? "http" : "https"
    return `${protocol}://${host}`
}

async function getTasks(searchParams: Record<string, string | string[] | undefined>): Promise<TasksResponse> {
    // Parse and validate searchParams with defaults
    const validatedParams = taskSearchParamsSchema.parse({
        page: searchParams.page ? Number(searchParams.page) : undefined,
        per_page: searchParams.per_page ? Number(searchParams.per_page) : undefined,
        sort: searchParams.sort,
        title: searchParams.title,
        status: searchParams.status,
        priority: searchParams.priority,
        from: searchParams.from,
        to: searchParams.to,
    })

    const baseUrl = getBaseUrl()
    const url = new URL("/api/tasks", baseUrl)
    url.search = new URLSearchParams({
        page: validatedParams.page.toString(),
        per_page: validatedParams.per_page.toString(),
        ...(validatedParams.sort && { sort: validatedParams.sort }),
        ...(validatedParams.title && { title: validatedParams.title }),
        ...(validatedParams.status && { status: validatedParams.status }),
        ...(validatedParams.priority && { priority: validatedParams.priority }),
        ...(validatedParams.from && { from: validatedParams.from }),
        ...(validatedParams.to && { to: validatedParams.to }),
    }).toString()

    const response = await fetch(url)
    if (!response.ok) {
        throw new Error("Failed to fetch tasks")
    }

    const data = await response.json()
    return data as TasksResponse
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

export default async function IndexPage({ searchParams }: IndexPageProps) {
    const search = searchParamsSchema.parse(searchParams)

    const tasksPromise = getTasks(search)
    const viewsPromise = getViews()

    return (
        <Shell className="gap-2">
            <React.Suspense
                fallback={
                    <DataTableSkeleton
                        columnCount={5}
                        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
                        shrinkZero
                    />
                }
            >
                {/**
           * The `DateRangePicker` component is used to render the date range picker UI.
           * It is used to filter the tasks based on the selected date range it was created at.
           * The business logic for filtering the tasks based on the selected date range is handled inside the component.
           */}
                <DateRangePicker
                    triggerSize="sm"
                    triggerClassName="ml-auto w-56 sm:w-60 mr-1"
                    className="dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/50"
                    align="end"
                />
                {/**
           * Passing promises and consuming them using React.use for triggering the suspense fallback.
           * @see https://react.dev/reference/react/use
           */}
                <TasksTable tasksPromise={tasksPromise} viewsPromise={viewsPromise} />
            </React.Suspense>
        </Shell>
    )
}
