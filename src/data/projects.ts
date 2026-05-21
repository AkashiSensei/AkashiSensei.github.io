export type ProjectStatus = "active" | "early" | "private" | "public"

export type ProjectLink = {
  label: string
  url: string
}

export type Project = {
  id: string
  repoName: string
  externalUrl?: string
  links?: ProjectLink[]
  featured?: boolean
  featuredOrder?: number
  status?: ProjectStatus[]
  tags: string[]
  screenshot?: {
    src: string
    altKey: string
  }
}

export const projects: Project[] = [
  {
    id: "npu-computing-forecast",
    repoName: "AkashiSensei/npu_computing_forecast",
    featured: true,
    featuredOrder: 1,
    status: ["private", "active"],
    tags: ["Python", "Ascend NPU", "Performance", "Experiment Framework"],
  },
  {
    id: "crater",
    repoName: "raids-lab/crater",
    externalUrl: "https://github.com/raids-lab/crater",
    featured: true,
    featuredOrder: 2,
    status: ["public", "active"],
    tags: ["Kubernetes", "AI Platform", "TypeScript", "Helm"],
  },
  {
    id: "crater-cli",
    repoName: "raids-lab/crater/cli",
    externalUrl: "https://github.com/raids-lab/crater/tree/main/cli",
    featured: true,
    featuredOrder: 3,
    status: ["public", "active"],
    tags: ["Go", "CLI", "Cobra", "Testing"],
  },
  {
    id: "undergraduate-thesis",
    repoName: "kernel_analyzer + kernel_data_plotter",
    externalUrl: "https://github.com/AkashiSensei/kernel_analyzer",
    links: [
      {
        label: "kernel_analyzer",
        url: "https://github.com/AkashiSensei/kernel_analyzer",
      },
      {
        label: "kernel_data_plotter",
        url: "https://github.com/AkashiSensei/kernel_data_plotter",
      },
    ],
    featured: true,
    featuredOrder: 4,
    status: ["public"],
    tags: ["Python", "GPU Profiling", "ONNX Runtime", "Research Tooling"],
  },
  {
    id: "model-requirements-evaluator",
    repoName: "AkashiSensei/model-requirements-evaluator-frontend",
    status: ["private"],
    tags: ["Vue", "TypeScript", "ECharts", "Competition"],
  },
  {
    id: "tododag",
    repoName: "AkashiSensei/ToDoDAG",
    status: ["private", "early"],
    tags: ["Swift", "macOS", "DAG", "Product Design"],
  },
  {
    id: "personal-homepage",
    repoName: "AkashiSensei/AkashiSensei.github.io",
    externalUrl: "https://github.com/AkashiSensei/AkashiSensei.github.io",
    status: ["public", "active"],
    tags: ["React", "TypeScript", "i18n", "GitHub Pages"],
  },
]

export const featuredProjects = [...projects]
  .filter((project) => project.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 3)
