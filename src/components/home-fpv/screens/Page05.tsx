/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

const searchLineKeys = ["ai", "future", "world", "balance"] as const

function Page05(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation("home")

  return (
    <div className="fpv-virtual-page">
      <div
        className="fpv-page-node fpv-page-05-title fpv-page-copy"
      >
        <h2>{t("fpv.page05.title")}</h2>
        <p className="fpv-page-subtitle">{t("fpv.page05.subtitle")}</p>
      </div>

      <div
        className="fpv-page-node fpv-page-05-card fpv-note-list fpv-note-list-large"
      >
        {searchLineKeys.map((lineKey) => (
          <p key={lineKey}>{t(`fpv.page05.lines.${lineKey}`)}</p>
        ))}
      </div>

      <div
        className="fpv-page-node fpv-page-05-label fpv-page-copy fpv-page-copy-right"
      >
        <p className="fpv-page-endline">{t("fpv.page05.endline")}</p>
        <span className="fpv-floating-whisper">{t("fpv.page05.whisper")}</span>
      </div>
    </div>
  )
}

export const page05Screen: VirtualScreenDefinition = {
  id: "page-05",
  time: 5.5,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 1.12,
  Component: Page05,
}
