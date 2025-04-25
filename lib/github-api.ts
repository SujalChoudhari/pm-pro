"use client"

import { v4 as uuidv4 } from "uuid"
import { marked } from "marked"
import type { Project } from "./types"

// Function to extract owner and repo name from GitHub URL
function extractRepoInfo(url: string): { owner: string; repo: string } {
  // Handle different GitHub URL formats
  const githubRegex = /github\.com\/([^/]+)\/([^/]+)/
  const match = url.match(githubRegex)

  if (!match) {
    throw new Error("Invalid GitHub URL. Please provide a valid repository URL.")
  }

  return {
    owner: match[1],
    repo: match[2].replace(".git", ""),
  }
}

// Function to fetch repository data from GitHub API
export async function fetchGitHubRepo(url: string): Promise<Project> {
  try {
    const { owner, repo } = extractRepoInfo(url)

    // Fetch repository data from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Repository not found. Please check the URL and try again.")
      }
      throw new Error("Failed to fetch repository data from GitHub.")
    }

    const data = await response.json()

    // Create project object
    return {
      id: uuidv4(),
      name: data.name,
      owner: data.owner.login,
      description: data.description || "",
      repoUrl: data.html_url,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      language: data.language,
      tags: data.topics || [],
      isFavorite: false,
      lastUpdated: data.updated_at,
      createdAt: data.created_at,
      screenshot: null,
    }
  } catch (error) {
    console.error("Error fetching GitHub repository:", error)
    throw error
  }
}

// Function to fetch README content from GitHub
export async function fetchReadme(owner: string, repo: string): Promise<string | null> {
  try {
    // Fetch README from GitHub API
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`)

    if (!response.ok) {
      if (response.status === 404) {
        return null // No README found
      }
      throw new Error("Failed to fetch README from GitHub.")
    }

    const data = await response.json()

    // Decode content (it's base64 encoded)
    const content = atob(data.content)

    // Convert markdown to HTML
    const html = await marked(content)

    return html
  } catch (error) {
    console.error("Error fetching README:", error)
    return null
  }
}
