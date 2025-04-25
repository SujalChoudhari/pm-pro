"use client"

import { useState } from "react"
import { useProjectStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, FileText, FolderOpen, Github, Save, Upload } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { ScreenshotGallery } from "@/components/screenshot-gallery"
import { useToast } from "@/hooks/use-toast"
import { uploadScreenshot } from "@/lib/file-utils"

interface ProjectDetailsProps {
  projectId: string
  onBack: () => void
}

export function ProjectDetails({ projectId, onBack }: ProjectDetailsProps) {
  const { projects, updateProject } = useProjectStore()
  const project = projects.find((p) => p.id === projectId)
  const { toast } = useToast()

  const [editedSummary, setEditedSummary] = useState(project?.summary || "")
  const [editedTags, setEditedTags] = useState(project?.tags.join(", ") || "")
  const [isEditing, setIsEditing] = useState(false)

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">Project not found</h3>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const handleSaveChanges = () => {
    updateProject(projectId, {
      summary: editedSummary,
      tags: editedTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
    setIsEditing(false)
    toast({
      title: "Changes Saved",
      description: "Your project details have been updated.",
    })
  }

  const handleUploadScreenshot = async () => {
    try {
      const screenshot = await uploadScreenshot()
      if (screenshot) {
        updateProject(projectId, {
          screenshots: [...project.screenshots, screenshot],
        })
        toast({
          title: "Screenshot Added",
          description: "Your screenshot has been added to the project.",
        })
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload screenshot. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleOpenFolder = () => {
    window.open(`file://${project.path}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{project.name}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenFolder}>
            <FolderOpen className="mr-2 h-4 w-4" />
            Open Folder
          </Button>
          {project.gitUrl && (
            <Button variant="outline" onClick={() => window.open(project.gitUrl, "_blank")}>
              <Github className="mr-2 h-4 w-4" />
              View Repository
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="readme">README</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Project Details</span>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Details
                  </Button>
                ) : (
                  <Button variant="default" size="sm" onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Project Path</h3>
                  <p className="text-sm break-all">{project.path}</p>
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
                {project.gitUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Git Repository</h3>
                    <p className="text-sm break-all">{project.gitUrl}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Summary</h3>
                {isEditing ? (
                  <Textarea
                    value={editedSummary}
                    onChange={(e) => setEditedSummary(e.target.value)}
                    rows={4}
                    placeholder="Enter a summary of your project..."
                  />
                ) : (
                  <p className="text-sm whitespace-pre-line">{project.summary}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Tags</h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedTags}
                      onChange={(e) => setEditedTags(e.target.value)}
                      placeholder="Enter tags separated by commas..."
                    />
                    <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length === 0 && <span className="text-sm text-muted-foreground">No tags</span>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screenshots" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Screenshots</span>
                <Button onClick={handleUploadScreenshot}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Screenshot
                </Button>
              </CardTitle>
              <CardDescription>Capture and manage screenshots of your project</CardDescription>
            </CardHeader>
            <CardContent>
              <ScreenshotGallery projectId={projectId} screenshots={project.screenshots} />
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
              {project.readme ? (
                <div className="prose dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: project.readme }} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No README found</h3>
                  <p className="text-muted-foreground">
                    This project doesn't have a README file or it couldn't be parsed.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
