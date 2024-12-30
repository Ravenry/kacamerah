import { type SQL } from "drizzle-orm"

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  withCount?: boolean
}

export interface DataTableFilterField<TData> {
  label: string
  value: string
  placeholder?: string
  options?: {
    label: string
    value: string
    withCount?: boolean
  }[]
}

export interface DataTableFilterOption<TData> {
  id: string
  label: string
  value: keyof TData
  options: Option[]
  filterValues?: string[]
  filterOperator?: string
  isMulti?: boolean
}

export type DrizzleWhere<T> =
  | SQL<unknown>
  | ((aliases: T) => SQL<T> | undefined)
  | undefined

export interface View {
  id: string
  name: string
  filterParams?: {
    operator?: "and" | "or"
    sort?: string
    filters?: {
      id: string
      field: string
      value: string[]
      operator: "equals" | "contains" | "startsWith" | "endsWith"
    }[]
  }
}
