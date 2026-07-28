import { type ImageBrightness } from "@/lib/image-brightness"

export type SmallToolRepoTag = "private" | "public"

export type SmallTool = {
  id: string
  repoName?: string
  repoUrl?: string
  githubRepo?: string
  repoTags?: SmallToolRepoTag[]
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
    titleKey?: string
    width: number
    height: number
    brightness?: ImageBrightness
  }[]
}

export const smallTools: SmallTool[] = [
  {
    id: "typelift",
    repoName: "AkashiSensei/TypeLift",
    repoUrl: "https://github.com/AkashiSensei/TypeLift",
    githubRepo: "AkashiSensei/TypeLift",
    repoTags: ["private"],
    role: "author",
    status: "doing",
    featured: true,
    featuredOrder: 1,
    screenshots: [
      {
        src: "/assets/tools/typelift/writing-flow.webp",
        alt: "TypeLift floating input over a multilingual writing draft",
        titleKey: "items.typelift.images.writingFlow",
        width: 1272,
        height: 654,
        brightness: "high",
      },
      {
        src: "/assets/tools/typelift/translation-candidates.webp",
        alt: "TypeLift AI translation candidates over a social media comment composer",
        titleKey: "items.typelift.images.translationCandidates",
        width: 585,
        height: 582,
      },
      {
        src: "/assets/tools/typelift/structured-text.webp",
        alt: "TypeLift translating a structured Git branch name in a terminal window",
        titleKey: "items.typelift.images.floatingInput",
        width: 1812,
        height: 680,
      },
      {
        src: "/assets/tools/typelift/caret-aware-placement.webp",
        alt: "TypeLift input positioned near the active text field in a code editor",
        titleKey: "items.typelift.images.caretPlacement",
        width: 1040,
        height: 594,
      },
      {
        src: "/assets/tools/typelift/multilingual-writing.webp",
        alt: "TypeLift translating an English draft into Japanese",
        titleKey: "items.typelift.images.multilingualWriting",
        width: 1376,
        height: 822,
      },
      {
        src: "/assets/tools/typelift/language-and-translation-paths.webp",
        alt: "TypeLift source, target, and translation path settings",
        titleKey: "items.typelift.images.translationPaths",
        width: 1544,
        height: 1240,
      },
      {
        src: "/assets/tools/typelift/translation-styles.webp",
        alt: "TypeLift configurable large-model translation styles",
        titleKey: "items.typelift.images.translationStyles",
        width: 1544,
        height: 1240,
      },
      {
        src: "/assets/tools/typelift/menu-bar-and-dock.webp",
        alt: "TypeLift menu bar and Dock behavior settings",
        titleKey: "items.typelift.images.menuBarAndDock",
        width: 1544,
        height: 1240,
      },
      {
        src: "/assets/tools/typelift/placement-priority.webp",
        alt: "TypeLift floating window placement priority settings",
        titleKey: "items.typelift.images.placementPriority",
        width: 1544,
        height: 1240,
      },
    ],
  },
  {
    id: "prompt-sketch",
    repoName: "AkashiSensei/PromptSketch",
    repoUrl: "https://github.com/AkashiSensei/PromptSketch",
    githubRepo: "AkashiSensei/PromptSketch",
    repoTags: ["public"],
    role: "author",
    status: "doing",
    featured: true,
    featuredOrder: 2,
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
    repoTags: ["public"],
    role: "author",
    featured: true,
    featuredOrder: 3,
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
    repoTags: ["public"],
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
    repoTags: ["public"],
    role: "author",
    archived: true,
  },
  {
    id: "anysearch-skill",
    repoName: "anysearch-ai/anysearch-skill",
    repoUrl: "https://github.com/anysearch-ai/anysearch-skill",
    githubRepo: "anysearch-ai/anysearch-skill",
    repoTags: ["public"],
    role: "contributor",
  },
  {
    id: "latex-resume",
    repoTags: ["private"],
    role: "author",
    status: "doing",
  },
  {
    id: "tododag",
    repoName: "AkashiSensei/ToDoDAG",
    githubRepo: "AkashiSensei/ToDoDAG",
    repoTags: ["private"],
    role: "author",
    status: "draft",
  },
]

export const featuredSmallTools = [...smallTools]
  .filter((tool) => tool.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 4)
