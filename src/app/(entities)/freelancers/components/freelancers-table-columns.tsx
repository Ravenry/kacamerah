import { type ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { DataTableRowActions } from "./freelancers-table-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export interface Freelancer {
    _id: string
    name: string
    linkedin?: string
    profile: {
        location: string
        about_me?: string
        languages: string[]
        education: {
            degree: string
            field: string
            year: string
        }[]
    }
    experience: {
        roles: {
            title: string
            organization: string
            current: boolean
        }[]
        organizations: string[]
    }
    freelance_services: string[]
    industry_experience: {
        industry: string
        years_experience: string
        note: string
    }[]
    ravenry_relationship?: {
        worked_with_us: boolean
        feedback?: string
        source?: string
    }
    availability: boolean
    rating?: number
    audit: {
        updated_on: Date
        updated_by: string
    }
    createdAt: Date
    updatedAt: Date
}

export function getColumns(): ColumnDef<Freelancer>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
                const initials = row.getValue<string>("name")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()

                return (
                    <div className="flex flex-col">
                        <span>{row.getValue<string>("name")}</span>
                    </div>
                )
            },
            enableSorting: true,
            enableHiding: false,
            size: 200
        },
        {
            accessorKey: "profile.about_me",
            header: ({ column }) => <DataTableColumnHeader column={column} title="About Me" />,
            cell: ({ row }) => {
                if (!row.original.profile.about_me) return null
                return (
                    <span className="text-sm text-muted-foreground text-wrap">
                        {row.original.profile.about_me}
                    </span>
                )
            },
            size: 400
        },
        {
            accessorKey: "linkedin",
            header: ({ column }) => <DataTableColumnHeader column={column} title="LinkedIn" />,
            cell: ({ row }) => {
                if (!row.original.linkedin) return null
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        asChild
                    >
                        <a
                            href={row.original.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                )
            },
        },
        {
            accessorKey: "profile.location",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
            cell: ({ row }) => <div>{row.original.profile.location}</div>,
            enableSorting: true,
        },
        {
            accessorKey: "profile.languages",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Languages" />,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.profile.languages.map((language) => (
                        <Badge key={language} variant="outline">
                            {language}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "profile.education",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Education" />,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    {row.original.profile.education.map((edu, index) => (
                        <div key={index} className="text-left">
                            <div className="font-medium">{edu.degree} in {edu.field}</div>
                            <div className="text-sm text-muted-foreground">{edu.year}</div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "freelance_services",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Services" />,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.freelance_services.map((service) => (
                        <Badge key={service} variant="outline">
                            {service}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "experience.roles",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Current Role" />,
            cell: ({ row }) => {
                const currentRole = row.original.experience.roles.find((role) => role.current)
                return currentRole ? (
                    <div>
                        <div className="font-medium">{currentRole.title}</div>
                        <div className="text-muted-foreground text-sm">{currentRole.organization}</div>
                    </div>
                ) : null
            },
        },
        {
            accessorKey: "experience.roles",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Past Roles" />,
            cell: ({ row }) => {
                const pastRoles = row.original.experience.roles.filter((role) => !role.current)
                return (
                    <div className="flex flex-col gap-2">
                        {pastRoles.map((role, index) => (
                            <div key={index}>
                                <div className="font-medium">{role.title}</div>
                                <div className="text-muted-foreground text-sm">{role.organization}</div>
                            </div>
                        ))}
                    </div>
                )
            },
        },
        {
            accessorKey: "experience.organizations",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Organizations" />,
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.experience.organizations.map((org) => (
                        <Badge key={org} variant="outline">
                            {org}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "industry_experience",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Industries" />,
            cell: ({ row }) => (
                <div className="flex flex-col gap-2">
                    {row.original.industry_experience.map((exp) => (
                        <div key={exp.industry} className="space-y-1">
                            <Badge variant="outline">{exp.industry}</Badge>
                            <div className="text-sm text-muted-foreground">
                                {exp.years_experience}
                                {exp.note && (
                                    <div className="text-xs">{exp.note}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: "ravenry_relationship",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ravenry Status" />,
            cell: ({ row }) => {
                const relationship = row.original.ravenry_relationship
                if (!relationship) return null
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant={relationship.worked_with_us ? "default" : "secondary"}>
                            {relationship.worked_with_us ? "Worked with us" : "Never worked"}
                        </Badge>
                        {relationship.feedback && (
                            <Badge variant="outline">
                                {relationship.feedback}
                            </Badge>
                        )}
                        {relationship.source && (
                            <div className="text-sm text-muted-foreground">
                                Source: {relationship.source}
                            </div>
                        )}
                    </div>
                )
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
            cell: ({ row }) => (
                <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
            cell: ({ row }) => (
                <div className="space-y-1">
                    <div>{new Date(row.original.updatedAt).toLocaleDateString()}</div>
                    <div className="text-xs text-muted-foreground">
                        by {row.original.audit.updated_by}
                    </div>
                </div>
            ),
            enableSorting: true,
        },
        {
            id: "actions",
            cell: ({ row }) => <DataTableRowActions row={row} />,
        },
    ]
}
