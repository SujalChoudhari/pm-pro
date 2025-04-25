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
import { cloneRepository } from "@/lib/git-integration"
import { Folder } from "lucide-react"
import { selectFolder } from "@/lib/file-utils"

interface GitCloneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GitCloneDialog({ open, onOpenChange }: GitCloneDialogProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const [destinationPath, setDestinationPath] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleBrowse = async () => {
    try {
      const selectedPath = await selectFolder()
      if (selectedPath) {
        setDestinationPath(selectedPath)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!repoUrl) {
      toast({
        title: "Error",
        description: "Please enter a Git repository URL.",
        variant: "destructive",
      })
      return
    }

    if (!destinationPath) {
      toast({
        title: "Error",
        description: "Please select a destination folder.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await cloneRepository(repoUrl, destinationPath)
      toast({
        title: "Repository Cloned",
        description: "The Git repository has been successfully cloned.",
      })
      setRepoUrl("")
      setDestinationPath("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Clone Failed",
        description: "Failed to clone repository. Please check the URL and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clone from Git</DialogTitle>
          <DialogDescription>Clone a Git repository to add it to Project Manager Pro.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository.git"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination-path">Destination Path</Label>
            <div className="flex gap-2">
              <Input
                id="destination-path"
                value={destinationPath}
                onChange={(e) => setDestinationPath(e.target.value)}
                placeholder="/path/to/destination"
                readOnly
              />
              <Button type="button" variant="outline" onClick={handleBrowse}>
                <Folder className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !repoUrl || !destinationPath}>
            {isLoading ? "Cloning..." : "Clone Repository"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
