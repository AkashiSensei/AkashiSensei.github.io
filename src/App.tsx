import { Layout } from "@/components/Layout"
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

function App() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="flex flex-col gap-12 mt-8 sm:mt-16">
        <section className="space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('home.title')}
          </h1>
          <p className="text-lg text-foreground/80 leading-relaxed whitespace-pre-line">
            {t('home.description')}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 bg-white/40 dark:bg-white/10 backdrop-blur-md border-white/40 dark:border-white/10 shadow-sm hover:bg-white/60 dark:hover:bg-white/20 transition-colors">
                  {t('home.contact')}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white/60 dark:bg-white/10 backdrop-blur-xl border-white/40 dark:border-white/10 shadow-lg rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl">{t('home.contactDialog.title')}</DialogTitle>
                  <DialogDescription className="text-foreground/70">
                    {t('home.contactDialog.description')}
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
                      <span className="font-semibold text-foreground/90">{t('home.contactDialog.whatsapp')}</span>
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
                      <span className="font-semibold text-foreground/90">{t('home.contactDialog.email1')}</span>
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
                      <span className="font-semibold text-foreground/90">{t('home.contactDialog.email2')}</span>
                      <span className="text-sm text-foreground/60">fengzhiyuyi2013@gmail.com</span>
                    </div>
                  </a>
                </div>
                <p className="text-sm text-foreground/60 leading-relaxed pt-2">
                  {t('home.contactDialog.privacyNote')}
                </p>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default App
