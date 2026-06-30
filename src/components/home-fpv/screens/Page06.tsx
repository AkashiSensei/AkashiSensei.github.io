/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

type FriendLink = {
  name: string
  quote: string
  avatar: string
  href: string
  hoverLabelKey?: string
}

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

function Page06(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation("home")
  const linksValue = t("fpv.page06.links", {
    returnObjects: true,
  })
  const links = Array.isArray(linksValue) ? linksValue.filter(isFriendLink) : []

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-06-title fpv-page-copy"
      >
        <p className="fpv-page-subtitle">{t("fpv.page06.subtitle")}</p>
        <h2>{t("fpv.page06.title")}</h2>
      </div>

      <div
        className="fpv-page-node fpv-page-06-friends fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-friend-pill-grid"
        data-fpv-attachment-anchor="page06-friend-links"
      >
        {links.map((link) => (
          <a
            key={`${link.name}-${link.href}`}
            className="fpv-friend-pill"
            href={link.href}
            target="_blank"
            rel="noreferrer"
            data-hover-label={t(
              `fpv.page06.friendHoverLabels.${link.hoverLabelKey ?? "hello"}`,
              { defaultValue: t("fpv.page06.friendHoverLabel") },
            )}
          >
            <span className="fpv-friend-pill-avatar" aria-hidden="true">
              {isImageAvatar(link.avatar) ? <img src={link.avatar} alt="" /> : link.avatar}
            </span>
            <span className="fpv-friend-pill-copy">
              <span className="fpv-friend-pill-name">
                {link.name}
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span className="fpv-friend-pill-quote">“{link.quote}”</span>
            </span>
          </a>
        ))}
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
