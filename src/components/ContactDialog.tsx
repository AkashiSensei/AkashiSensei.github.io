import { type ReactNode, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Check, Copy, Mail } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { InstagramMark, XMark, ZhihuMark } from "@/components/BrandMarks"
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
const profileAssetUrls = [
  "/assets/profile/dsc-4145-cutout.webp",
  "/assets/profile/akashi.webp",
  "/assets/demo/grain.webp",
  "/assets/demo/iconpattern.png",
] as const
let profileAssetsReadyPromise: Promise<void> | null = null

function ensureProfileAssetsReady() {
  if (typeof Image === "undefined") {
    return Promise.resolve()
  }

  if (!profileAssetsReadyPromise) {
    profileAssetsReadyPromise = Promise.all(
      profileAssetUrls.map((src) => {
        const image = new Image()
        image.src = src

        if (typeof image.decode === "function") {
          return image.decode().catch(() => undefined)
        }

        return new Promise<void>((resolve) => {
          if (image.complete) {
            resolve()
            return
          }

          image.onload = () => resolve()
          image.onerror = () => resolve()
        })
      }),
    ).then(() => undefined)
  }

  return profileAssetsReadyPromise
}

const socialLinkClassName =
  "inline-flex h-8 items-center gap-1 rounded-full border border-foreground bg-foreground px-2 text-xs font-medium text-background shadow-sm transition-colors hover:bg-foreground/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45 md:h-9 md:gap-1.5 md:px-3 md:text-sm"

export function ContactDialog({ children }: { children: ReactNode }) {
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(false)
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const [roleTagIndex, setRoleTagIndex] = useState(0)
  const [statusTagIndex, setStatusTagIndex] = useState(0)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const openRequestRef = useRef(0)
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
    if (!open) {
      return
    }

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
  }, [open])

  useEffect(() => {
    void ensureProfileAssetsReady()

    return () => {
      openRequestRef.current += 1

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

  const handleOpenChange = (nextOpen: boolean) => {
    const requestId = openRequestRef.current + 1
    openRequestRef.current = requestId

    if (!nextOpen) {
      setOpen(false)
      return
    }

    setRoleTagIndex(0)
    setStatusTagIndex(0)

    void ensureProfileAssetsReady().then(() => {
      if (openRequestRef.current === requestId) {
        setOpen(true)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <SpotlightCard asChild>
        <DialogContent
          ref={dialogContentRef}
          className="contact-dialog-content lit-glass-card workbench-preview-glass workbench-preview-glass-enter max-h-[calc(100svh-1rem)] w-[calc(100%-2rem)] max-w-none overflow-y-auto rounded-[2rem] border-[rgb(var(--site-surface-rgb)_/_0.62)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] p-3 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:max-w-none sm:p-4 md:max-h-[calc(100svh-2rem)] md:w-full md:max-w-4xl md:rounded-3xl md:p-5"
          onOpenAutoFocus={(event) => {
            if (window.matchMedia("(max-width: 767px)").matches) {
              event.preventDefault()
              dialogContentRef.current?.focus({ preventScroll: true })
            }
          }}
        >
          <div className="grid gap-3 md:grid-cols-[minmax(15rem,18rem)_minmax(0,1fr)] md:items-center md:gap-5">
            <div className="flex min-w-0 justify-center">
              <ProfileCard
                avatarX="-6%"
                avatarY="7%"
                avatarHeight={1424}
                avatarUrl="/assets/profile/dsc-4145-cutout.webp"
                avatarWidth={1105}
                className="contact-profile-card"
                enableMobileTilt
                imageLoading="eager"
                name="Akashi"
                role={currentRoleTag}
                roleOffsetY="0px"
                grainUrl="/assets/demo/grain.webp"
                iconUrl="/assets/demo/iconpattern.png"
                miniAvatarHeight={2701}
                miniAvatarUrl="/assets/profile/akashi.webp"
                miniAvatarWidth={2701}
                showUserInfo
                status={currentStatusTag}
              />
            </div>
            <div className="grid min-w-0 gap-2 px-2 py-0 sm:gap-2.5 sm:px-3 md:min-h-[24rem] md:grid-rows-[auto_minmax(0,1fr)_auto] md:gap-5 md:px-2 md:py-3">
              <div className="flex min-w-0 flex-col gap-2 px-0 md:gap-3 md:px-0.5">
                <div className="hidden flex-col gap-1.5 md:flex">
                  <p className="text-[1.7rem] font-semibold leading-[1.02] text-tone-4 sm:text-[2rem] md:text-[2.2rem]">
                    {t("contactDialog.casualTitle")}
                  </p>
                  <p className="text-[0.9375rem] leading-relaxed text-tone-1">
                    {t("contactDialog.casualDescription")}
                  </p>
                </div>
                <ul
                  aria-label={t("contactDialog.casualTopicsLabel")}
                  className="flex w-full max-w-full snap-x snap-proximity gap-1.5 overflow-x-auto overscroll-x-contain py-0.5 pr-2 [mask-image:linear-gradient(to_right,black_0,black_calc(100%_-_0.75rem),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0,black_calc(100%_-_0.75rem),transparent_100%)] [scrollbar-width:none] md:flex-wrap md:gap-2 md:overflow-visible md:overscroll-auto md:p-0 md:[mask-image:none] md:[-webkit-mask-image:none] [&::-webkit-scrollbar]:hidden"
                >
                  {casualTopics.map((topic) => (
                    <li
                      key={topic}
                      className="shrink-0 snap-start rounded-full border border-foreground/12 bg-foreground/5 px-2.5 py-1 text-xs font-medium text-tone-1 dark:border-white/10 dark:bg-white/5 md:snap-align-none"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-center gap-1.5 py-0 md:gap-2 md:py-4">
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
                  className="group flex min-h-12 w-full items-center gap-2.5 rounded-xl bg-foreground/5 p-1.5 text-left transition-colors hover:bg-foreground/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35 md:hidden"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="font-medium text-tone-1">{t("contactDialog.email")}</span>
                    <span className="truncate text-sm text-tone-4">{emailAddress}</span>
                  </div>
                </a>
              </div>

              <div className="mt-1.5 flex flex-nowrap justify-start gap-1.5 md:mt-0 md:flex-wrap md:gap-2">
                <a
                  href="https://github.com/AkashiSensei"
                  target="_blank"
                  rel="noreferrer"
                  className={socialLinkClassName}
                >
                  <GitHubMark className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  GitHub
                </a>
                <a
                  href="https://www.zhihu.com/people/heal-me-please"
                  target="_blank"
                  rel="noreferrer"
                  className={socialLinkClassName}
                >
                  <ZhihuMark className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  {t("contactDialog.zhihuLink")}
                </a>
                <a
                  href="https://www.instagram.com/akashisensei223/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className={socialLinkClassName}
                >
                  <InstagramMark className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  IG
                </a>
                <a
                  href="https://x.com/akashisensei223"
                  target="_blank"
                  rel="noreferrer"
                  className={socialLinkClassName}
                >
                  <XMark className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
