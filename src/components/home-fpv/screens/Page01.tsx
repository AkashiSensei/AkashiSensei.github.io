/* eslint-disable react-refresh/only-export-components */
import { ContactDialog } from "@/components/ContactDialog"

import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

const page01TagKeys = ["student", "infj", "anime"] as const

function Page01ActionRow() {
  const { t } = useTranslation("home")

  return (
    <div className="fpv-action-row fpv-page-01-action-row">
      <ContactDialog>
        <button type="button" className="fpv-action-pill fpv-action-pill-solid">
          {t("fpv.page01.cta")}
        </button>
      </ContactDialog>
      <a href="/resume" className="fpv-action-pill fpv-action-pill-outline">
        简历
      </a>
    </div>
  )
}

function Page01({ isMobileViewport }: VirtualScreenProps) {
  const { t } = useTranslation("home")

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-01-intro fpv-page-copy"
      >
        <div className="fpv-tag-row">
          {page01TagKeys.map((tagKey) => (
            <span key={tagKey}>{t(`fpv.page01.tags.${tagKey}`)}</span>
          ))}
        </div>
        <h1
          className="fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-page-01-title-anchor"
          data-fpv-attachment-anchor="page01-title"
        >
          {t("fpv.page01.title")}
        </h1>
        <p className="fpv-page-maxim">{t("fpv.page01.maxim")}</p>
        {/* zh/en copy intentionally diverges here to tune the FPV display. */}
        <div className="fpv-page-line-stack">
          <p>{t("fpv.page01.lines.softwareMaster")}</p>
          <p>{t("fpv.page01.lines.building")}</p>
          <p>{t("fpv.page01.lines.friend")}</p>
        </div>
        {isMobileViewport ?
          <Page01ActionRow />
        : <div
            className="fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-action-row fpv-page-01-action-row fpv-page-01-action-row-anchor"
            data-fpv-attachment-anchor="page01-actions"
          >
            <button type="button" className="fpv-action-pill fpv-action-pill-solid">
              {t("fpv.page01.cta")}
            </button>
            <a href="/resume" className="fpv-action-pill fpv-action-pill-outline">
              简历
            </a>
          </div>
        }
      </div>
    </div>
  )
}

export const page01Screen: VirtualScreenDefinition = {
  id: "page-01",
  time: 0,
  distanceMultiplier: 0.2,
  visibleBefore: 0.2,
  visibleAfter: 1.12,
  attachments: [
    {
      id: "page01-title-float",
      anchor: "page01-title",
      depth: 20,
      className: "fpv-page-01-title-float",
    },
    {
      id: "page01-actions-float",
      anchor: "page01-actions",
      depth: 20,
      className: "fpv-page-01-actions-float",
      interactive: true,
      cloneAnchor: false,
      Component: Page01ActionRow,
    },
  ],
  Component: Page01,
}
