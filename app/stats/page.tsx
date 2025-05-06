"use client"

import { useEffect } from "react"
import { useProjectStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BarChart3, Github, Star, Tag } from "lucide-react"

export default function StatsPage() {
  const { projects, loadProjects } = useProjectStore()

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const stats = {
    totalProjects: projects.length,
    totalStars: projects.reduce((sum, project) => sum + project.stars, 0),
    totalForks: projects.reduce((sum, project) => sum + project.forks, 0),
    totalTags: [...new Set(projects.flatMap(project => project.tags))].length,
    languages: projects.reduce((acc, project) => {
      if (project.language) {
        acc[project.language] = (acc[project.language] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Statistics</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Card className="stats-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Github className="h-5 w-5 text-brand-blue" />
                <span className="text-xl font-bold">{stats.totalProjects}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="stats-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="text-xl font-bold">{stats.totalStars.toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Total Stars</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="stats-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <BarChart3 className="h-5 w-5 text-brand-purple" />
                <span className="text-xl font-bold">{stats.totalForks.toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Total Forks</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="stats-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Tag className="h-5 w-5 text-brand-teal" />
                <span className="text-xl font-bold">{stats.totalTags}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Unique Tags</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.languages).map(([language, count]) => (
              <Card key={language}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{language}</span>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}