import { useTranslation } from "react-i18next"
import { ArrowLeft } from "lucide-react"

import { Layout } from "@/components/Layout"
import { AppLink } from "@/components/AppLink"
import { SoftwareGroupGrid } from "@/components/SoftwareGroupGrid"
import { workbenchGroups } from "@/data/workbench"

export function WorkbenchPage() {
  const { t } = useTranslation("workbench")

  return (
    <Layout>
      <div className="mt-2 flex w-full max-w-5xl flex-col gap-8 sm:mt-4 sm:gap-12">
        <div className="flex flex-col px-2 sm:px-4">
          <AppLink 
            to="/" 
            className="group mb-4 inline-flex w-fit items-center justify-center transition-all"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-10 w-10 text-foreground/40 group-hover:text-foreground/80 group-hover:-translate-x-1 transition-all duration-300" />
          </AppLink>

          <header className="flex flex-col gap-3 sm:gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
            <p className="text-base leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-lg">
              {t("subtitle")}
            </p>
          </header>
        </div>

        <SoftwareGroupGrid groups={workbenchGroups} />
      </div>
    </Layout>
  )
}
