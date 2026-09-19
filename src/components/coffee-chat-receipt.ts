import type { TFunction } from "i18next"

import type { ReceiptData } from "@/components/ReceiptCard"

const receiptItemKeys = [
  "meal",
  "listening",
  "professional",
  "worldview",
] as const
const receiptSummaryKeys = ["mode", "respect"] as const

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : []
}

export function buildCoffeeChatReceiptData(t: TFunction<"home">): ReceiptData {
  return {
    brand: t("fpv.page05.receipt.brand"),
    receiptNumber: t("fpv.page05.receipt.number"),
    issuedAt: t("fpv.page05.receipt.issuedAt"),
    ariaLabel: t("fpv.page05.receipt.cardAria"),
    itemsAriaLabel: t("fpv.page05.receipt.itemsAria"),
    totalAriaLabel: t("fpv.page05.receipt.totalAria"),
    title: t("fpv.page05.receipt.title"),
    description: t("fpv.page05.receipt.description"),
    highlight: [
      t("fpv.page05.receipt.highlights.coffee"),
      t("fpv.page05.receipt.highlights.online"),
    ],
    items: receiptItemKeys.map((itemKey) => ({
      id: itemKey,
      name: t(`fpv.page05.receipt.items.${itemKey}.name`),
      quantityLabel: t(`fpv.page05.receipt.items.${itemKey}.quantityLabel`),
      price: t(`fpv.page05.receipt.items.${itemKey}.price`),
    })),
    totalLabel: t("fpv.page05.receipt.totalLabel"),
    total: t("fpv.page05.receipt.total"),
    summary: receiptSummaryKeys.map((summaryKey) => ({
      label: t(`fpv.page05.receipt.summaryLabels.${summaryKey}`),
      value: t(`fpv.page05.receipt.summary.${summaryKey}`),
    })),
    promoTitle: t("fpv.page05.receipt.promoTitle"),
    promoCaption: t("fpv.page05.receipt.promoCaption"),
    qrValue: "https://akashisensei.github.io/",
    footerLeft: asStringArray(t("fpv.page05.receipt.footerLeft", { returnObjects: true })),
    footerRight: asStringArray(t("fpv.page05.receipt.footerRight", { returnObjects: true })),
  }
}
