/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

const rosterKeys = ["pending", "exchange"] as const

function Page06(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation("home")

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-06-title fpv-page-copy"
      >
        <h2>{t("fpv.page06.title")}</h2>
        <p className="fpv-page-subtitle">{t("fpv.page06.subtitle")}</p>
      </div>

      <div
        className="fpv-page-node fpv-page-06-card fpv-link-roster"
      >
        {rosterKeys.map((rosterKey) => (
          <div key={rosterKey}>
            <span>{t(`fpv.page06.roster.${rosterKey}.title`)}</span>
            <p>{t(`fpv.page06.roster.${rosterKey}.description`)}</p>
          </div>
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
  time: 7.5,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 2.5,
  Component: Page06,
}
