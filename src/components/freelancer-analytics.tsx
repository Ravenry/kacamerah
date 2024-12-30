"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Jan",
        total: 12,
    },
    {
        name: "Feb",
        total: 15,
    },
    {
        name: "Mar",
        total: 18,
    },
    {
        name: "Apr",
        total: 22,
    },
    {
        name: "May",
        total: 20,
    },
    {
        name: "Jun",
        total: 25,
    },
]

export function FreelancerAnalytics() {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Total Freelancers</div>
                    <div className="text-2xl font-bold">245</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Active Projects</div>
                    <div className="text-2xl font-bold">18</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Avg. Project Completion</div>
                    <div className="text-2xl font-bold">12 days</div>
                </div>
                <div className="rounded-lg border p-3">
                    <div className="text-sm font-medium">Avg. Freelancer Rating</div>
                    <div className="text-2xl font-bold">4.7</div>
                </div>
            </div>
            <div className="rounded-lg border p-4">
                <div className="text-sm font-medium mb-2">Projects Completed (Last 6 Months)</div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

