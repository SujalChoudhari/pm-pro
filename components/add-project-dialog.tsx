"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { fetchGitHubRepo } from "@/lib/github-api"
import { useProjectStore } from "@/lib/store"
import { Github, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface AddProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddProjectDialog({ open, onOpenChange }: AddProjectDialogProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { addProject } = useProjectStore()

  const handleSubmit = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const project = await fetchGitHubRepo(repoUrl)
      addProject(project)

      toast({
        title: "Project Added",
        description: `${project.owner}/${project.name} has been added to your projects.`,
      })

      setRepoUrl("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add project. Please check the URL and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <DialogHeader>
            <DialogTitle>Add Project</DialogTitle>
            <DialogDescription>Enter a GitHub repository URL to add it to your projects.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="repo-url">GitHub Repository URL</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Github className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="repo-url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="pl-8"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Example: https://github.com/vercel/next.js</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="gradient-blue text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
