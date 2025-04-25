"use client"

import { useState } from "react"
import Image from "next/image"
import { useProjectStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, ZoomIn } from "lucide-react"
import type { Screenshot } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
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
import { format } from "date-fns"

interface ScreenshotGalleryProps {
  projectId: string
  screenshots: Screenshot[]
}

export function ScreenshotGallery({ projectId, screenshots }: ScreenshotGalleryProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null)
  const [screenshotToDelete, setScreenshotToDelete] = useState<string | null>(null)
  const { updateProject } = useProjectStore()
  const { toast } = useToast()

  const handleDeleteScreenshot = () => {
    if (screenshotToDelete) {
      const updatedScreenshots = screenshots.filter((s) => s.id !== screenshotToDelete)
      updateProject(projectId, { screenshots: updatedScreenshots })
      setScreenshotToDelete(null)
      toast({
        title: "Screenshot Deleted",
        description: "The screenshot has been removed from the project.",
      })
    }
  }

  if (screenshots.length === 0) {
    return (
      <div className="text-center py-8">
        <ZoomIn className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Screenshots</h3>
        <p className="text-muted-foreground">Upload screenshots to showcase your project's interface and features.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {screenshots.map((screenshot) => (
          <Card key={screenshot.id} className="group relative overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={screenshot.path || "/placeholder.svg"}
                alt={screenshot.name || "Project screenshot"}
                fill
                className="object-cover cursor-pointer"
                onClick={() => setSelectedScreenshot(screenshot)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" onClick={() => setSelectedScreenshot(screenshot)}>
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => setScreenshotToDelete(screenshot.id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-2 text-sm truncate">
              {screenshot.name || format(new Date(screenshot.createdAt), "PPP")}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedScreenshot} onOpenChange={(open) => !open && setSelectedScreenshot(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedScreenshot?.name || "Project Screenshot"}</DialogTitle>
          </DialogHeader>
          {selectedScreenshot && (
            <div className="relative w-full h-[70vh]">
              <Image
                src={selectedScreenshot.path || "/placeholder.svg"}
                alt={selectedScreenshot.name || "Project screenshot"}
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!screenshotToDelete} onOpenChange={(open) => !open && setScreenshotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Screenshot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this screenshot? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteScreenshot} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
