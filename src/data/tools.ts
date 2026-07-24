import { type ImageBrightness } from "@/lib/image-brightness"

export type SmallTool = {
  id: string
  repoName?: string
  repoUrl?: string
  githubRepo?: string
  role: "author" | "contributor"
  status?: "doing" | "draft"
  archived?: boolean
  featured?: boolean
  featuredOrder?: number
  highlightPointIndexes?: number[]
  screenshot?: {
    src: string
    alt: string
    brightness?: ImageBrightness
  }
  screenshots?: {
    src: string
    alt: string
    width: number
    height: number
    brightness?: ImageBrightness
  }[]
}

export const smallTools: SmallTool[] = [
  {
    id: "prompt-sketch",
    repoName: "AkashiSensei/PromptSketch",
    repoUrl: "https://github.com/AkashiSensei/PromptSketch",
    githubRepo: "AkashiSensei/PromptSketch",
    role: "author",
    status: "doing",
    featured: true,
    featuredOrder: 1,
    screenshots: [
      {
        src: "/assets/tools/prompt-sketch/simple-drawing.webp",
        alt: "PromptSketch freehand drawing on a blank canvas",
        width: 2000,
        height: 1326,
      },
      {
        src: "/assets/tools/prompt-sketch/quick-card-sketch.webp",
        alt: "PromptSketch card layout sketched with shapes and strokes",
        width: 2000,
        height: 1326,
        brightness: "high",
      },
      {
        src: "/assets/tools/prompt-sketch/screenshot-annotation.webp",
        alt: "PromptSketch annotations over a pasted screenshot",
        width: 1912,
        height: 1238,
        brightness: "high",
      },
    ],
  },
  {
    id: "project-context-meta-skill",
    repoName: "AkashiSensei/project-context-meta-skill",
    repoUrl: "https://github.com/AkashiSensei/project-context-meta-skill",
    githubRepo: "AkashiSensei/project-context-meta-skill",
    role: "author",
    featured: true,
    featuredOrder: 2,
    screenshots: [
      {
        src: "/assets/tools/project-context-meta-skill/roadmap.webp",
        alt: "Project context roadmap",
        width: 2670,
        height: 1884,
      },
      {
        src: "/assets/tools/project-context-meta-skill/raw-requirements.webp",
        alt: "Original requirements capture",
        width: 2670,
        height: 1884,
      },
      {
        src: "/assets/tools/project-context-meta-skill/active-task.webp",
        alt: "Active task focus document",
        width: 2670,
        height: 1884,
      },
      {
        src: "/assets/tools/project-context-meta-skill/spec-constraints.webp",
        alt: "Requirements specification and constraints",
        width: 2670,
        height: 1884,
      },
    ],
  },
  {
    id: "research-skills",
    repoName: "AkashiSensei/research-skills",
    repoUrl: "https://github.com/AkashiSensei/research-skills",
    githubRepo: "AkashiSensei/research-skills",
    role: "author",
    featured: true,
    featuredOrder: 4,
    screenshots: [
      {
        src: "/assets/tools/research-skills/codex-result.webp",
        alt: "Codex research result screenshot",
        width: 2114,
        height: 1548,
      },
      {
        src: "/assets/tools/research-skills/codex-process.webp",
        alt: "Codex research process screenshot",
        width: 2114,
        height: 1548,
      },
      {
        src: "/assets/tools/research-skills/codex-complete.webp",
        alt: "Codex completed research workflow screenshot",
        width: 2114,
        height: 1548,
      },
      {
        src: "/assets/tools/research-skills/cursor-anysearch-process.webp",
        alt: "Cursor AnySearch research process screenshot",
        width: 2114,
        height: 1548,
      },
      {
        src: "/assets/tools/research-skills/cursor-anysearch-result.webp",
        alt: "Cursor AnySearch research result screenshot",
        width: 2114,
        height: 1548,
      },
    ],
  },
  {
    id: "crater-prompt",
    repoName: "AkashiSensei/crater-prompt",
    repoUrl: "https://github.com/AkashiSensei/crater-prompt",
    githubRepo: "AkashiSensei/crater-prompt",
    role: "author",
    archived: true,
  },
  {
    id: "anysearch-skill",
    repoName: "anysearch-ai/anysearch-skill",
    repoUrl: "https://github.com/anysearch-ai/anysearch-skill",
    githubRepo: "anysearch-ai/anysearch-skill",
    role: "contributor",
    featured: true,
    featuredOrder: 3,
  },
  {
    id: "latex-resume",
    role: "author",
    status: "doing",
  },
  {
    id: "tododag",
    repoName: "AkashiSensei/ToDoDAG",
    githubRepo: "AkashiSensei/ToDoDAG",
    role: "author",
    status: "draft",
  },
]

export const featuredSmallTools = [...smallTools]
  .filter((tool) => tool.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 4)
