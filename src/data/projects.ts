export type ProjectStatus = "active" | "early" | "private" | "public"
export type ProjectLifecycleStatus = "starting" | "ongoing" | "completed"
export type ProjectRepoTag =
  | "backend"
  | "customized"
  | "fork"
  | "frontend"
  | "main"
  | "private"
  | "public"

export type ProjectLink = {
  label: string
  url?: string
  githubRepo?: string
  repoTags?: ProjectRepoTag[]
}

export type ProjectImage = {
  src: string
  altKey: string
  width: number
  height: number
}

export type Project = {
  id: string
  repoName: string
  externalUrl?: string
  githubRepo?: string
  repoTags?: ProjectRepoTag[]
  links?: ProjectLink[]
  featured?: boolean
  featuredOrder?: number
  highlightPointIndexes?: number[]
  lifecycleStatus: ProjectLifecycleStatus
  status?: ProjectStatus[]
  tags: string[]
  images?: ProjectImage[]
  screenshot?: {
    src: string
    altKey: string
  }
}

export const projects: Project[] = [
  {
    id: "crater",
    repoName: "raids-lab/crater",
    links: [
      {
        label: "raids-lab/crater",
        url: "https://github.com/raids-lab/crater",
        githubRepo: "raids-lab/crater",
        repoTags: ["public", "main"],
      },
      {
        label: "AkashiSensei/crater",
        url: "https://github.com/AkashiSensei/crater",
        githubRepo: "AkashiSensei/crater",
        repoTags: ["public", "fork"],
      },
      {
        label: "AkashiSensei/zhejianglab-crater",
        url: "https://github.com/AkashiSensei/zhejianglab-crater",
        githubRepo: "AkashiSensei/zhejianglab-crater",
        repoTags: ["public", "customized"],
      },
    ],
    featured: true,
    featuredOrder: 1,
    lifecycleStatus: "ongoing",
    status: ["public", "active"],
    tags: [
      "Kubernetes",
      "AI Platform",
      "TypeScript",
      "Helm",
      "Scheduler",
      "Jupyter Notebook",
      "Web IDE",
      "Volcano",
      "BuildKit",
      "Buildx",
      "Envd",
      "TensorBoard",
    ],
    images: [
      {
        src: "/assets/projects/crater/node-management.webp",
        altKey: "items.crater.images.nodeManagement",
        width: 2622,
        height: 1582,
      },
      {
        src: "/assets/projects/crater/accelerator-management.webp",
        altKey: "items.crater.images.acceleratorManagement",
        width: 2622,
        height: 1582,
      },
      {
        src: "/assets/projects/crater/architecture-diagram.webp",
        altKey: "items.crater.images.architectureDiagram",
        width: 2132,
        height: 1279,
      },
      {
        src: "/assets/projects/crater/first-stable-release.webp",
        altKey: "items.crater.images.firstStableRelease",
        width: 2914,
        height: 1938,
      },
      {
        src: "/assets/projects/crater/job-management.webp",
        altKey: "items.crater.images.jobManagement",
        width: 2622,
        height: 1582,
      },
      {
        src: "/assets/projects/crater/data-management.webp",
        altKey: "items.crater.images.dataManagement",
        width: 2622,
        height: 1582,
      },
      {
        src: "/assets/projects/crater/image-list.webp",
        altKey: "items.crater.images.imageList",
        width: 2622,
        height: 1582,
      },
    ],
  },
  {
    id: "npu-computing-forecast",
    repoName: "AkashiSensei/npu_computing_forecast",
    githubRepo: "AkashiSensei/npu_computing_forecast",
    repoTags: ["private"],
    featured: true,
    featuredOrder: 2,
    lifecycleStatus: "ongoing",
    status: ["private", "active"],
    tags: ["Python", "Ascend NPU", "Performance", "Experiment Framework"],
    images: [
      {
        src: "/assets/projects/npu-computing-forecast/predictor-interface.webp",
        altKey: "items.npu-computing-forecast.images.predictorInterface",
        width: 1280,
        height: 780,
      },
      {
        src: "/assets/projects/npu-computing-forecast/cpu-metrics-comparison.webp",
        altKey: "items.npu-computing-forecast.images.cpuMetricsComparison",
        width: 1280,
        height: 942,
      },
      {
        src: "/assets/projects/npu-computing-forecast/qwen-inference-resource-usage.webp",
        altKey: "items.npu-computing-forecast.images.qwenInferenceResourceUsage",
        width: 1280,
        height: 1064,
      },
    ],
  },
  {
    id: "crater-cli",
    repoName: "raids-lab/crater/cli",
    externalUrl: "https://github.com/raids-lab/crater/tree/main/cli",
    githubRepo: "raids-lab/crater",
    repoTags: ["public"],
    featured: true,
    featuredOrder: 3,
    lifecycleStatus: "ongoing",
    status: ["public", "active"],
    tags: ["Go", "CLI", "Cobra", "Testing"],
    images: [
      {
        src: "/assets/projects/crater-cli/cli-architecture.webp",
        altKey: "items.crater-cli.images.cliArchitecture",
        width: 1672,
        height: 941,
      },
      {
        src: "/assets/projects/crater-cli/arrange-skill.webp",
        altKey: "items.crater-cli.images.arrangeSkill",
        width: 2686,
        height: 1874,
      },
      {
        src: "/assets/projects/crater-cli/help-message.webp",
        altKey: "items.crater-cli.images.helpMessage",
        width: 1314,
        height: 510,
      },
      {
        src: "/assets/projects/crater-cli/json-error-output.webp",
        altKey: "items.crater-cli.images.jsonErrorOutput",
        width: 1386,
        height: 758,
      },
      {
        src: "/assets/projects/crater-cli/pr-comment-review-snapshot.webp",
        altKey: "items.crater-cli.images.prCommentReviewSnapshot",
        width: 3108,
        height: 1938,
      },
    ],
  },
  {
    id: "model-requirements-evaluator",
    repoName: "AkashiSensei/model-requirements-evaluator-frontend",
    links: [
      {
        label: "AkashiSensei/model-requirements-evaluator-frontend",
        githubRepo: "AkashiSensei/model-requirements-evaluator-frontend",
        repoTags: ["private", "frontend"],
      },
      {
        label: "Cx330-502/Big-Big-Wolf",
        githubRepo: "Cx330-502/Big-Big-Wolf",
        repoTags: ["private", "backend"],
      },
    ],
    lifecycleStatus: "completed",
    status: ["private"],
    tags: ["Vue", "TypeScript", "ECharts", "Competition"],
    images: [
      {
        src: "/assets/projects/model-requirements-evaluator/decision-support-charts.webp",
        altKey: "items.model-requirements-evaluator.images.decisionSupportCharts",
        width: 720,
        height: 443,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/gpu-management.webp",
        altKey: "items.model-requirements-evaluator.images.gpuManagement",
        width: 720,
        height: 443,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/model-management.webp",
        altKey: "items.model-requirements-evaluator.images.modelManagement",
        width: 720,
        height: 443,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/multidimensional-user-input.webp",
        altKey: "items.model-requirements-evaluator.images.multidimensionalUserInput",
        width: 720,
        height: 443,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/result-tabs-memory-breakdown.webp",
        altKey: "items.model-requirements-evaluator.images.resultTabsMemoryBreakdown",
        width: 720,
        height: 443,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/latency-breakdown.webp",
        altKey: "items.model-requirements-evaluator.images.latencyBreakdown",
        width: 720,
        height: 443,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/model-architecture.webp",
        altKey: "items.model-requirements-evaluator.images.modelArchitecture",
        width: 5028,
        height: 2134,
      },
      {
        src: "/assets/projects/model-requirements-evaluator/partial-data.webp",
        altKey: "items.model-requirements-evaluator.images.partialData",
        width: 5104,
        height: 1958,
      },
    ],
  },
  {
    id: "tododag",
    repoName: "AkashiSensei/ToDoDAG",
    githubRepo: "AkashiSensei/ToDoDAG",
    repoTags: ["private"],
    lifecycleStatus: "starting",
    status: ["private", "early"],
    tags: ["Swift", "macOS", "DAG", "Product Design"],
  },
  {
    id: "personal-homepage",
    repoName: "AkashiSensei/AkashiSensei.github.io",
    externalUrl: "https://github.com/AkashiSensei/AkashiSensei.github.io",
    githubRepo: "AkashiSensei/AkashiSensei.github.io",
    repoTags: ["public", "frontend"],
    lifecycleStatus: "ongoing",
    status: ["public", "active"],
    tags: ["React", "TypeScript", "Tailwind CSS", "shadcn/ui", "i18n", "GitHub Pages"],
  },
]

export const featuredProjects = [...projects]
  .filter((project) => project.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 3)
