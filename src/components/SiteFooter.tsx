import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

import { AppLink } from "@/components/AppLink"
import { ContactDialog } from "@/components/ContactDialog"
import { GitHubMark } from "@/components/GitHubMark"
import { useAnimationPreference } from "@/components/animation-provider"
import { useTheme } from "@/components/theme-provider"

const primaryLinks = [
  { to: "/", labelKey: "footer.home" },
  { to: "/resume", labelKey: "nav:resume" },
  { to: "/projects", labelKey: "nav:projects" },
  { to: "/course-projects", labelKey: "nav:coursework" },
  { to: "/workbench", labelKey: "nav:workspace" },
  { to: "/knowledge", labelKey: "nav:knowledge" },
  { to: "/tools", labelKey: "nav:tools" },
] as const

type FooterBreadcrumb = {
  label: string
  to?: string
}

type ResolvedTheme = "dark" | "light"

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => getSystemTheme())

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light")
    }

    updateSystemTheme()
    mediaQuery.addEventListener("change", updateSystemTheme)

    return () => {
      mediaQuery.removeEventListener("change", updateSystemTheme)
    }
  }, [])

  return systemTheme
}

function getItemTitleKey(section: string, id: string) {
  if (section === "projects") {
    return `projects:items.${id}.title`
  }

  if (section === "course-projects") {
    return `courseProjects:items.${id}.title`
  }

  if (section === "knowledge") {
    return `knowledge:items.${id}.title`
  }

  if (section === "tools") {
    return `tools:items.${id}.title`
  }

  return undefined
}

export function SiteFooter() {
  const { t, i18n } = useTranslation(["common", "nav", "projects", "courseProjects", "knowledge", "tools"])
  const { pathname } = useLocation()
  const { animationMode } = useAnimationPreference()
  const { theme } = useTheme()
  const systemTheme = useSystemTheme()
  const currentYear = new Date().getFullYear()
  const currentLanguage = (i18n.resolvedLanguage ?? i18n.language).startsWith("zh")
    ? "zh"
    : "en"
  const themeValue = theme === "system"
    ? t("footer.themeValues.system", {
        theme: t(`footer.themeValues.${systemTheme}`),
      })
    : t(`footer.themeValues.${theme}`)
  const currentSettings = [
    {
      label: t("footer.settings.theme"),
      value: themeValue,
    },
    {
      label: t("footer.settings.displayMode"),
      value: t(`displayMode.${animationMode}.label`),
    },
    {
      label: t("footer.settings.language"),
      value: t(`footer.languageValues.${currentLanguage}`),
    },
  ] as const
  const normalizedPath = pathname.replace(/\/+$/, "") || "/"
  const pathParts = normalizedPath.split("/").filter(Boolean)
  const section = pathParts[0]
  const detailId = pathParts[1] ? decodeURIComponent(pathParts[1]) : undefined
  const homeLabel = t("site.displayName")
  const breadcrumbs: FooterBreadcrumb[] = [{ label: homeLabel, to: "/" }]

  if (normalizedPath === "/") {
    breadcrumbs[0] = { label: homeLabel }
  } else if (section === "resume") {
    breadcrumbs.push({ label: t("nav:resume") })
  } else if (section === "projects") {
    breadcrumbs.push({ label: t("nav:projects"), to: detailId ? "/projects" : undefined })
  } else if (section === "course-projects") {
    breadcrumbs.push({ label: t("nav:coursework"), to: detailId ? "/course-projects" : undefined })
  } else if (section === "workbench") {
    breadcrumbs.push({ label: t("nav:workspace") })
  } else if (section === "knowledge") {
    breadcrumbs.push({ label: t("nav:knowledge"), to: detailId ? "/knowledge" : undefined })
  } else if (section === "tools") {
    breadcrumbs.push({ label: t("nav:tools"), to: detailId ? "/tools" : undefined })
  } else if (section === "receipt-preview") {
    breadcrumbs.push({ label: t("footer.receiptPreview") })
  } else {
    breadcrumbs.push({ label: t("footer.currentPage") })
  }

  const detailTitleKey = detailId ? getItemTitleKey(section, detailId) : undefined

  if (detailTitleKey) {
    breadcrumbs.push({
      label: t(detailTitleKey, { defaultValue: t("footer.currentPage") }),
    })
  }

  return (
    <footer
      className="site-footer"
      data-display-mode={animationMode}
      aria-label={t("footer.landmarkAria")}
    >
      <div className="site-footer-inner">
        <nav className="site-footer-breadcrumbs" aria-label={t("footer.breadcrumbAria")}>
          <ol>
            {breadcrumbs.map((breadcrumb, index) => {
              const isCurrent = index === breadcrumbs.length - 1

              return (
                <li key={`${breadcrumb.label}-${index}`}>
                  {breadcrumb.to && !isCurrent ? (
                    <AppLink to={breadcrumb.to} className="site-footer-breadcrumb-link">
                      {breadcrumb.label}
                    </AppLink>
                  ) : (
                    <span className="site-footer-breadcrumb-current" aria-current={isCurrent ? "page" : undefined}>
                      {breadcrumb.label}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="site-footer-link-region">
          <nav className="site-footer-nav" aria-label={t("footer.navAria")}>
            {primaryLinks.map((link) => (
              <AppLink key={link.to} to={link.to} className="site-footer-link">
                {t(link.labelKey)}
              </AppLink>
            ))}
          </nav>

          <div className="site-footer-actions" aria-label={t("footer.actionsAria")}>
            <a
              href="https://github.com/AkashiSensei"
              target="_blank"
              rel="noreferrer"
              className="site-footer-action"
            >
              <GitHubMark className="h-4 w-4 shrink-0" />
              <span>{t("footer.github")}</span>
            </a>
            <ContactDialog>
              <button type="button" className="site-footer-action">
                {t("footer.contact")}
              </button>
            </ContactDialog>
          </div>
        </div>

        <div className="site-footer-meta">
          <div className="site-footer-settings" aria-label={t("footer.settingsAria")}>
            <dl className="site-footer-settings-list">
              {currentSettings.map((setting) => (
                <div key={setting.label} className="site-footer-settings-item">
                  <dt>{setting.label}</dt>
                  <dd>{setting.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p>{t("footer.copyright", { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  )
}
