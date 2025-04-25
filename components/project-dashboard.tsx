"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, StarOff, MoreVertical, Folder } from "lucide-react"
import type { Project } from "@/lib/types"
import { useProjectStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ProjectDashboardProps {
  projects: Project[]
  onSelectProject: (id: string) => void
}

export function ProjectDashboard({ projects, onSelectProject }: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const { toggleFavorite, removeProject } = useProjectStore()

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const favoriteProjects = filteredProjects.filter((project) => project.isFavorite)
  const otherProjects = filteredProjects.filter((project) => !project.isFavorite)
  const sortedProjects = [...favoriteProjects, ...otherProjects]

  const handleDeleteProject = () => {
    if (deleteProjectId) {
      removeProject(deleteProjectId)
      setDeleteProjectId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {sortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Try a different search term or clear the search"
              : "Add a project or scan your directories to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <Card
              key={project.id}
              className={cn(
                "transition-all hover:shadow-md",
                project.isFavorite && "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(project.id)} className="h-8 w-8">
                      {project.isFavorite ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectProject(project.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`file://${project.path}`, "_blank")}>
                          Open Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteProjectId(project.id)}
                        >
                          Delete Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="line-clamp-1">{project.path}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{project.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteProjectId} onOpenChange={(open) => !open && setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the project from Project Manager Pro. The actual project files will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
              Remove Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
