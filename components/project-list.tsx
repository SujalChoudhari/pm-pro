"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, StarOff, MoreVertical, Github, Folder } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectListProps {
  projects: Project[]
  onSelectProject: (id: string) => void
}

export function ProjectList({ projects, onSelectProject }: ProjectListProps) {
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("lastUpdated")
  const { toggleFavorite, removeProject } = useProjectStore()

  const handleDeleteProject = () => {
    if (deleteProjectId) {
      removeProject(deleteProjectId)
      setDeleteProjectId(null)
    }
  }

  // Sort projects based on selected criteria
  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "lastUpdated":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "favorites":
        return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="lastUpdated">Last Updated</SelectItem>
            <SelectItem value="favorites">Favorites</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
          <p className="text-muted-foreground">Add a GitHub repository to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProjects.map((project) => (
            <Card
              key={project.id}
              className={cn(
                "transition-all hover:shadow-md cursor-pointer",
                project.isFavorite && "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900",
              )}
              onClick={() => onSelectProject(project.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(project.id)
                      }}
                      className="h-8 w-8"
                    >
                      {project.isFavorite ? (
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(project.repoUrl, "_blank")
                          }}
                        >
                          <Github className="mr-2 h-4 w-4" />
                          View on GitHub
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteProjectId(project.id)
                          }}
                        >
                          Remove Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardDescription className="line-clamp-1">
                  {project.owner}/{project.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3">{project.description}</p>
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
              This will remove the project from Project Manager Pro. The GitHub repository will not be affected.
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
