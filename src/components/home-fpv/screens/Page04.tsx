/* eslint-disable react-refresh/only-export-components */
import type { VirtualScreenDefinition, VirtualScreenProps } from "../types"
import { useTranslation } from "react-i18next"

const activityKeys = [
  "archery",
  "swimming",
  "fitness",
  "overwatch",
  "worldOfWarships",
  "photography",
  "travel",
  "flight",
] as const
const activityColumnCount = 4
const activityFloatDepth = 50
const activityEnterStart = -1
const activityEnterDuration = 0.5
const activityLeaveStart = 0
const activityLeaveDuration = 0.5
const activityStaggerStep = 0.125
const activityMaxBlur = 8
const activityMinOpacity = 0.12

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function easeInOutCubic(value: number) {
  return value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2
}

function getActivityStaggerOrder(activityIndex: number) {
  const row = Math.floor(activityIndex / activityColumnCount)
  const column = activityIndex % activityColumnCount

  return row + column
}

function getActivityAttachmentDepth(timeDelta: number, staggerOrder: number) {
  const enterDelay = staggerOrder * activityStaggerStep
  const leaveDelay = staggerOrder * activityStaggerStep
  const enterProgress = clamp01(
    (timeDelta - activityEnterStart - enterDelay) / activityEnterDuration,
  )

  if (enterProgress < 1) {
    return Number((activityFloatDepth * (1 - easeInOutCubic(enterProgress))).toFixed(2))
  }

  const leaveProgress = clamp01(
    (timeDelta - activityLeaveStart - leaveDelay) / activityLeaveDuration,
  )
  const depth = -activityFloatDepth * easeInOutCubic(leaveProgress)

  return Number(depth.toFixed(2))
}

function getActivityAttachmentStyle(timeDelta: number, staggerOrder: number) {
  const enterDelay = staggerOrder * activityStaggerStep
  const leaveDelay = staggerOrder * activityStaggerStep
  const enterProgress = clamp01(
    (timeDelta - activityEnterStart - enterDelay) / activityEnterDuration,
  )
  const leaveProgress = clamp01(
    (timeDelta - activityLeaveStart - leaveDelay) / activityLeaveDuration,
  )
  const visibleProgress =
    enterProgress < 1 ? easeInOutCubic(enterProgress) : 1 - easeInOutCubic(leaveProgress)
  const hiddenProgress = 1 - visibleProgress

  return {
    opacity: Number((activityMinOpacity + (1 - activityMinOpacity) * visibleProgress).toFixed(3)),
    blur: Number((activityMaxBlur * hiddenProgress).toFixed(2)),
  }
}

function Page04(_props: VirtualScreenProps) {
  void _props
  const { t } = useTranslation("home")
  const activityColumns = Array.from({ length: activityColumnCount }, (_, columnIndex) =>
    activityKeys
      .map((activityKey, activityIndex) => ({
        activityKey,
        activityIndex,
      }))
      .filter(({ activityIndex }) => activityIndex % activityColumnCount === columnIndex),
  )

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
        {activityColumns.map((activityColumn, columnIndex) => (
          <div
            key={columnIndex}
            className="fpv-activity-column"
          >
            {activityColumn.map(({ activityKey }) => {
              const bulletsValue = t(`fpv.page04.activities.${activityKey}.bullets`, {
                returnObjects: true,
              })
              const bullets = Array.isArray(bulletsValue)
                ? bulletsValue.filter((bullet): bullet is string => typeof bullet === "string")
                : []

              return (
                <section
                  key={activityKey}
                  className="fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-activity-card"
                  data-fpv-attachment-anchor={`page04-activity-${activityKey}`}
                >
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
        ))}
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
  attachments: activityKeys.map((activityKey, activityIndex) => {
    const staggerOrder = getActivityStaggerOrder(activityIndex)

    return {
      id: `page04-activity-${activityKey}-float`,
      anchor: `page04-activity-${activityKey}`,
      className: "fpv-page-04-activity-float",
      getDepth: ({ timeDelta }) => getActivityAttachmentDepth(timeDelta, staggerOrder),
      getStyle: ({ timeDelta }) => getActivityAttachmentStyle(timeDelta, staggerOrder),
    }
  }),
  Component: Page04,
}
