import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  color: "blue" | "pink" | "purple" | "teal"
}

export function StatsCard({ title, value, description, icon, color }: StatsCardProps) {
  const colorClasses = {
    blue: "bg-brand-blue text-white",
    pink: "bg-brand-pink text-white",
    purple: "bg-brand-purple text-white",
    teal: "bg-brand-teal text-white",
  }

  const gradientClasses = {
    blue: "gradient-blue",
    pink: "gradient-pink",
    purple: "gradient-purple",
    teal: "gradient-teal",
  }

  return (
    <Card className="stats-card overflow-hidden border-none shadow-md">
      <CardHeader className={cn("pb-2", gradientClasses[color])}>
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <div className="bg-white/20 p-1 rounded-md">{icon}</div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
