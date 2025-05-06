"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { ProjectCard } from "@/components/project-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search } from "lucide-react"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { projects, loadProjects } = useProjectStore()
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleSelectProject = (id: string) => {
    router.push(`/project/${id}`)
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">All Projects</h1>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <h3 className="text-lg font-semibold">No projects found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard project={project} onClick={() => handleSelectProject(project.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}