"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { ProjectCard } from "@/components/project-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Tag } from "lucide-react"

export default function TagsPage() {
  const { projects, loadProjects } = useProjectStore()
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  // Get all unique tags and their counts
  const tagCounts = projects.reduce((acc, project) => {
    project.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const handleSelectProject = (id: string) => {
    router.push(`/project/${id}`)
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
      <h1 className="text-3xl font-bold">Project Tags</h1>

      {Object.keys(tagCounts).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No tags found</h3>
            <p className="text-muted-foreground">Add tags to your projects to organize them</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show">
          {Object.entries(tagCounts).map(([tag, count]) => (
            <motion.div key={tag} variants={item} className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5" />
                      {tag}
                    </div>
                    <span className="text-sm text-muted-foreground">{count} projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects
                      .filter(project => project.tags.includes(tag))
                      .map(project => (
                        <ProjectCard 
                          key={project.id} 
                          project={project} 
                          onClick={() => handleSelectProject(project.id)} 
                        />
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}