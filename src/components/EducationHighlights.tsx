import { SectionHeader } from "@/components/SectionHeader"
import { type CSSProperties } from "react"
import { useTranslation } from "react-i18next"

import { FeaturePointList } from "@/components/FeaturePointList"
import { educationTimelineEntries } from "@/data/education"
import { cn } from "@/lib/utils"

const educationEntriesNewestFirst = [...educationTimelineEntries].reverse()

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : []
}

export function EducationHighlights() {
  const { t } = useTranslation("resume")

  return (
    <section
      id="education"
      className="resume-rhythm-section education-rhythm-section flex w-full flex-col justify-center gap-5"
    >
      <SectionHeader title={t("education.title")} subtitle={t("education.subtitle")} />

      <ol className="education-timeline mx-2 sm:mx-3 md:mx-4">
        {educationEntriesNewestFirst.map((entry, index) => {
          const honors = asStringArray(
            t(`education.items.${entry.id}.honors`, { returnObjects: true }),
          )
          const ongoing = entry.endYear === undefined

          return (
            <li
              key={entry.id}
              className="education-stop"
              style={{ "--education-timeline-order": -index } as CSSProperties}
            >
              <span
                className={cn(
                  "education-dot",
                  ongoing ? "education-dot-current" : "education-dot-complete",
                )}
                aria-hidden="true"
              />
              <div className="education-stop-body">
                {entry.schoolEmblem ? (
                  <img
                    src={entry.schoolEmblem.src}
                    alt=""
                    aria-hidden="true"
                    width={entry.schoolEmblem.width}
                    height={entry.schoolEmblem.height}
                    className="education-stop-mark"
                  />
                ) : null}
              <p className="text-xs font-normal tracking-[0.08em] text-tone-5 sm:text-sm">
                {t(`education.items.${entry.id}.period`)}
              </p>
              <p className="mt-1 text-sm font-body leading-snug text-tone-3 sm:text-base">
                {t(`education.items.${entry.id}.school`)}
              </p>
              <h3 className="mt-2 text-card font-normal leading-tight tracking-tight text-tone-1">
                {t(`education.items.${entry.id}.headline`)}
              </h3>
              <ul className="mt-2.5 flex list-none flex-col gap-1.5 p-0">
                {entry.colleges.map((college) => (
                  <li
                    key={college.id}
                    className="flex items-center gap-2 text-sm font-normal leading-none text-tone-4 sm:text-sm"
                  >
                    {college.emblem ? (
                      <span className="inline-flex h-[1.25em] w-[1.7em] shrink-0 items-center justify-center">
                        <img
                          src={college.emblem.src}
                          alt=""
                          aria-hidden="true"
                          width={college.emblem.width}
                          height={college.emblem.height}
                          className="max-h-full max-w-full object-contain"
                        />
                      </span>
                    ) : (
                      <span className="inline-block h-[1.25em] w-[1.7em] shrink-0" aria-hidden="true" />
                    )}
                    <span>{t(`education.colleges.${college.id}`)}</span>
                  </li>
                ))}
              </ul>
              {honors.length > 0 ? (
                <FeaturePointList
                  points={honors}
                  className="mt-3 text-sm leading-snug text-tone-2"
                />
              ) : null}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
