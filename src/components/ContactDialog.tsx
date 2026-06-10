import { type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Mail } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ContactDialog({ children }: { children: ReactNode }) {
  const { t } = useTranslation("common")

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="lit-glass-card rounded-3xl border-[rgb(var(--site-surface-rgb)_/_0.62)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("contactDialog.title")}</DialogTitle>
          <DialogDescription className="text-foreground/70">
            {t("contactDialog.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2 mt-2">
          <a
            href="mailto:fengzhiyuyi2013@gmail.com"
            className="lit-glass-card group flex items-center gap-4 rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] p-4 transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.62)] dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground/90">{t("contactDialog.email")}</span>
              <span className="text-sm text-foreground/60">fengzhiyuyi2013@gmail.com</span>
            </div>
          </a>
        </div>
        <p className="text-sm text-foreground/60 leading-relaxed pt-2">
          {t("contactDialog.privacyNote")}
        </p>
      </DialogContent>
    </Dialog>
  )
}
