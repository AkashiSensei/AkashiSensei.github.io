import { type ReactNode, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Check, Copy, Mail } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { XMark, ZhihuMark } from "@/components/BrandMarks"
import { GitHubMark } from "@/components/GitHubMark"
import { ProfileCard } from "@/components/ProfileCard"
import { SpotlightCard } from "@/components/SpotlightCard"

const profileRoleTags = ["Developer", "Engineer", "Product Manager", "Explorer"] as const
const profileRoleRotationMs = 3500
const profileStatusTags = [
  "Coding",
  "Sleeping",
  "Shooting",
  "Prompting",
  "Playing",
  "Working Out",
  "Exploring",
  "Writing",
  "Studying",
] as const
const profileStatusRotationMs = 2500
const socialLinkClassName =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-foreground bg-foreground px-3 text-sm font-medium text-background shadow-sm transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45"

export function ContactDialog({ children }: { children: ReactNode }) {
  const { t } = useTranslation("common")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const [roleTagIndex, setRoleTagIndex] = useState(0)
  const [statusTagIndex, setStatusTagIndex] = useState(0)
  const resetCopyStateTimeoutRef = useRef<number | null>(null)
  const emailAddress = "fengzhiyuyi2013@gmail.com"
  const currentRoleTag = profileRoleTags[roleTagIndex]
  const currentStatusTag = profileStatusTags[statusTagIndex]
  const casualTopicsValue = t("contactDialog.casualTopics", {
    returnObjects: true,
  })
  const casualTopics = Array.isArray(casualTopicsValue)
    ? casualTopicsValue.filter((topic): topic is string => typeof topic === "string")
    : []

  useEffect(() => {
    const roleTagInterval = window.setInterval(() => {
      setRoleTagIndex((currentIndex) => (currentIndex + 1) % profileRoleTags.length)
    }, profileRoleRotationMs)
    const statusTagInterval = window.setInterval(() => {
      setStatusTagIndex((currentIndex) => (currentIndex + 1) % profileStatusTags.length)
    }, profileStatusRotationMs)

    return () => {
      window.clearInterval(roleTagInterval)
      window.clearInterval(statusTagInterval)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (resetCopyStateTimeoutRef.current !== null) {
        window.clearTimeout(resetCopyStateTimeoutRef.current)
      }
    }
  }, [])

  const copyEmailAddress = async () => {
    if (resetCopyStateTimeoutRef.current !== null) {
      window.clearTimeout(resetCopyStateTimeoutRef.current)
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(emailAddress)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = emailAddress
        textArea.setAttribute("readonly", "")
        textArea.style.position = "fixed"
        textArea.style.top = "-9999px"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }

      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }

    resetCopyStateTimeoutRef.current = window.setTimeout(() => {
      setCopyState("idle")
      resetCopyStateTimeoutRef.current = null
    }, 1800)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <SpotlightCard asChild>
        <DialogContent className="lit-glass-card workbench-preview-glass workbench-preview-glass-enter max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl border-[rgb(var(--site-surface-rgb)_/_0.62)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] p-4 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:max-w-4xl sm:p-5">
          <div className="grid gap-5 md:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] md:items-center">
            <div className="flex justify-center">
              <ProfileCard
                avatarX="-6%"
                avatarY="7%"
                avatarUrl="/assets/profile/dsc-4145-cutout.webp"
                enableMobileTilt
                name="Akashi"
                role={currentRoleTag}
                roleOffsetY="0px"
                grainUrl="/assets/demo/grain.webp"
                iconUrl="/assets/demo/iconpattern.png"
                miniAvatarUrl="/assets/profile/akashi.webp"
                showUserInfo
                status={currentStatusTag}
              />
            </div>
            <div className="grid min-w-0 gap-5 px-1 py-1 sm:px-2 md:min-h-[24rem] md:grid-rows-[auto_minmax(0,1fr)_auto] md:py-3">
              <div className="flex flex-col gap-3 px-0.5">
                <div className="hidden flex-col gap-1.5 md:flex">
                  <p className="text-[1.7rem] font-semibold leading-[1.02] text-tone-4 sm:text-[2rem] md:text-[2.2rem]">
                    {t("contactDialog.casualTitle")}
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-tone-1">
                    {t("contactDialog.casualDescription")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {casualTopics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-foreground/12 bg-foreground/5 px-2.5 py-1 text-xs font-medium text-tone-1 dark:border-white/10 dark:bg-white/5"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center gap-2 py-0 md:py-4">
                <p className="hidden px-0.5 text-sm leading-relaxed text-tone-3 md:block">
                  {t("contactDialog.privacyNote")}
                </p>

                <button
                  type="button"
                  onClick={copyEmailAddress}
                  className="group hidden w-full items-center gap-4 rounded-2xl bg-transparent p-2 text-left transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 md:flex"
                  title={t("contactDialog.copyEmail")}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="font-medium text-tone-1">{t("contactDialog.email")}</span>
                    <span className="truncate text-sm text-tone-4">{emailAddress}</span>
                  </div>
                  <span
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-tone-1 transition-colors group-hover:bg-foreground/10"
                    aria-live="polite"
                  >
                    {copyState === "copied" ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        {t("contactDialog.copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        {copyState === "failed"
                          ? t("contactDialog.copyFailed")
                          : t("contactDialog.copy")}
                      </>
                    )}
                  </span>
                </button>

                <a
                  href={`mailto:${emailAddress}`}
                  className="group flex w-full items-center gap-3 rounded-2xl bg-foreground/5 p-2 text-left transition-colors hover:bg-foreground/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 md:hidden"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="font-medium text-tone-1">{t("contactDialog.email")}</span>
                    <span className="truncate text-sm text-tone-4">{emailAddress}</span>
                  </div>
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/AkashiSensei"
                  target="_blank"
                  rel="noreferrer"
                  className={socialLinkClassName}
                >
                  <GitHubMark className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="https://www.zhihu.com/people/heal-me-please"
                  target="_blank"
                  rel="noreferrer"
                  className={socialLinkClassName}
                >
                  <ZhihuMark className="h-4 w-4" />
                  {t("contactDialog.zhihuLink")}
                </a>
                <a
                  href="https://x.com/akashisensei223"
                  target="_blank"
                  rel="noreferrer"
                  className={socialLinkClassName}
                >
                  <XMark className="h-4 w-4" />
                  X
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </SpotlightCard>
    </Dialog>
  )
}
