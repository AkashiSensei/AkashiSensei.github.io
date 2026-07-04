/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

type FriendLink = {
  name: string
  quote: string
  avatar: string
  href: string
  hoverLabelKey?: string
}

const FRIEND_QUOTE_MAX_DISPLAY_UNITS = 12
const FRIEND_DESKTOP_MIN_COPY_WIDTH_REM = 4.4
const FRIEND_DESKTOP_MAX_COPY_WIDTH_REM = 18
const FRIEND_MOBILE_MIN_COPY_WIDTH_REM = 2.8
const FRIEND_MOBILE_MAX_COPY_WIDTH_REM = 18

function isFriendLink(value: unknown): value is FriendLink {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<FriendLink>

  return (
    typeof candidate.name === "string"
    && typeof candidate.quote === "string"
    && typeof candidate.avatar === "string"
    && typeof candidate.href === "string"
  )
}

function isImageAvatar(avatar: string) {
  return avatar.startsWith("/") || avatar.startsWith("http://") || avatar.startsWith("https://")
}

function getDisplayUnits(text: string) {
  return Array.from(text).reduce((units, char) => {
    if (/\s/.test(char)) {
      return units + 0.35
    }

    if (/[\u3000-\u9fff\uff00-\uffef]/.test(char)) {
      return units + 1
    }

    if (/[.,'":;!?()[\]{}]/.test(char)) {
      return units + 0.32
    }

    return units + 0.58
  }, 0)
}

function getQuotePreview(text: string, maxUnits: number) {
  let units = 0
  let preview = ""

  for (const char of Array.from(text)) {
    const charUnits = getDisplayUnits(char)

    if (units + charUnits > maxUnits) {
      return {
        preview: `${preview.trimEnd()}...`,
        isTruncated: true,
      }
    }

    preview += char
    units += charUnits
  }

  return {
    preview: text,
    isTruncated: false,
  }
}

function getFriendLinkKey(link: FriendLink) {
  return `${link.name}-${link.href}`
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function areTruncationMapsEqual(
  current: Record<string, boolean>,
  next: Record<string, boolean>,
) {
  const currentKeys = Object.keys(current)
  const nextKeys = Object.keys(next)

  if (currentKeys.length !== nextKeys.length) {
    return false
  }

  return nextKeys.every((key) => current[key] === next[key])
}

function getFriendPillStyle(link: FriendLink, quotePreview: string) {
  const nameUnits = getDisplayUnits(link.name)
  const quoteUnits = getDisplayUnits(`“${quotePreview}”`)
  const desktopNameWidth = nameUnits * 1.1 + 0.35
  const desktopQuoteWidth = quoteUnits * 0.78 + 0.95
  const desktopCopyWidth = clampNumber(
    Math.max(desktopNameWidth, desktopQuoteWidth),
    FRIEND_DESKTOP_MIN_COPY_WIDTH_REM,
    FRIEND_DESKTOP_MAX_COPY_WIDTH_REM,
  )
  const mobileNameWidth = nameUnits * 0.74 + 0.22
  const mobileQuoteWidth = quoteUnits * 0.56 + 0.42
  const mobileCopyWidth = clampNumber(
    Math.max(mobileNameWidth, mobileQuoteWidth),
    FRIEND_MOBILE_MIN_COPY_WIDTH_REM,
    FRIEND_MOBILE_MAX_COPY_WIDTH_REM,
  )

  return {
    "--fpv-friend-pill-copy-width": `${desktopCopyWidth.toFixed(2)}rem`,
    "--fpv-friend-pill-mobile-copy-width": `${mobileCopyWidth.toFixed(2)}rem`,
  } as CSSProperties
}

function Page06(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation("home")
  const friendGridRef = useRef<HTMLDivElement | null>(null)
  const [visuallyTruncatedQuotes, setVisuallyTruncatedQuotes] = useState<Record<string, boolean>>({})
  const linksValue = t("fpv.page06.links", {
    returnObjects: true,
  })
  const links = Array.isArray(linksValue) ? linksValue.filter(isFriendLink) : []
  const linksSignature = links
    .map((link) => `${getFriendLinkKey(link)}:${link.quote}`)
    .join("|")

  useEffect(() => {
    const friendGrid = friendGridRef.current

    if (!friendGrid) {
      return undefined
    }

    let frameId = 0
    let isActive = true

    const measureQuoteOverflow = () => {
      frameId = 0

      if (!isActive) {
        return
      }

      const nextTruncatedQuotes: Record<string, boolean> = {}
      const quoteNodes = friendGrid.querySelectorAll<HTMLElement>(
        "[data-fpv-friend-quote-key]",
      )

      quoteNodes.forEach((quoteNode) => {
        const quoteKey = quoteNode.dataset.fpvFriendQuoteKey

        if (!quoteKey) {
          return
        }

        if (quoteNode.scrollWidth > quoteNode.clientWidth + 1) {
          nextTruncatedQuotes[quoteKey] = true
        }
      })

      setVisuallyTruncatedQuotes((current) => (
        areTruncationMapsEqual(current, nextTruncatedQuotes)
          ? current
          : nextTruncatedQuotes
      ))
    }

    const scheduleQuoteMeasure = () => {
      if (!isActive) {
        return
      }

      if (frameId !== 0) {
        return
      }

      frameId = window.requestAnimationFrame(measureQuoteOverflow)
    }

    scheduleQuoteMeasure()

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(scheduleQuoteMeasure)
    resizeObserver?.observe(friendGrid)
    friendGrid.querySelectorAll<HTMLElement>("[data-fpv-friend-quote-key]")
      .forEach((quoteNode) => resizeObserver?.observe(quoteNode))
    window.addEventListener("resize", scheduleQuoteMeasure)

    const fontSet = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts
    void fontSet?.ready.then(scheduleQuoteMeasure)

    return () => {
      isActive = false

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }

      resizeObserver?.disconnect()
      window.removeEventListener("resize", scheduleQuoteMeasure)
    }
  }, [linksSignature])

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-06-title fpv-page-copy"
      >
        <p className="fpv-page-subtitle">{t("fpv.page06.subtitle")}</p>
        <h2>{t("fpv.page06.title")}</h2>
      </div>

      <div
        ref={friendGridRef}
        className="fpv-page-node fpv-page-06-friends fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-friend-pill-grid"
        data-fpv-attachment-anchor="page06-friend-links"
      >
        {links.map((link) => {
          const linkKey = getFriendLinkKey(link)
          const quote = getQuotePreview(
            link.quote,
            FRIEND_QUOTE_MAX_DISPLAY_UNITS,
          )
          const isQuoteCompressed = quote.isTruncated || Boolean(visuallyTruncatedQuotes[linkKey])
          const quoteTitle = isQuoteCompressed ? `“${link.quote}”` : undefined

          return (
            <a
              key={linkKey}
              className="fpv-friend-pill"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              title={quoteTitle}
              style={getFriendPillStyle(link, quote.preview)}
              data-quote-truncated={isQuoteCompressed ? "true" : undefined}
              data-hover-label={t(
                `fpv.page06.friendHoverLabels.${link.hoverLabelKey ?? "hello"}`,
                { defaultValue: t("fpv.page06.friendHoverLabel") },
              )}
            >
              <span className="fpv-friend-pill-avatar" aria-hidden="true" title={quoteTitle}>
                {isImageAvatar(link.avatar) ? <img src={link.avatar} alt="" /> : link.avatar}
              </span>
              <span className="fpv-friend-pill-copy" title={quoteTitle}>
                <span className="fpv-friend-pill-name" title={quoteTitle}>
                  <span className="fpv-friend-pill-name-text" title={quoteTitle}>{link.name}</span>
                </span>
                <span
                  className="fpv-friend-pill-quote"
                  data-fpv-friend-quote-key={linkKey}
                  title={quoteTitle}
                >
                  “{quote.preview}”
                </span>
              </span>
              <ArrowUpRight className="fpv-friend-pill-icon" aria-hidden="true" />
            </a>
          )
        })}
      </div>

      <div
        className="fpv-page-node fpv-page-06-label fpv-small-aside"
      >
        {t("fpv.page06.aside")}
      </div>
    </div>
  )
}

export const page06Screen: VirtualScreenDefinition = {
  id: "page-06",
  time: 8,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 2.5,
  attachments: [
    {
      id: "page06-friend-links-float",
      anchor: "page06-friend-links",
      className: "fpv-page-06-friend-links-float",
      interactive: true,
    },
  ],
  Component: Page06,
}
