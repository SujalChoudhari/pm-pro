"use client"

import { v4 as uuidv4 } from "uuid"
import { Capacitor } from "@capacitor/core"
import { Directory, Filesystem } from "@capacitor/filesystem"
import type { Screenshot } from "./types"

// Function to check if a file or directory exists
export async function fileExists(path: string): Promise<boolean> {
  try {
    const result = await Filesystem.stat({
      path,
      directory: Directory.ExternalStorage,
    })
    return true
  } catch (error) {
    return false
  }
}

// Function to read a directory
export async function readDirectory(path: string): Promise<string[]> {
  try {
    const result = await Filesystem.readdir({
      path,
      directory: Directory.ExternalStorage,
    })
    return result.files.map((file) => file.name)
  } catch (error) {
    console.error("Error reading directory:", error)
    throw error
  }
}

// Function to read a file
export async function readFile(path: string): Promise<string> {
  try {
    const result = await Filesystem.readFile({
      path,
      directory: Directory.ExternalStorage,
      encoding: "utf8",
    })
    return result.data
  } catch (error) {
    console.error("Error reading file:", error)
    throw error
  }
}

// Function to select a folder using native dialog
export async function selectFolder(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) {
    // For web preview, return a mock path
    return "/mock/path/to/selected/folder"
  }

  try {
    // In a real app, you would use a Capacitor plugin that can open a folder picker
    // For this demo, we'll simulate a folder selection

    // Example using a hypothetical folder picker plugin:
    // const result = await FolderPickerPlugin.pickFolder();
    // return result.path;

    // For this demo, return a mock path
    return "/selected/folder/path"
  } catch (error) {
    console.error("Error selecting folder:", error)
    throw error
  }
}

// Function to upload a screenshot
export async function uploadScreenshot(): Promise<Screenshot | null> {
  if (!Capacitor.isNativePlatform()) {
    // For web preview, return a mock screenshot
    return {
      id: uuidv4(),
      name: "Screenshot " + new Date().toLocaleString(),
      path: "/placeholder.svg?height=720&width=1280",
      createdAt: new Date().toISOString(),
    }
  }

  try {
    // In a real app, you would use a Capacitor plugin to capture or pick an image
    // For this demo, we'll simulate a screenshot upload

    // Example using the Camera plugin:
    // const image = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: false,
    //   resultType: CameraResultType.Uri
    // });
    // const fileName = `screenshot_${Date.now()}.jpg`;
    // const savedFile = await Filesystem.copy({
    //   from: image.path,
    //   to: `screenshots/${fileName}`,
    //   directory: Directory.Data
    // });

    // For this demo, return a mock screenshot
    return {
      id: uuidv4(),
      name: "Screenshot " + new Date().toLocaleString(),
      path: "/placeholder.svg?height=720&width=1280",
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error uploading screenshot:", error)
    throw error
  }
}
