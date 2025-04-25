"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  FileText,
  Github,
  Star,
  StarOff,
  Tag,
  Plus,
  ExternalLink,
  Eye,
  GitFork,
  Calendar,
  Loader2,
} from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { fetchReadme } from "@/lib/github-api"
import { motion } from "framer-motion"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { projects, updateProject, toggleFavorite } = useProjectStore()
  const project = projects.find((p) => p.id === projectId)
  const { toast } = useToast()

  const [newTag, setNewTag] = useState("")
  const [readme, setReadme] = useState<string | null>(null)
  const [isLoadingReadme, setIsLoadingReadme] = useState(false)

  useEffect(() => {
    if (project && !readme) {
      loadReadme()
    }
  }, [project])

  const loadReadme = async () => {
    if (!project) return

    setIsLoadingReadme(true)
    try {
      const readmeContent = await fetchReadme(project.owner, project.name)
      setReadme(readmeContent)
    } catch (error) {
      console.error("Failed to load README:", error)
      setReadme(null)
    } finally {
      setIsLoadingReadme(false)
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim()) return

    const updatedTags = [...project.tags, newTag.trim()]
    updateProject(projectId, { tags: updatedTags })
    setNewTag("")

    toast({
      title: "Tag Added",
      description: `Added "${newTag.trim()}" to project tags.`,
    })
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = project.tags.filter((tag) => tag !== tagToRemove)
    updateProject(projectId, { tags: updatedTags })
  }

  if (!project) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <h3 className="text-lg font-semibold">Project not found</h3>
        <Button onClick={() => router.push("/")} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-8 animate-fade-in">
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/")} className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={project.isFavorite ? "default" : "outline"}
            onClick={() => toggleFavorite(projectId)}
            className={project.isFavorite ? "gradient-blue text-white" : ""}
          >
            {project.isFavorite ? (
              <>
                <Star className="mr-2 h-4 w-4 fill-current" />
                Favorited
              </>
            ) : (
              <>
                <StarOff className="mr-2 h-4 w-4" />
                Add to Favorites
              </>
            )}
          </Button>
          <Button variant="outline" onClick={() => window.open(project.repoUrl, "_blank")}>
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="readme">README</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>Information about this GitHub repository</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-sm">{project.description || "No description available"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Repository</h3>
                      <p className="text-sm break-all">
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-blue hover:underline flex items-center"
                        >
                          {project.owner}/{project.name}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                      <p className="text-sm">
                        {format(new Date(project.lastUpdated), "PPP")}
                        <span className="text-muted-foreground ml-2">
                          ({formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })})
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="stats-card">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 mr-2 text-yellow-500" />
                          <span className="text-sm font-medium">Stars</span>
                        </div>
                        <span className="text-xl font-bold">{project.stars.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                    <Card className="stats-card">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <Eye className="h-5 w-5 mr-2 text-brand-blue" />
                          <span className="text-sm font-medium">Watchers</span>
                        </div>
                        <span className="text-xl font-bold">{project.watchers.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                    <Card className="stats-card">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <GitFork className="h-5 w-5 mr-2 text-brand-teal" />
                          <span className="text-sm font-medium">Forks</span>
                        </div>
                        <span className="text-xl font-bold">{project.forks.toLocaleString()}</span>
                      </CardContent>
                    </Card>
                  </div>

                  {project.language && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Primary Language</h3>
                      <Badge variant="outline" className="text-sm">
                        {project.language}
                      </Badge>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(new Date(project.createdAt), "PPP")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="readme" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    README
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingReadme ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-blue" />
                      <p className="mt-4 text-muted-foreground">Loading README...</p>
                    </div>
                  ) : readme ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: readme }} />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No README found</h3>
                      <p className="text-muted-foreground">
                        This repository doesn't have a README file or it couldn't be loaded.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
              <CardDescription>Organize your projects with custom tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddTag()
                    }
                  }}
                />
                <Button onClick={handleAddTag} disabled={!newTag.trim()} className="gradient-blue text-white">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {project.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm px-2 py-1">
                      {tag}
                      <button
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags yet. Add some tags to organize your projects.</p>
              )}
            </CardContent>
          </Card>

          {project.screenshot && (
            <Card>
              <CardHeader>
                <CardTitle>Screenshot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video rounded-md overflow-hidden border">
                  <Image
                    src={project.screenshot || "/placeholder.svg"}
                    alt={`Screenshot of ${project.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
