"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { AddProjectDialog } from "@/components/add-project-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCard } from "@/components/project-card"
import { StatsCard } from "@/components/stats-card"
import { motion } from "framer-motion"
import { Github, Plus, Search, Star, Tag } from "lucide-react"

export default function Dashboard() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
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
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const favoriteProjects = filteredProjects.filter((project) => project.isFavorite)
  const recentProjects = [...filteredProjects]
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
    .slice(0, 6)

  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0)
  const totalForks = projects.reduce((sum, project) => sum + project.forks, 0)
  const uniqueTags = [...new Set(projects.flatMap((project) => project.tags))].length

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container py-6 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold">Welcome to PM Pro</h1>
          <p className="text-muted-foreground">Manage your GitHub projects in one place</p>
        </motion.div>
        <div className="flex w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={() => setIsAddProjectOpen(true)} className="gradient-blue text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <StatsCard
            title="Total Projects"
            value={projects.length.toString()}
            description="GitHub repositories"
            icon={<Github className="h-5 w-5" />}
            color="blue"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Total Stars"
            value={totalStars.toLocaleString()}
            description="Across all projects"
            icon={<Star className="h-5 w-5" />}
            color="pink"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Total Forks"
            value={totalForks.toLocaleString()}
            description="Across all projects"
            icon={<Github className="h-5 w-5" />}
            color="purple"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard
            title="Unique Tags"
            value={uniqueTags.toString()}
            description="For organization"
            icon={<Tag className="h-5 w-5" />}
            color="teal"
          />
        </motion.div>
      </motion.div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Projects</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="space-y-4">
          {recentProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Github className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="text-muted-foreground mb-4">Add your first GitHub project to get started</p>
                <Button onClick={() => setIsAddProjectOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {recentProjects.map((project, index) => (
                <motion.div key={project.id} variants={item}>
                  <ProjectCard project={project} onClick={() => handleSelectProject(project.id)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
        <TabsContent value="favorites" className="space-y-4">
          {favoriteProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Star className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No favorite projects</h3>
                <p className="text-muted-foreground">Mark projects as favorites to see them here</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {favoriteProjects.map((project, index) => (
                <motion.div key={project.id} variants={item}>
                  <ProjectCard project={project} onClick={() => handleSelectProject(project.id)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <Github className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No projects found</h3>
                <p className="text-muted-foreground mb-4">Try a different search term or add a new project</p>
                <Button onClick={() => setIsAddProjectOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredProjects.map((project, index) => (
                <motion.div key={project.id} variants={item}>
                  <ProjectCard project={project} onClick={() => handleSelectProject(project.id)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>

      <AddProjectDialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen} />
    </div>
  )
}
