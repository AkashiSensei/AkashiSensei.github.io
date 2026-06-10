import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { AppLink } from "@/components/AppLink";
import { ContactDialog } from "@/components/ContactDialog";
import { Sun, Moon, Menu, X, Mail } from "lucide-react";

export function Navbar() {
  const { t, i18n } = useTranslation(["common", "nav"]);
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (mobileMenuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    const currentLanguage = i18n.resolvedLanguage ?? i18n.language;
    const nextLang = currentLanguage.startsWith("zh") ? "en" : "zh";
    i18n.changeLanguage(nextLang);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { href: "/resume", label: t("nav:resume") },
    { href: "/projects", label: t("nav:projects") },
    { href: "/course-projects", label: t("nav:coursework") },
    { href: "/workbench", label: t("nav:workspace") },
    { href: "/tools", label: t("nav:tools") },
    { href: "/knowledge", label: t("nav:knowledge") },
  ];

  const renderNavLink = (href: string, label: string, className: string, onNavigate?: () => void) => {
    if (href.startsWith("/")) {
      return (
        <AppLink to={href} className={className} onClick={onNavigate}>
          {label}
        </AppLink>
      );
    }

    return (
      <a href={href} className={className} onClick={onNavigate}>
        {label}
      </a>
    );
  };

  return (
    <div ref={navRef} className="fixed bottom-5 inset-x-5 z-50 mx-auto max-w-5xl sm:bottom-6 sm:inset-x-6 md:bottom-auto md:top-4 md:inset-x-56 md:mx-0 md:max-w-none">
      <nav className="lit-glass-card relative z-50 flex items-center justify-between rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-5 py-3.5 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10 md:px-6 md:py-3">
        <div className="flex items-center gap-2 sm:gap-4">
          <AppLink
            to="/"
            className="font-semibold text-lg md:text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            {t("site.displayName")}
          </AppLink>
          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-sm font-medium text-foreground/80 md:flex">
            {navLinks.map((link, idx) => (
              <span key={idx}>
                {renderNavLink(link.href, link.label, "hover:text-foreground transition-colors")}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-foreground/80">
          <button 
            onClick={toggleLanguage}
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium hover:bg-muted/50 transition-colors md:h-8 md:w-8 md:text-sm"
            title={t("a11y.toggleLanguage")}
          >
            {(i18n.resolvedLanguage ?? i18n.language).startsWith("zh") ? t("ui.langSwitchToEn") : t("ui.langSwitchToZh")}
          </button>
          <button 
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted/50 transition-colors md:h-8 md:w-8"
            title={t("a11y.toggleTheme")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 md:h-4 md:w-4" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 md:h-4 md:w-4" />
            <span className="sr-only">{t("a11y.toggleThemeSr")}</span>
          </button>
          <ContactDialog>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted/50 transition-colors md:h-8 md:w-8"
              title={t("a11y.viewContact")}
            >
              <Mail className="h-5 w-5 md:h-4 md:w-4" />
              <span className="sr-only">{t("a11y.viewContact")}</span>
            </button>
          </ContactDialog>

          {/* 移动端汉堡菜单按钮 */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted/50 transition-colors md:hidden"
            title={t("a11y.toggleMenu")}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* 移动端下拉菜单 */}
      {mobileMenuOpen && (
        <div className="lit-glass-card absolute bottom-full left-0 right-0 mb-2 origin-bottom rounded-3xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] p-3 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10 md:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium">
            {navLinks.map((link, idx) => (
              <span key={idx} className="block">
                {renderNavLink(
                  link.href,
                  link.label,
                  "block px-4 py-2 rounded-xl hover:bg-muted/50 transition-colors text-foreground text-center",
                  () => setMobileMenuOpen(false),
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
