export type SmallTool = {
  id: string
  repoName?: string
  repoUrl?: string
  role: "author" | "contributor"
  status?: "doing"
  archived?: boolean
  featured?: boolean
  featuredOrder?: number
  screenshot?: {
    src: string
    alt: string
  }
}

export const smallTools: SmallTool[] = [
  {
    id: "project-context-meta-skill",
    repoName: "AkashiSensei/project-context-meta-skill",
    repoUrl: "https://github.com/AkashiSensei/project-context-meta-skill",
    role: "author",
    featured: true,
    featuredOrder: 1,
  },
  {
    id: "research-skills",
    repoName: "AkashiSensei/research-skills",
    repoUrl: "https://github.com/AkashiSensei/research-skills",
    role: "author",
    featured: true,
    featuredOrder: 2,
  },
  {
    id: "latex-resume",
    role: "author",
    status: "doing",
    featured: true,
    featuredOrder: 3,
  },
  {
    id: "anysearch-skill",
    repoName: "anysearch-ai/anysearch-skill",
    repoUrl: "https://github.com/anysearch-ai/anysearch-skill",
    role: "contributor",
    featured: true,
    featuredOrder: 4,
  },
  {
    id: "crater-prompt",
    repoName: "AkashiSensei/crater-prompt",
    repoUrl: "https://github.com/AkashiSensei/crater-prompt",
    role: "author",
    archived: true,
  },
]

export const featuredSmallTools = [...smallTools]
  .filter((tool) => tool.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 3)
