"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { ProjectCard } from "@/components/project-card"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function FavoritesPage() {
  const { projects, loadProjects } = useProjectStore()
  const router = useRouter()

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const favoriteProjects = projects.filter(project => project.isFavorite)

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
      <h1 className="text-3xl font-bold">Favorite Projects</h1>

      {favoriteProjects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No favorite projects</h3>
            <p className="text-muted-foreground">Star your favorite projects to see them here</p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {favoriteProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard project={project} onClick={() => handleSelectProject(project.id)} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}