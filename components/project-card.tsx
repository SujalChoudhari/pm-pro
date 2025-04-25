"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { Github, MoreHorizontal, Star, StarOff } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const { toggleFavorite, removeProject } = useProjectStore()

  return (
    <Card
      className={cn(
        "card-hover overflow-hidden border shadow-sm",
        project.isFavorite && "border-brand-blue/20 bg-brand-lightBlue",
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="line-clamp-1">{project.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              {project.owner}/{project.name}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(project.id)
              }}
              className="h-8 w-8 rounded-full"
            >
              {project.isFavorite ? (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-5 w-5" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreHorizontal className="h-5 w-5" />
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
                    if (confirm("Are you sure you want to remove this project?")) {
                      removeProject(project.id)
                    }
                  }}
                >
                  Remove Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm line-clamp-2 h-10">{project.description || "No description available"}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{project.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Github className="h-4 w-4" />
            <span>{project.forks.toLocaleString()} forks</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 2}
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}
        </div>
      </CardFooter>
    </Card>
  )
}
