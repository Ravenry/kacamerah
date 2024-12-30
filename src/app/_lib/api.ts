import { type Project } from "@/app/(entities)/projects/components/projects-table-columns"
import { type Client } from "@/app/(entities)/clients/components/clients-table-columns"
import { type Freelancer } from "@/app/(entities)/freelancers/components/freelancers-table-columns"
import type { SearchParams } from "./validations"

const BASE_URL = 'https://kacamerah.vercel.app/'

interface GetProjectsParams {
    page?: string
    per_page?: string
    sort?: string
    name?: string
    status?: string
    service_type?: string
    business_type?: string
    industries?: string
    regions?: string
    [key: string]: string | undefined
}

export interface GetProjectsResponse {
    data: Project[]
    pageCount: number
}

interface GetClientsParams {
    page?: string
    per_page?: string
    sort?: string
    name?: string
    email?: string
    organization_type?: string
    industry?: string
    location?: string
    [key: string]: string | undefined
}

export interface GetClientsResponse {
    data: Client[]
    pageCount: number
}

interface GetFreelancersParams {
    page?: string
    per_page?: string
    sort?: string
    name?: string
    location?: string
    services?: string
    experience?: string
    availability?: string
    rating?: string
    [key: string]: string | undefined
}

export interface GetFreelancersResponse {
    data: Freelancer[]
    pageCount: number
}

export type ApiResponse<T> = {
    data: T[]
    pageCount: number
    total: number
}

export async function getStaff(params: {
    page?: number
    sort?: string
    search?: string
    role?: string
    status?: string
}) {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.sort) searchParams.set('sort', params.sort)
    if (params.search) searchParams.set('search', params.search)
    if (params.role) searchParams.set('role', params.role)
    if (params.status) searchParams.set('status', params.status)

    const response = await fetch(createUrl(`/api/staff`, Object.fromEntries(searchParams)))
    if (!response.ok) {
        throw new Error("Failed to fetch staff")
    }

    const result = await response.json()
    return result as ApiResponse<any>
}

function createUrl(path: string, params: Record<string, string | undefined>) {
    const url = new URL(path, BASE_URL)
    Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value)
    })
    return url.toString()
}

export async function getProjects(params: GetProjectsParams): Promise<GetProjectsResponse> {
    const response = await fetch(createUrl("/api/projects", params))
    if (!response.ok) {
        throw new Error("Failed to fetch projects")
    }

    const result = await response.json()
    return result as GetProjectsResponse
}

export async function getClients(params: GetClientsParams): Promise<GetClientsResponse> {
    const response = await fetch(createUrl("/api/clients", params))

    console.log(response)
    if (!response.ok) {
        throw new Error("Failed to fetch clients")
    }

    const result = await response.json()
    return result as GetClientsResponse
}

export async function getFreelancers(params: GetFreelancersParams): Promise<GetFreelancersResponse> {
    const response = await fetch(createUrl("/api/freelancers", params))
    if (!response.ok) {
        throw new Error("Failed to fetch freelancers")
    }

    const result = await response.json()
    return result as GetFreelancersResponse
} 