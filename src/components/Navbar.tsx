import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { AppLink } from "@/components/AppLink";
import { Sun, Moon, Menu, X } from "lucide-react";

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
    const nextLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(nextLang);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { href: "#", label: t("nav:projects") },
    { href: "#", label: t("nav:coursework") },
    { href: "/workbench", label: t("nav:workspace") },
    { href: "/tools", label: t("nav:tools") },
    { href: "#", label: t("nav:knowledge") },
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
    <div ref={navRef} className="fixed bottom-4 md:bottom-auto md:top-4 inset-x-4 max-w-5xl mx-auto z-50">
      <nav className="relative flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm transition-all duration-300 z-50">
        <div className="flex items-center gap-2 sm:gap-4">
          <AppLink
            to="/"
            className="font-semibold text-base sm:text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            {t("site.displayName")}
          </AppLink>
          <div className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium text-foreground/80">
            {navLinks.map((link, idx) => (
              <span key={idx}>
                {renderNavLink(link.href, link.label, "hover:text-foreground transition-colors")}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-foreground/80">
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted/50 transition-colors font-medium text-xs sm:text-sm"
            title={t("a11y.toggleLanguage")}
          >
            {i18n.language === "zh" ? t("ui.langSwitchToEn") : t("ui.langSwitchToZh")}
          </button>
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted/50 transition-colors"
            title={t("a11y.toggleTheme")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t("a11y.toggleThemeSr")}</span>
          </button>

          {/* 移动端汉堡菜单按钮 */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted/50 transition-colors ml-1"
            title={t("a11y.toggleMenu")}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* 移动端下拉菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute bottom-full left-0 right-0 mb-2 p-3 rounded-3xl bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm transition-all duration-300 origin-bottom">
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
