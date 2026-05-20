import { useTranslation } from "react-i18next";
import directionsData from "@/data/directions.json";

type DirectionItem = {
  id: string;
  icon: string;
  planned?: boolean;
};

export function DirectionsSection() {
  const { t } = useTranslation("directions");
  const directions = directionsData as DirectionItem[];

  if (directions.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2.5 sm:gap-3 w-full max-w-5xl mx-auto pt-6 sm:pt-10">
      <div className="flex flex-col gap-2.5 sm:gap-3 px-2 sm:px-4 pb-1">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {t("title")}
        </h2>
        <p className="text-foreground/80 dark:text-foreground/90 text-sm sm:text-base leading-relaxed">
          {t("subtitle")}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {directions.map((item) => (
          <div 
            key={item.id}
            className={`relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-3.5 rounded-2xl transition-colors overflow-hidden group ${
              item.planned 
                ? "bg-foreground/5 dark:bg-foreground/5 border border-dashed border-foreground/20 shadow-none opacity-80"
                : "bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm hover:bg-white/60 dark:hover:bg-white/10"
            }`}
          >
            {/* Mobile background icon (faded & blurred to simulate frosted glass) */}
            <div className={`absolute -right-6 top-1/2 -translate-y-1/2 w-32 h-32 opacity-[0.15] dark:opacity-[0.08] sm:hidden pointer-events-none z-0 ${item.planned ? "grayscale" : ""}`}>
              <img 
                src={item.icon} 
                alt="" 
                className="w-full h-full object-contain blur-[2px]" 
              />
            </div>

            {/* Desktop icon */}
            <div className={`hidden sm:flex w-10 h-10 shrink-0 items-center justify-center z-10 ${item.planned ? "grayscale opacity-80" : ""}`}>
              <img 
                src={item.icon} 
                alt={t(`items.${item.id}.title`)}
                className="w-full h-full object-contain scale-[1.5] group-hover:scale-[1.6] transition-transform duration-500 ease-out" 
              />
            </div>

            {/* Text Content */}
            <div className="flex flex-col space-y-0.5 z-10 relative">
              <h3 className="font-bold text-lg text-foreground/90 leading-tight">{t(`items.${item.id}.title`)}</h3>
              <p className="text-sm text-foreground/75 dark:text-foreground/85 leading-tight sm:leading-snug max-w-4xl">
                {t(`items.${item.id}.summary`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pb-8 px-2 sm:px-4 flex">
        <p className="text-sm text-foreground/60 dark:text-foreground/70 tracking-wide">
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
