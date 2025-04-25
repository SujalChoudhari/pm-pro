"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Project, ProjectUpdate } from "./types"

interface ProjectState {
  projects: Project[]
  loadProjects: () => void
  addProject: (project: Project) => void
  toggleFavorite: (id: string) => void
  updateProject: (id: string, update: ProjectUpdate) => void
  removeProject: (id: string) => void
  scanLocations: string[]
  autoScanOnStartup: boolean
  addScanLocation: (location: string) => void
  removeScanLocation: (location: string) => void
  setAutoScanOnStartup: (value: boolean) => void
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      scanLocations: [], // Initialize with empty array
      autoScanOnStartup: false,

      loadProjects: () => {
        // This function is mainly for initialization
        // The actual loading is handled by the persist middleware
      },

      addProject: (project: Project) => {
        set((state) => {
          // Check if project already exists
          const existingIndex = state.projects.findIndex((p) => p.repoUrl === project.repoUrl)

          if (existingIndex >= 0) {
            // Update existing project
            const updatedProjects = [...state.projects]
            updatedProjects[existingIndex] = {
              ...project,
              id: state.projects[existingIndex].id,
              isFavorite: state.projects[existingIndex].isFavorite,
              tags: state.projects[existingIndex].tags,
              screenshot: state.projects[existingIndex].screenshot,
              lastUpdated: new Date().toISOString(),
            }
            return { projects: updatedProjects }
          } else {
            // Add new project
            return {
              projects: [...state.projects, project],
            }
          }
        })
      },

      toggleFavorite: (id: string) => {
        set((state) => {
          const updatedProjects = state.projects.map((project) =>
            project.id === id
              ? { ...project, isFavorite: !project.isFavorite, lastUpdated: new Date().toISOString() }
              : project,
          )
          return { projects: updatedProjects }
        })
      },

      updateProject: (id: string, update: ProjectUpdate) => {
        set((state) => {
          const updatedProjects = state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...update,
                  lastUpdated: new Date().toISOString(),
                }
              : project,
          )
          return { projects: updatedProjects }
        })
      },

      removeProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }))
      },

      addScanLocation: (location) =>
        set((state) => ({
          scanLocations: [...state.scanLocations, location],
        })),
      removeScanLocation: (location) =>
        set((state) => ({
          scanLocations: state.scanLocations.filter((l) => l !== location),
        })),
      setAutoScanOnStartup: (value) =>
        set(() => ({
          autoScanOnStartup: value,
        })),
    }),
    {
      name: "project-manager-storage",
    },
  ),
)
