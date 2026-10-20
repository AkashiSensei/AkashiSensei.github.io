import { type ImageBrightness } from "@/lib/image-brightness"

export type KnowledgeEntry = {
  id: string
  url: string
  repoName: string
  githubRepo?: string
  repoTags?: ("private" | "public")[]
  externalLinks?: {
    url: string
    labelKey: string
    badgeKeys?: string[]
  }[]
  kind: "blog" | "researchVault" | "digest" | "insights" | "practice"
  featured?: boolean
  featuredOrder?: number
  listingPointLimit?: number
  updatedAt: string
  tags: string[]
  images?: {
    src: string
    altKey: string
    width: number
    height: number
    brightness?: ImageBrightness
  }[]
}

export const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: "blob-article",
    url: "https://github.com/AkashiSensei/blog-article",
    repoName: "AkashiSensei/blog-article",
    githubRepo: "AkashiSensei/blog-article",
    repoTags: ["public"],
    externalLinks: [
      {
        url: "https://www.zhihu.com/people/heal-me-please/posts",
        labelKey: "externalLinks.blogPublishedPage",
        badgeKeys: ["externalLinks.badges.chinese", "externalLinks.badges.loginRequired"],
      },
    ],
    kind: "blog",
    featured: false,
    updatedAt: "2026-06",
    tags: ["AI Productivity", "Engineering", "Cloud Native"],
    images: [
      {
        src: "/assets/knowledge/blob-article/ai-review.webp",
        altKey: "items.blob-article.images.aiReview",
        width: 2514,
        height: 1848,
      },
      {
        src: "/assets/knowledge/blob-article/cli-thinking.webp",
        altKey: "items.blob-article.images.cliThinking",
        width: 2514,
        height: 1848,
      },
      {
        src: "/assets/knowledge/blob-article/zhihu-publish.webp",
        altKey: "items.blob-article.images.zhihuPublish",
        width: 1237,
        height: 868,
        brightness: "high",
      },
    ],
  },
  {
    id: "paper-vault",
    url: "https://github.com/AkashiSensei/knowledge-vault",
    repoName: "AkashiSensei/knowledge-vault",
    githubRepo: "AkashiSensei/knowledge-vault",
    repoTags: ["public"],
    kind: "researchVault",
    featured: true,
    featuredOrder: 2,
    updatedAt: "2026-10",
    tags: ["Knowledge Notes", "Paper Notes", "AI Infrastructure", "LLM"],
    images: [
      {
        src: "/assets/knowledge/paper-vault/parallelism.webp",
        altKey: "items.paper-vault.images.parallelism",
        width: 2558,
        height: 1752,
        brightness: "high",
      },
      {
        src: "/assets/knowledge/paper-vault/paper-guide.webp",
        altKey: "items.paper-vault.images.paperGuide",
        width: 2678,
        height: 2032,
      },
      {
        src: "/assets/knowledge/paper-vault/inference.webp",
        altKey: "items.paper-vault.images.inference",
        width: 2558,
        height: 1752,
        brightness: "high",
      },
      {
        src: "/assets/knowledge/paper-vault/paper-skill.webp",
        altKey: "items.paper-vault.images.paperSkill",
        width: 2678,
        height: 2032,
      },
      {
        src: "/assets/knowledge/paper-vault/indexes.webp",
        altKey: "items.paper-vault.images.indexes",
        width: 2678,
        height: 2032,
      },
    ],
  },
  {
    id: "ai-builders-digest",
    url: "https://github.com/AkashiSensei/ai-builders-digest",
    repoName: "AkashiSensei/ai-builders-digest",
    githubRepo: "AkashiSensei/ai-builders-digest",
    repoTags: ["public"],
    kind: "digest",
    featured: false,
    updatedAt: "2026-06",
    tags: ["AI Builders", "Digest", "Bilingual"],
    images: [
      {
        src: "/assets/knowledge/ai-builders-digest/index.webp",
        altKey: "items.ai-builders-digest.images.index",
        width: 1195,
        height: 939,
      },
      {
        src: "/assets/knowledge/ai-builders-digest/daily.webp",
        altKey: "items.ai-builders-digest.images.daily",
        width: 917,
        height: 769,
      },
    ],
  },
  {
    id: "crater-insights",
    url: "https://github.com/AkashiSensei/crater-insights",
    repoName: "AkashiSensei/crater-insights",
    githubRepo: "AkashiSensei/crater-insights",
    repoTags: ["public"],
    kind: "insights",
    featured: true,
    featuredOrder: 1,
    updatedAt: "2026-04",
    tags: ["Crater", "Platform Engineering", "Kubernetes"],
    images: [
      {
        src: "/assets/knowledge/crater-insights/frontend-nesting.webp",
        altKey: "items.crater-insights.images.frontendNesting",
        width: 1958,
        height: 1214,
      },
      {
        src: "/assets/knowledge/crater-insights/auth-flow.webp",
        altKey: "items.crater-insights.images.authFlow",
        width: 1710,
        height: 2326,
      },
    ],
  },
  {
    id: "oj-solutions",
    url: "https://github.com/AkashiSensei/oj-solutions",
    repoName: "AkashiSensei/oj-solutions",
    githubRepo: "AkashiSensei/oj-solutions",
    repoTags: ["public"],
    kind: "practice",
    featured: true,
    featuredOrder: 3,
    listingPointLimit: 4,
    updatedAt: "2026-10",
    tags: ["Algorithms", "LeetCode", "Codeforces", "C", "C++", "Go"],
    images: [
      {
        src: "/assets/knowledge/oj-solutions/implementation-index.webp",
        altKey: "items.oj-solutions.images.implementationIndex",
        width: 2292,
        height: 1598,
      },
      {
        src: "/assets/knowledge/oj-solutions/leetcode-submissions.webp",
        altKey: "items.oj-solutions.images.leetcodeSubmissions",
        width: 1250,
        height: 801,
      },
      {
        src: "/assets/knowledge/oj-solutions/lldb-debugging.webp",
        altKey: "items.oj-solutions.images.lldbDebugging",
        width: 5102,
        height: 2808,
      },
      {
        src: "/assets/knowledge/oj-solutions/lldb-tui.webp",
        altKey: "items.oj-solutions.images.lldbTui",
        width: 5104,
        height: 2802,
      },
    ],
  },
]

export const featuredKnowledgeEntries = [...knowledgeEntries]
  .filter((entry) => entry.featured)
  .sort((left, right) => (left.featuredOrder ?? 0) - (right.featuredOrder ?? 0))
  .slice(0, 3)
