"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Folder, FolderOpen, Trash2 } from "lucide-react"
import { useProjectStore } from "@/lib/store"
import { selectFolder } from "@/lib/file-utils"
import { useToast } from "@/hooks/use-toast"
import { scanFoldersForProjects } from "@/lib/project-scanner"
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
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [newScanLocation, setNewScanLocation] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [locationToRemove, setLocationToRemove] = useState<string | null>(null)
  const { scanLocations = [], addScanLocation, removeScanLocation, autoScanOnStartup = false, setAutoScanOnStartup } =
    useProjectStore()
  const { toast } = useToast()

  const handleBrowse = async () => {
    try {
      const selectedPath = await selectFolder()
      if (selectedPath) {
        setNewScanLocation(selectedPath)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select folder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddLocation = async () => {
    if (!newScanLocation) {
      toast({
        title: "Error",
        description: "Please select a folder to scan.",
        variant: "destructive",
      })
      return
    }

    // Check if location already exists
    if (scanLocations.includes(newScanLocation)) {
      toast({
        title: "Location Already Added",
        description: "This folder is already in your scan locations.",
        variant: "destructive",
      })
      return
    }

    addScanLocation(newScanLocation)
    setNewScanLocation("")

    toast({
      title: "Scan Location Added",
      description: "The folder has been added to your scan locations.",
    })
  }

  const handleRemoveLocation = () => {
    if (locationToRemove) {
      removeScanLocation(locationToRemove)
      setLocationToRemove(null)

      toast({
        title: "Scan Location Removed",
        description: "The folder has been removed from your scan locations.",
      })
    }
  }

  const handleScanNow = async () => {
    if (scanLocations.length === 0) {
      toast({
        title: "No Scan Locations",
        description: "Please add at least one folder to scan for projects.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    try {
      await scanFoldersForProjects(scanLocations)
      toast({
        title: "Scan Complete",
        description: "All configured folders have been scanned for projects.",
      })
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Failed to scan for projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Scanning</CardTitle>
            <CardDescription>
              Configure folders to scan for Git repositories. Any subfolder containing a .git directory will be
              registered as a project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-scan">Auto-scan on startup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically scan for new projects when the application starts
                  </p>
                </div>
                <Switch id="auto-scan" checked={autoScanOnStartup} onCheckedChange={setAutoScanOnStartup} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label>Add Scan Location <Badge>BETA</Badge></Label>
                <div className="flex gap-2">
                  <Input
                    value={newScanLocation}
                    disabled
                    onChange={(e) => setNewScanLocation(e.target.value)}
                    placeholder="/path/to/projects"
                    readOnly
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleBrowse} disabled>
                    <Folder className="mr-2 h-4 w-4" />
                    Browse
                  </Button>
                  <Button onClick={handleAddLocation} disabled>
                    Add
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  All Git repositories found in subfolders will be added as projects
                </p>
              </div>

              <div className="space-y-2">
                <Label>Current Scan Locations</Label>
                {(scanLocations?.length ?? 0) === 0 ? (
                  <div className="text-sm text-muted-foreground py-2">
                    No scan locations configured. Add a folder above to start scanning for projects.
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    {scanLocations?.map((location) => (
                      <div key={location} className="flex items-center justify-between p-3">
                        <div className="flex items-center gap-2 truncate">
                          <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{location}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setLocationToRemove(location)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleScanNow} disabled={isScanning || !scanLocations?.length} className="w-full">
                {isScanning ? "Scanning..." : "Scan Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!locationToRemove} onOpenChange={(open) => !open && setLocationToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Scan Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this folder from your scan locations? Projects that were already
              discovered will remain in your project list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveLocation}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
