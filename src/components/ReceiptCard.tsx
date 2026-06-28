import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import QRCode from "qrcode"

export type ReceiptItem = {
  id: string
  name: string
  quantityLabel: string
  price: string
}

export type ReceiptSummaryLine = {
  label: string
  value: string
}

export type ReceiptData = {
  brand: string
  receiptNumber: string
  issuedAt: string
  title: string
  description: string
  highlight?: string | string[]
  items: ReceiptItem[]
  totalLabel: string
  total: string
  summary: ReceiptSummaryLine[]
  promoTitle: string
  promoCaption: string
  qrValue: string
  footerLeft: string[]
  footerRight: string[]
}

type ReceiptCardProps = {
  data: ReceiptData
  showPromo?: boolean
}

function ReceiptDotMark() {
  return (
    <div className="receipt-dot-mark" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <span key={index} />
      ))}
    </div>
  )
}

function renderHighlightedDescription(description: string, highlight?: string | string[]) {
  const highlights = (Array.isArray(highlight) ? highlight : [highlight]).filter(
    (value): value is string => Boolean(value),
  )

  if (highlights.length === 0) {
    return description
  }

  const parts: ReactNode[] = []
  let cursor = 0

  while (cursor < description.length) {
    const nextMatch = highlights
      .map((value) => ({
        index: description.indexOf(value, cursor),
        value,
      }))
      .filter((match) => match.index >= 0)
      .sort((left, right) => left.index - right.index)[0]

    if (!nextMatch) {
      parts.push(description.slice(cursor))
      break
    }

    if (nextMatch.index > cursor) {
      parts.push(description.slice(cursor, nextMatch.index))
    }

    parts.push(<span key={`${nextMatch.value}-${nextMatch.index}`}>{nextMatch.value}</span>)
    cursor = nextMatch.index + nextMatch.value.length
  }

  return parts
}

export function ReceiptCard({ data, showPromo = true }: ReceiptCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const perforationRef = useRef<HTMLDivElement>(null)
  const [qrImage, setQrImage] = useState("")

  useLayoutEffect(() => {
    const card = cardRef.current
    const perforation = perforationRef.current

    if (!card || !perforation) {
      return
    }

    const syncCutoutPosition = () => {
      const cutoutY = perforation.offsetTop + perforation.offsetHeight / 2
      card.style.setProperty("--receipt-cutout-y", `${cutoutY}px`)
    }

    syncCutoutPosition()

    const resizeObserver = new ResizeObserver(syncCutoutPosition)
    resizeObserver.observe(card)
    resizeObserver.observe(perforation)

    window.addEventListener("resize", syncCutoutPosition)
    const frame = window.requestAnimationFrame(syncCutoutPosition)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", syncCutoutPosition)
      window.cancelAnimationFrame(frame)
    }
  }, [data, showPromo])

  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(data.qrValue, {
      errorCorrectionLevel: "M",
      margin: 1,
      scale: 7,
      color: {
        dark: "#2f302c",
        light: "#f7f7f4",
      },
    }).then((image) => {
      if (isMounted) {
        setQrImage(image)
      }
    })

    return () => {
      isMounted = false
    }
  }, [data.qrValue])

  return (
    <article
      ref={cardRef}
      className={showPromo ? "receipt-card" : "receipt-card receipt-card-compact"}
      aria-label={`${data.brand} receipt`}
    >
      <header className="receipt-header">
        <div className="receipt-brand">
          <ReceiptDotMark />
          <span>{data.brand}</span>
        </div>
        <div className="receipt-meta">
          <span>{data.receiptNumber}</span>
          <span>{data.issuedAt}</span>
        </div>
      </header>

      <section className="receipt-message">
        <h1>{data.title}</h1>
        <p>{renderHighlightedDescription(data.description, data.highlight)}</p>
      </section>

      <div ref={perforationRef} className="receipt-perforation" aria-hidden="true" />

      <section className="receipt-items" aria-label="Receipt items">
        {data.items.map((item, index) => (
          <div className="receipt-item" key={item.id}>
            <span className="receipt-item-index">{index + 1}</span>
            <div className="receipt-item-copy">
              <p>{item.name}</p>
              <span>{item.quantityLabel}</span>
            </div>
            <strong>{item.price}</strong>
          </div>
        ))}
      </section>

      <section className="receipt-total-card" aria-label="Receipt total">
        <div>
          <h2>{data.totalLabel}</h2>
          {data.summary.map((line) => (
            <p key={line.label}>{line.label}</p>
          ))}
        </div>
        <div>
          <strong>{data.total}</strong>
          {data.summary.map((line) => (
            <p key={line.label}>{line.value}</p>
          ))}
        </div>
      </section>

      {showPromo ? (
        <section className="receipt-promo">
          <div>
            <h2>{data.promoTitle}</h2>
            <p>{data.promoCaption}</p>
          </div>
          <div className="receipt-qr-frame">
            {qrImage ? <img src={qrImage} alt="" /> : null}
          </div>
        </section>
      ) : null}

      <footer className="receipt-footer">
        <div>
          {data.footerLeft.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <div>
          {data.footerRight.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </footer>
    </article>
  )
}
