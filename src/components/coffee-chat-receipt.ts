import type { TFunction } from "i18next"

import type { ReceiptData } from "@/components/ReceiptCard"

const receiptItemKeys = [
  "meal",
  "listening",
  "professional",
  "worldview",
] as const

export function buildCoffeeChatReceiptData(t: TFunction<"home">): ReceiptData {
  return {
    brand: "Akashi Exchange",
    receiptNumber: "Exchange No. 001",
    issuedAt: "When schedules align",
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
    totalLabel: "Total",
    total: t("fpv.page05.receipt.total"),
    summary: [
      {
        label: "Meetup mode",
        value: t("fpv.page05.receipt.summary.mode"),
      },
      {
        label: "Service fee",
        value: t("fpv.page05.receipt.summary.respect"),
      },
    ],
    promoTitle: t("fpv.page05.receipt.promoTitle"),
    promoCaption: t("fpv.page05.receipt.promoCaption"),
    qrValue: "https://akashisensei.github.io/",
    footerLeft: ["Akashi Exchange", "Online or offline"],
    footerRight: ["Say hello", "akashisensei.github.io"],
  }
}
