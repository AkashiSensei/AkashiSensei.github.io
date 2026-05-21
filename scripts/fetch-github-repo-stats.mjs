import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const sourceFiles = ["src/data/projects.ts", "src/data/tools.ts"]
const outputPath = path.join(root, "src/data/generated/github-repo-stats.json")
const legacyOutputPath = path.join(root, "src/data/generated/github-stars.json")

async function loadLocalEnv() {
  for (const envFile of [".env.local", ".env"]) {
    let source

    try {
      source = await readFile(path.join(root, envFile), "utf8")
    } catch {
      continue
    }

    for (const line of source.split(/\r?\n/)) {
      const trimmed = line.trim()

      if (!trimmed || trimmed.startsWith("#")) {
        continue
      }

      const separatorIndex = trimmed.indexOf("=")

      if (separatorIndex === -1) {
        continue
      }

      const key = trimmed.slice(0, separatorIndex).trim()
      const rawValue = trimmed.slice(separatorIndex + 1).trim()
      const value = rawValue.replace(/^["']|["']$/g, "")

      process.env[key] ??= value
    }
  }
}

async function readPreviousSnapshot() {
  for (const previousPath of [outputPath, legacyOutputPath]) {
    try {
      return JSON.parse(await readFile(previousPath, "utf8"))
    } catch {
      // Try the next path.
    }
  }

  return { repos: {} }
}

async function collectRepos() {
  const repos = new Set()

  for (const file of sourceFiles) {
    const source = await readFile(path.join(root, file), "utf8")

    for (const match of source.matchAll(/githubRepo:\s*"([^"]+)"/g)) {
      repos.add(match[1])
    }
  }

  return [...repos].sort()
}

function createGitHubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "AkashiSensei.github.io build",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  const token = process.env.GH_REPO_STATS_TOKEN ?? process.env.GITHUB_TOKEN

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: createGitHubHeaders(),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return {
    data: await response.json(),
    headers: response.headers,
  }
}

function getLastPageFromLinkHeader(linkHeader) {
  if (!linkHeader) {
    return undefined
  }

  const lastLink = linkHeader
    .split(",")
    .map((part) => part.trim())
    .find((part) => part.endsWith('rel="last"'))

  if (!lastLink) {
    return undefined
  }

  const page = lastLink.match(/[?&]page=(\d+)/)?.[1]
  return page ? Number(page) : undefined
}

async function fetchDefaultBranchCommitCount(repo, defaultBranch) {
  const url = new URL(`https://api.github.com/repos/${repo}/commits`)
  url.searchParams.set("sha", defaultBranch)
  url.searchParams.set("per_page", "1")

  const { data, headers } = await fetchJson(url)
  const lastPage = getLastPageFromLinkHeader(headers.get("link"))

  if (lastPage) {
    return lastPage
  }

  return Array.isArray(data) ? data.length : undefined
}

async function fetchRepoStats(repo) {
  const { data } = await fetchJson(`https://api.github.com/repos/${repo}`)
  const commits = await fetchDefaultBranchCommitCount(repo, data.default_branch)

  return {
    commits,
    defaultBranch: data.default_branch,
    fetchedAt: new Date().toISOString(),
    isPrivate: Boolean(data.private),
    stars: data.stargazers_count,
  }
}

await loadLocalEnv()

const previous = await readPreviousSnapshot()
const repos = await collectRepos()
const generatedAt = new Date().toISOString()
const snapshot = {
  generatedAt,
  repos: {},
}

for (const repo of repos) {
  try {
    snapshot.repos[repo] = await fetchRepoStats(repo)
  } catch (error) {
    if (previous.repos?.[repo]) {
      snapshot.repos[repo] = previous.repos[repo]
      console.warn(`Kept previous GitHub repo stats for ${repo}: ${error.message}`)
    } else {
      console.warn(`Skipped GitHub repo stats for ${repo}: ${error.message}`)
    }
  }
}

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`)

console.log(`Wrote GitHub repo stats for ${Object.keys(snapshot.repos).length}/${repos.length} repos.`)
