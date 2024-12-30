export interface DataTableFilterOption {
    label: string
    value: string
    icon?: React.ReactNode
    withCount?: boolean
}

export interface DataTableFilterField<TData> {
    label: string
    value: keyof TData | string
    subField?: string
    placeholder?: string
    options?: DataTableFilterOption[]
}

export interface DataTableSearchableField<TData> {
    id: keyof TData
    title: string
}

export interface View {
    id: string
    name: string
    columns: string[]
    filterParams: {
        status?: string[]
        priority?: string[]
        operator: string
    }
    createdAt: Date
    updatedAt: Date
} 