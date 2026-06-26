/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

function Page02(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation(["home", "common"])
  const casualTopicsValue = t("common:contactDialog.casualTopics", {
    returnObjects: true,
  })
  const casualTopics = Array.isArray(casualTopicsValue)
    ? casualTopicsValue.filter((topic): topic is string => typeof topic === "string")
    : []

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-02-title fpv-page-copy"
      >
        <h2>{t("fpv.page02.title")}</h2>
        <p className="fpv-page-subtitle">{t("fpv.page02.subtitle")}</p>
      </div>

      <div
        className="fpv-page-node fpv-page-02-tags fpv-interest-tags"
      >
        {casualTopics.map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>

      <div
        className="fpv-page-node fpv-page-02-notes fpv-note-list"
      >
        <p>{t("fpv.page02.notes.visual")}</p>
        <p>{t("fpv.page02.notes.music")}</p>
        <p>{t("fpv.page02.notes.plushies")}</p>
      </div>

      <div
        className="fpv-page-node fpv-page-02-study-title fpv-page-copy"
      >
        <h2>{t("fpv.page03.title")}</h2>
        <p className="fpv-page-subtitle">{t("fpv.page03.subtitle")}</p>
      </div>

      <div
        className="fpv-page-node fpv-page-02-study-card fpv-page-copy"
      >
        <p className="fpv-page-bigline">{t("fpv.page03.bigline")}</p>
        <div className="fpv-page-line-stack">
          <p>{t("fpv.page03.lines.engineering")}</p>
          <p>{t("fpv.page03.lines.lowLevel")}</p>
          <p>{t("fpv.page03.lines.advisor")}</p>
        </div>
        <a
          href="/resume"
          className="fpv-action-pill fpv-action-pill-solid fpv-page-03-action"
        >
          {t("fpv.page03.cta")}
        </a>
      </div>
    </div>
  )
}

export const page02Screen: VirtualScreenDefinition = {
  id: "page-02",
  time: 1.5,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 1.12,
  Component: Page02,
}
