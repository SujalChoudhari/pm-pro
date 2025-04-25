export interface Project {
  id: string
  name: string
  owner: string
  description: string
  repoUrl: string
  stars: number
  forks: number
  watchers: number
  language: string | null
  tags: string[]
  isFavorite: boolean
  lastUpdated: string
  createdAt: string
  screenshot: string | null
}

export interface ProjectUpdate {
  description?: string
  tags?: string[]
  isFavorite?: boolean
  screenshot?: string | null
}

export interface Screenshot {
  id: string
  name: string | null
  path: string | null
  createdAt: string
}
