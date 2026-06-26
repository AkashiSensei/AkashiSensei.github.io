/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

const activityKeys = [
  "fitness",
  "swimming",
  "archery",
  "overwatch",
  "worldOfWarships",
  "photography",
  "travel",
  "flight",
] as const

function Page04(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation("home")

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-04-title fpv-page-copy"
      >
        <h2>{t("fpv.page04.title")}</h2>
        <p className="fpv-page-subtitle">{t("fpv.page04.subtitle")}</p>
      </div>

      <div
        className="fpv-page-node fpv-page-04-card fpv-activity-list"
      >
        {activityKeys.map((activityKey) => {
          const bulletsValue = t(`fpv.page04.activities.${activityKey}.bullets`, {
            returnObjects: true,
          })
          const bullets = Array.isArray(bulletsValue)
            ? bulletsValue.filter((bullet): bullet is string => typeof bullet === "string")
            : []

          return (
            <section key={activityKey}>
              <h3>{t(`fpv.page04.activities.${activityKey}.title`)}</h3>
              <ul>
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div
        className="fpv-page-node fpv-page-04-label fpv-small-aside"
      >
        {t("fpv.page04.aside")}
      </div>
    </div>
  )
}

export const page04Screen: VirtualScreenDefinition = {
  id: "page-04",
  time: 3,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 1.12,
  Component: Page04,
}
