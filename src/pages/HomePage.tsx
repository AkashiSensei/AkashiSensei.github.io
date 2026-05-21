import { Layout } from "@/components/Layout"
import { DirectionsSection } from "@/components/DirectionsSection"
import { SmallToolHighlights } from "@/components/SmallToolHighlights"
import { WorkbenchHighlights } from "@/components/WorkbenchHighlights"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { MessageCircle, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function HomePage() {
  const { t } = useTranslation("home");

  return (
    <Layout>
      <div className="flex flex-col gap-12 mt-8 sm:mt-16">
        <section className="space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-foreground/80 leading-[1.75] whitespace-pre-line pt-2 sm:pt-3">
            {t('description')}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 bg-white/40 dark:bg-white/10 backdrop-blur-md border-white/40 dark:border-white/10 shadow-sm hover:bg-white/60 dark:hover:bg-white/20 transition-colors">
                  {t('contact')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/60 dark:bg-white/10 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-lg rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">{t('contactDialog.title')}</DialogTitle>
                  <DialogDescription className="text-foreground/70">
                    {t('contactDialog.description')}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-2 mt-2">
                  <a 
                    href="https://wa.me/642102638427" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors border border-white/40 dark:border-white/10 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground/90">{t('contactDialog.whatsapp')}</span>
                      <span className="text-sm text-foreground/60">+64 210 263 8427</span>
                    </div>
                  </a>
                  
                  <a 
                    href="mailto:fengzhiyuyi2013@163.com" 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors border border-white/40 dark:border-white/10 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground/90">{t('contactDialog.email1')}</span>
                      <span className="text-sm text-foreground/60">fengzhiyuyi2013@163.com</span>
                    </div>
                  </a>

                  <a 
                    href="mailto:fengzhiyuyi2013@gmail.com" 
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-colors border border-white/40 dark:border-white/10 group"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground/90">{t('contactDialog.email2')}</span>
                      <span className="text-sm text-foreground/60">fengzhiyuyi2013@gmail.com</span>
                    </div>
                  </a>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed pt-2">
                  {t('contactDialog.privacyNote')}
                </p>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              asChild
              className="rounded-full px-4 bg-white/40 dark:bg-white/10 backdrop-blur-md border-white/40 dark:border-white/10 shadow-sm hover:bg-white/60 dark:hover:bg-white/20 transition-colors"
            >
              <a
                href="https://github.com/AkashiSensei"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5"
              >
                <GitHubMark className="h-4 w-4 shrink-0" />
                {t("github")}
              </a>
            </Button>
          </div>
        </section>
        <DirectionsSection />
        <WorkbenchHighlights />
        <SmallToolHighlights />
      </div>
    </Layout>
  )
}
