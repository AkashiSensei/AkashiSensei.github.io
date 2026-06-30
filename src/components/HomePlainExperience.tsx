import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { ContactDialog } from "@/components/ContactDialog"

type FriendLink = {
  name: string
  quote: string
  avatar: string
  href: string
}

const fieldKeys = ["study", "world", "beingHuman", "expression"] as const
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
const activityColumns = [
  activityKeys.slice(0, 4),
  activityKeys.slice(4, 8),
]
const receiptItemKeys = ["meal", "listening", "professional", "worldview"] as const

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function asFriendLinks(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is FriendLink => (
    typeof item === "object"
    && item !== null
    && "name" in item
    && "quote" in item
    && "avatar" in item
    && "href" in item
    && typeof item.name === "string"
    && typeof item.quote === "string"
    && typeof item.avatar === "string"
    && typeof item.href === "string"
  )) : []
}

export function HomePlainExperience() {
  const { t } = useTranslation("home")
  const friendLinks = asFriendLinks(t("fpv.page06.links", { returnObjects: true }))

  return (
    <article className="plain-home-document" aria-labelledby="plain-home-title">
      <header className="plain-home-header">
        <p className="plain-home-kicker">{t("plain.kicker")}</p>
        <h1 id="plain-home-title">{t("fpv.page01.title")}</h1>
        <p className="plain-home-lede">{t("fpv.page01.maxim")}</p>
        <ul className="plain-home-intro-list">
          {asStringArray([
            t("fpv.page01.lines.softwareMaster"),
            t("fpv.page01.lines.building"),
            t("fpv.page01.lines.friend"),
          ]).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <div className="plain-home-actions" aria-label={t("plain.actionsLabel")}>
          <AppLink to="/resume">{t("resumeCta")}</AppLink>
          <ContactDialog>
            <button type="button">{t("contact")}</button>
          </ContactDialog>
          <a href="https://github.com/AkashiSensei" target="_blank" rel="noreferrer">
            {t("github")}
          </a>
        </div>
      </header>

      <section aria-labelledby="plain-field-heading">
        <h2 id="plain-field-heading">{t("fpv.page02.title")}</h2>
        <p>{t("fpv.page02.subtitle")}</p>
        <ul>
          {asStringArray(t("fpv.page02.description", { returnObjects: true })).map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {fieldKeys.map((fieldKey) => (
          <section key={fieldKey} className="plain-home-subsection">
            <h3>{t(`fpv.page02.fields.${fieldKey}.title`)}</h3>
            <p>{t(`fpv.page02.fields.${fieldKey}.subtitle`)}</p>
            <ul>
              {asStringArray(t(`fpv.page02.fields.${fieldKey}.bullets`, { returnObjects: true })).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <section aria-labelledby="plain-study-heading">
        <h2 id="plain-study-heading">{t("fpv.page03.title")}</h2>
        <p>{t("fpv.page03.subtitle")}</p>
        <h3>{t("fpv.page03.bigline")}</h3>
        <ul>
          <li>{t("fpv.page03.lines.engineering")}</li>
          <li>{t("fpv.page03.lines.lowLevel")}</li>
          <li>{t("fpv.page03.lines.advisor")}</li>
        </ul>
      </section>

      <section aria-labelledby="plain-activities-heading">
        <h2 id="plain-activities-heading">{t("fpv.page04.title")}</h2>
        <p>{t("fpv.page04.subtitle")}</p>
        <div className="plain-home-two-column-list">
          {activityColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="plain-home-column">
              {column.map((activityKey) => (
                <section key={activityKey} className="plain-home-subsection">
                  <h3>{t(`fpv.page04.activities.${activityKey}.title`)}</h3>
                  <ul>
                    {asStringArray(t(`fpv.page04.activities.${activityKey}.bullets`, { returnObjects: true })).map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ))}
        </div>
        <p>{t("fpv.page04.aside")}</p>
      </section>

      <section aria-labelledby="plain-chat-heading">
        <h2 id="plain-chat-heading">{t("fpv.page05.title")}</h2>
        <p>{t("fpv.page05.eyebrow")}</p>
        <ul>
          <li>{t("fpv.page05.lines.work")}</li>
          <li>{t("fpv.page05.lines.future")}</li>
          <li>{t("fpv.page05.lines.balance")}</li>
          <li>{t("fpv.page05.lines.world")}</li>
          <li>{t("fpv.page05.lines.people")}</li>
        </ul>
        <h3>{t("fpv.page05.receipt.title")}</h3>
        <p>{t("fpv.page05.receipt.description")}</p>
        <ul>
          {receiptItemKeys.map((itemKey) => (
            <li key={itemKey}>
              <strong>{t(`fpv.page05.receipt.items.${itemKey}.name`)}</strong>
              <span> - {t(`fpv.page05.receipt.items.${itemKey}.quantityLabel`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="plain-friends-heading">
        <h2 id="plain-friends-heading">{t("fpv.page06.title")}</h2>
        <p>{t("fpv.page06.subtitle")}</p>
        <div className="plain-home-friend-list">
          {friendLinks.map((friend) => (
            <div
              key={friend.href}
              className="plain-home-friend-card"
            >
              <img
                src={friend.avatar}
                alt={t("plain.friendAvatarAlt", { name: friend.name })}
              />
              <a
                href={friend.href}
                target="_blank"
                rel="noreferrer"
                className="plain-home-friend-name"
              >
                {friend.name}
              </a>
              <p className="plain-home-friend-quote">{friend.quote}</p>
            </div>
          ))}
        </div>
        <p>{t("fpv.page06.aside")}</p>
      </section>
    </article>
  )
}
