/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

const fieldKeys = [
  "study",
  "world",
  "beingHuman",
  "expression",
] as const

function Page02(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation(["home", "common"])
  const casualTopicsValue = t("common:contactDialog.casualTopics", {
    returnObjects: true,
  })
  const casualTopics = Array.isArray(casualTopicsValue)
    ? casualTopicsValue.filter((topic): topic is string => typeof topic === "string")
    : []
  const descriptionValue = t("fpv.page02.description", {
    returnObjects: true,
  })
  const descriptionLines = Array.isArray(descriptionValue)
    ? descriptionValue.filter((line): line is string => typeof line === "string")
    : []

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-02-overview fpv-page-copy"
      >
        <p className="fpv-page-subtitle">{t("fpv.page02.subtitle")}</p>
        <h2>{t("fpv.page02.title")}</h2>

        <div className="fpv-interest-tags">
          {casualTopics.map((topic) => (
            <span key={topic}>{topic}</span>
          ))}
        </div>

        <div className="fpv-page-02-description fpv-note-list">
          {descriptionLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div
        className="fpv-page-node fpv-page-02-field-grid"
      >
        {fieldKeys.map((fieldKey) => {
          const bulletsValue = t(`fpv.page02.fields.${fieldKey}.bullets`, {
            returnObjects: true,
          })
          const bullets = Array.isArray(bulletsValue)
            ? bulletsValue.filter((bullet): bullet is string => typeof bullet === "string")
            : []

          return (
            <section
              key={fieldKey}
              className={`fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-field-card fpv-field-card-${fieldKey}`}
              data-fpv-attachment-anchor={`page02-field-${fieldKey}`}
            >
              <div>
                <p>{t(`fpv.page02.fields.${fieldKey}.subtitle`)}</p>
                <span>{t(`fpv.page02.fields.${fieldKey}.title`)}</span>
              </div>
              <ul>
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {fieldKey === "study" ? (
                <a
                  href="/resume"
                  className="fpv-action-pill fpv-action-pill-solid fpv-page-03-action"
                >
                  {t("fpv.page02.fields.study.cta")}
                </a>
              ) : null}
            </section>
          )
        })}
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
  attachments: [
    {
      id: "page02-field-study-float",
      anchor: "page02-field-study",
      className: "fpv-page-02-field-float fpv-page-02-field-study-float",
      interactive: true,
    },
    {
      id: "page02-field-world-float",
      anchor: "page02-field-world",
      className: "fpv-page-02-field-float fpv-page-02-field-world-float",
    },
    {
      id: "page02-field-being-human-float",
      anchor: "page02-field-beingHuman",
      className: "fpv-page-02-field-float fpv-page-02-field-being-human-float",
    },
    {
      id: "page02-field-expression-float",
      anchor: "page02-field-expression",
      className: "fpv-page-02-field-float fpv-page-02-field-expression-float",
    },
  ],
  Component: Page02,
}
