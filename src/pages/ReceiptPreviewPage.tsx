import { useTranslation } from "react-i18next"

import { buildCoffeeChatReceiptData } from "@/components/coffee-chat-receipt"
import { ReceiptCard } from "@/components/ReceiptCard"

export function ReceiptPreviewPage() {
  const { t } = useTranslation("home")
  const receiptPreviewData = buildCoffeeChatReceiptData(t)

  return (
    <main className="receipt-preview-page">
      <div className="receipt-preview-stage">
        <ReceiptCard data={receiptPreviewData} />
      </div>
    </main>
  )
}
