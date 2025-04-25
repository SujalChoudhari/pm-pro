"use client"

import { useProjectStore } from "./store"
import { scanProject } from "./project-scanner"
import { Capacitor } from "@capacitor/core"

// Function to clone a Git repository
export async function cloneRepository(repoUrl: string, destinationPath: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    throw new Error("Git cloning is only supported in native platforms")
  }

  try {
    // For Capacitor, we need to use a plugin to execute Git commands
    // This is a simplified example - in a real app, you would use a Capacitor plugin
    // that can execute shell commands or a specific Git plugin

    // Example using a hypothetical shell plugin:
    // await ShellPlugin.execute({
    //   command: 'git',
    //   args: ['clone', repoUrl, destinationPath]
    // });

    // For this demo, we'll simulate a successful clone
    console.log(`Cloning ${repoUrl} to ${destinationPath}`)

    // After cloning, scan the project and add it to the store
    const { addOrUpdateProject } = useProjectStore.getState()
    const project = await scanProject(destinationPath)

    if (project) {
      // Ensure the Git URL is set
      project.gitUrl = repoUrl
      addOrUpdateProject(project)
    } else {
      throw new Error("Failed to scan the cloned project")
    }
  } catch (error) {
    console.error("Git clone error:", error)
    throw new Error(`Failed to clone repository: ${error.message}`)
  }
}

// Function to check if a string is a valid Git URL
export function isValidGitUrl(url: string): boolean {
  // Basic validation for Git URLs
  const gitUrlPattern = /^(https?:\/\/|git@)([^\s:]+)(:|\/)[^\s]+(\.git)?$/
  return gitUrlPattern.test(url)
}
