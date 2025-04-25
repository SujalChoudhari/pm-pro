"use client"

import { v4 as uuidv4 } from "uuid"
import type { Project } from "./types"
import { useProjectStore } from "./store"
import { readDirectory, readFile, fileExists } from "./file-utils"
import { parseReadme } from "./summary-parser"

// Function to scan a single project directory
export async function scanProject(path: string): Promise<Project | null> {
  try {
    // Get the directory name as the project name
    const pathParts = path.split(/[/\\]/)
    const name = pathParts[pathParts.length - 1]

    // Check if the directory exists
    const exists = await fileExists(path)
    if (!exists) {
      throw new Error(`Directory does not exist: ${path}`)
    }

    // Read the directory contents
    const files = await readDirectory(path)

    // Look for README file
    const readmeFile = files.find(
      (file) =>
        file.toLowerCase() === "readme.md" || file.toLowerCase() === "readme.txt" || file.toLowerCase() === "readme",
    )

    // Parse README if found
    let readme = null
    let summary = ""

    if (readmeFile) {
      const readmeContent = await readFile(`${path}/${readmeFile}`)
      const parsedReadme = await parseReadme(readmeContent)
      readme = parsedReadme.html
      summary = parsedReadme.summary
    }

    // Look for package.json to extract more info
    let tags: string[] = []
    let gitUrl = null

    if (files.includes("package.json")) {
      try {
        const packageJson = JSON.parse(await readFile(`${path}/package.json`))

        // Extract dependencies as tags
        const dependencies = {
          ...(packageJson.dependencies || {}),
          ...(packageJson.devDependencies || {}),
        }

        tags = Object.keys(dependencies).slice(0, 10)

        // Extract repository URL if available
        if (packageJson.repository) {
          if (typeof packageJson.repository === "string") {
            gitUrl = packageJson.repository
          } else if (packageJson.repository.url) {
            gitUrl = packageJson.repository.url
          }
        }
      } catch (error) {
        console.error("Error parsing package.json:", error)
      }
    }

    // Look for .git directory to extract git info if not found in package.json
    if (!gitUrl && files.includes(".git")) {
      try {
        const configContent = await readFile(`${path}/.git/config`)
        const urlMatch = configContent.match(/url\s*=\s*(.+)/i)
        if (urlMatch && urlMatch[1]) {
          gitUrl = urlMatch[1].trim()
        }
      } catch (error) {
        console.error("Error reading git config:", error)
      }
    }

    // Create project object
    return {
      id: uuidv4(),
      name,
      path,
      summary: summary || `Project located at ${path}`,
      readme,
      tags,
      isFavorite: false,
      lastUpdated: new Date().toISOString(),
      gitUrl,
      screenshots: [],
    }
  } catch (error) {
    console.error(`Error scanning project at ${path}:`, error)
    return null
  }
}

// Function to check if a directory is a Git repository
export async function isGitRepository(path: string): Promise<boolean> {
  try {
    const files = await readDirectory(path)
    return files.includes(".git")
  } catch (error) {
    return false
  }
}

// Function to scan a folder and its subfolders for Git repositories
export async function scanFolderForGitRepos(basePath: string): Promise<string[]> {
  const gitRepos: string[] = []

  try {
    // Check if the base path itself is a Git repo
    if (await isGitRepository(basePath)) {
      gitRepos.push(basePath)
      // If it's a Git repo, we don't need to scan its subfolders
      return gitRepos
    }

    // Scan subfolders
    const files = await readDirectory(basePath)

    for (const file of files) {
      const fullPath = `${basePath}/${file}`

      try {
        // Check if it's a directory
        const stat = await Filesystem.stat({
          path: fullPath,
          directory: Directory.ExternalStorage,
        })

        if (stat.type === "directory") {
          // Check if this directory is a Git repo
          if (await isGitRepository(fullPath)) {
            gitRepos.push(fullPath)
          } else {
            // Recursively scan this directory
            const subRepos = await scanFolderForGitRepos(fullPath)
            gitRepos.push(...subRepos)
          }
        }
      } catch (error) {
        // Skip files that can't be accessed
        console.error(`Error accessing ${fullPath}:`, error)
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${basePath}:`, error)
  }

  return gitRepos
}

// Function to scan multiple folders for Git repositories
export async function scanFoldersForProjects(folders: string[]): Promise<void> {
  const { addOrUpdateProject } = useProjectStore.getState()

  for (const folder of folders) {
    try {
      // Find all Git repositories in this folder and its subfolders
      const gitRepos = await scanFolderForGitRepos(folder)

      // Scan each Git repository and add it as a project
      for (const repoPath of gitRepos) {
        const project = await scanProject(repoPath)
        if (project) {
          addOrUpdateProject(project)
        }
      }
    } catch (error) {
      console.error(`Error scanning folder ${folder}:`, error)
    }
  }
}

// Function to add a single project
export async function addProject(path: string): Promise<void> {
  const { addOrUpdateProject } = useProjectStore.getState()

  const project = await scanProject(path)
  if (project) {
    addOrUpdateProject(project)
  } else {
    throw new Error(`Failed to add project at ${path}`)
  }
}

// Function to scan existing projects for updates
export async function scanProjects(): Promise<void> {
  const { projects, addOrUpdateProject } = useProjectStore.getState()

  // Rescan existing projects
  for (const project of projects) {
    try {
      const updatedProject = await scanProject(project.path)
      if (updatedProject) {
        // Preserve screenshots and favorite status
        updatedProject.screenshots = project.screenshots
        updatedProject.isFavorite = project.isFavorite
        updatedProject.id = project.id // Keep the same ID

        addOrUpdateProject(updatedProject)
      }
    } catch (error) {
      console.error(`Error rescanning project ${project.name}:`, error)
    }
  }
}

// Import missing dependencies
import { Filesystem, Directory } from "@capacitor/filesystem"
