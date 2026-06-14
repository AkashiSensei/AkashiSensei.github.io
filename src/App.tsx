import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { HomePage } from "@/pages/HomePage"
import { CourseProjectsPage } from "@/pages/CourseProjectsPage"
import { KnowledgeDetailPage } from "@/pages/KnowledgeDetailPage"
import { KnowledgePage } from "@/pages/KnowledgePage"
import { ProjectDetailPage } from "@/pages/ProjectDetailPage"
import { ProjectsPage } from "@/pages/ProjectsPage"
import { ResumePage } from "@/pages/ResumePage"
import { SmallToolDetailPage } from "@/pages/SmallToolDetailPage"
import { ToolsPage } from "@/pages/ToolsPage"
import { WorkbenchPage } from "@/pages/WorkbenchPage"
import { courseProjects } from "@/data/course-projects"
import { knowledgeEntries } from "@/data/knowledge"
import { projects } from "@/data/projects"
import { smallTools } from "@/data/tools"

const pageTitles: Record<string, string> = {
  "/": "Akashi - Homepage",
  "/resume": "Akashi - Resume",
  "/projects": "Akashi - Projects",
  "/course-projects": "Akashi - Course Projects",
  "/workbench": "Akashi - Workspace",
  "/tools": "Akashi - Tools",
  "/knowledge": "Akashi - Knowledge",
}

function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (pathname.startsWith("/projects/")) {
      document.title = "Akashi - Project Detail"
      return
    }

    if (pathname.startsWith("/course-projects/")) {
      document.title = "Akashi - Course Project Detail"
      return
    }

    if (pathname.startsWith("/tools/")) {
      document.title = "Akashi - Tool Detail"
      return
    }

    if (pathname.startsWith("/knowledge/")) {
      document.title = "Akashi - Knowledge Detail"
      return
    }

    document.title = pageTitles[pathname] ?? "Akashi - Not Found"
  }, [pathname])

  return null
}

function NotFoundPage() {
  const { t } = useTranslation("common")

  return (
    <Layout>
      <section className="flex min-h-[calc(100svh-11rem)] max-w-xl flex-col justify-center gap-5 py-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
          404
        </p>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("notFound.title")}
          </h1>
          <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">
            {t("notFound.description")}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="mt-2 w-fit rounded-full border-white/40 bg-white/40 px-5 backdrop-blur-md transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <AppLink to="/">{t("notFound.homeCta")}</AppLink>
        </Button>
      </section>
    </Layout>
  )
}

function App() {
  return (
    <>
      <RouteEffects />
      <div className="site-background" aria-hidden="true" />
      <div className="site-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route
            path="/projects/:projectId"
            element={<ProjectDetailPage projects={projects} />}
          />
          <Route path="/course-projects" element={<CourseProjectsPage />} />
          <Route
            path="/course-projects/:projectId"
            element={
              <ProjectDetailPage
                projects={courseProjects}
                translationNamespace="courseProjects"
                fallbackPath="/course-projects"
              />
            }
          />
          <Route path="/workbench" element={<WorkbenchPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route
            path="/knowledge/:entryId"
            element={<KnowledgeDetailPage entries={knowledgeEntries} />}
          />
          <Route
            path="/tools/:toolId"
            element={<SmallToolDetailPage tools={smallTools} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
