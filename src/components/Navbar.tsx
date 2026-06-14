import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toString as qrToString } from "qrcode";
import { useTheme } from "@/components/theme-provider";
import { AppLink } from "@/components/AppLink";
import { ContactDialog } from "@/components/ContactDialog";
import { SpotlightCard } from "@/components/SpotlightCard";
import { Sun, Moon, Menu, X, Mail, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const phoneQrPanelWidth = 224;
const phoneQrPanelGap = 8;

function isVisibleElement(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return rect.width > 0 && rect.height > 0;
}

function getPhoneQrPanelPosition(
  button: HTMLButtonElement,
  container: HTMLDivElement,
) {
  const buttonRect = button.getBoundingClientRect();
  const menuAnchor =
    (button.closest(".desktop-menu-cluster") as HTMLElement | null) ?? button;
  const anchorRect = menuAnchor.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportPadding = 16;
  const minLeft = viewportPadding - containerRect.left;
  const maxLeft =
    viewportWidth - phoneQrPanelWidth - viewportPadding - containerRect.left;
  const preferredLeft = anchorRect.right - phoneQrPanelWidth - containerRect.left;

  return {
    left: Math.max(minLeft, Math.min(preferredLeft, maxLeft)),
    top: Math.max(buttonRect.bottom, anchorRect.bottom) - containerRect.top + phoneQrPanelGap,
  };
}

export function Navbar() {
  const { t, i18n } = useTranslation(["common", "nav"]);
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phoneQrOpen, setPhoneQrOpen] = useState(false);
  const [phoneQrPanelPosition, setPhoneQrPanelPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const [phoneQrSvgUrl, setPhoneQrSvgUrl] = useState("");
  const [phoneQrError, setPhoneQrError] = useState(false);
  const [scrollDisplacement, setScrollDisplacement] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const phoneQrPanelRef = useRef<HTMLDivElement>(null);
  const compactPhoneQrButtonRef = useRef<HTMLButtonElement | null>(null);
  const fullPhoneQrButtonRef = useRef<HTMLButtonElement | null>(null);
  const activePhoneQrButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const observedScrollYRef = useRef(0);
  const pendingScrollDisplacementRef = useRef(0);
  const scrollFrameRef = useRef<number | null>(null);
  const scrollSettleFrameRef = useRef<number | null>(null);
  const scrollSettledSinceRef = useRef<number | null>(null);

  const getActivePhoneQrButton = useCallback(() => {
    const candidates = [
      activePhoneQrButtonRef.current,
      fullPhoneQrButtonRef.current,
      compactPhoneQrButtonRef.current,
    ];

    return candidates.find((button) => button && isVisibleElement(button)) ?? null;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const isInsideNavbar = navRef.current?.contains(target);
      const isInsidePhoneQrPanel = phoneQrPanelRef.current?.contains(target);

      if (
        (mobileMenuOpen || phoneQrOpen) &&
        !isInsideNavbar &&
        !isInsidePhoneQrPanel
      ) {
        setMobileMenuOpen(false);
        setPhoneQrOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen, phoneQrOpen]);

  const currentPageUrl = useMemo(
    () => `${window.location.origin}${location.pathname}${location.search}${location.hash}`,
    [location.hash, location.pathname, location.search],
  );

  useEffect(() => {
    if (!currentPageUrl) {
      return;
    }

    let isCurrent = true;

    qrToString(currentPageUrl, {
      type: "svg",
      margin: 1,
      width: 176,
      errorCorrectionLevel: "M",
      color: {
        dark: "#111827ff",
        light: "#ffffffff",
      },
    })
      .then((svg) => {
        if (!isCurrent) {
          return;
        }

        setPhoneQrSvgUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`);
        setPhoneQrError(false);
      })
      .catch(() => {
        if (!isCurrent) {
          return;
        }

        setPhoneQrSvgUrl("");
        setPhoneQrError(true);
      });

    return () => {
      isCurrent = false;
    };
  }, [currentPageUrl]);

  useEffect(() => {
    if (!phoneQrOpen) {
      return;
    }

    const updatePanelPosition = () => {
      const activeButton = getActivePhoneQrButton();
      const navContainer = navRef.current;

      if (activeButton && navContainer) {
        activePhoneQrButtonRef.current = activeButton;
        setPhoneQrPanelPosition(
          getPhoneQrPanelPosition(activeButton, navContainer),
        );
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPhoneQrOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePanelPosition);
    window.visualViewport?.addEventListener("resize", updatePanelPosition);

    const resizeObserver = new ResizeObserver(updatePanelPosition);

    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    if (compactPhoneQrButtonRef.current) {
      resizeObserver.observe(compactPhoneQrButtonRef.current);
    }

    if (fullPhoneQrButtonRef.current) {
      resizeObserver.observe(fullPhoneQrButtonRef.current);
    }

    updatePanelPosition();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePanelPosition);
      window.visualViewport?.removeEventListener("resize", updatePanelPosition);
      resizeObserver.disconnect();
    };
  }, [getActivePhoneQrButton, phoneQrOpen]);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const passiveUpdateVelocityThreshold = 0.025;
    const scrollEventUpdateVelocityThreshold = 0.06;
    const reboundMovementThreshold = 0.5;
    const reboundDelayMs = 50;
    // Real-time variant, currently disabled:
    // Set pendingScrollDisplacementRef.current = displacement directly in
    // updateDisplacementFromVelocity, and rebound only after scrollY fully stops.

    const getCurrentScrollY = () => document.scrollingElement?.scrollTop ?? window.scrollY;

    lastScrollYRef.current = getCurrentScrollY();
    observedScrollYRef.current = lastScrollYRef.current;
    lastScrollTimeRef.current = performance.now();

    const applyPendingDisplacement = () => {
      setScrollDisplacement(pendingScrollDisplacementRef.current);
      scrollFrameRef.current = null;
    };

    const schedulePendingDisplacement = () => {
      if (scrollFrameRef.current === null) {
        scrollFrameRef.current = window.requestAnimationFrame(applyPendingDisplacement);
      }
    };

    const updateDisplacementFromVelocity = (velocity: number) => {
      const isDesktopMenu = window.matchMedia("(min-width: 1000px)").matches;
      const maxDisplacement = 12;
      const fullDisplacementVelocity = isDesktopMenu ? 84 : 96;
      const normalizedVelocity = Math.min(1, Math.abs(velocity) / fullDisplacementVelocity);
      const easedVelocity = Math.pow(normalizedVelocity, 1.18);
      const displacement = -Math.sign(velocity) * maxDisplacement * easedVelocity;
      const currentDisplacement = pendingScrollDisplacementRef.current;
      const isSameDirection =
        Math.sign(displacement) === Math.sign(currentDisplacement) ||
        currentDisplacement === 0;

      if (
        isSameDirection &&
        Math.abs(displacement) < Math.abs(currentDisplacement)
      ) {
        return;
      }

      pendingScrollDisplacementRef.current = displacement;
      schedulePendingDisplacement();
    };

    const watchScrollSettled = () => {
      const currentScrollY = getCurrentScrollY();
      const currentTime = performance.now();
      const deltaY = currentScrollY - observedScrollYRef.current;
      const elapsedFrameRatio = Math.max(
        0.5,
        (currentTime - lastScrollTimeRef.current) / 16.67,
      );
      const velocity = deltaY / elapsedFrameRatio;
      const isAboveReboundThreshold = Math.abs(velocity) >= reboundMovementThreshold;

      observedScrollYRef.current = currentScrollY;
      lastScrollYRef.current = currentScrollY;
      lastScrollTimeRef.current = currentTime;

      if (isAboveReboundThreshold) {
        scrollSettledSinceRef.current = null;

        if (Math.abs(velocity) >= passiveUpdateVelocityThreshold) {
          updateDisplacementFromVelocity(velocity);
        }
      } else {
        scrollSettledSinceRef.current ??= currentTime;

        if (currentTime - scrollSettledSinceRef.current >= reboundDelayMs) {
          pendingScrollDisplacementRef.current = 0;
          setScrollDisplacement(0);
          scrollSettleFrameRef.current = null;
          scrollSettledSinceRef.current = null;
          return;
        }
      }

      scrollSettleFrameRef.current = window.requestAnimationFrame(watchScrollSettled);
    };

    const ensureScrollSettleWatcher = () => {
      scrollSettledSinceRef.current = null;

      if (scrollSettleFrameRef.current === null) {
        scrollSettleFrameRef.current = window.requestAnimationFrame(watchScrollSettled);
      }
    };

    const handleScroll = () => {
      if (reducedMotionQuery.matches) {
        setScrollDisplacement(0);
        return;
      }

      const currentScrollY = getCurrentScrollY();
      const currentTime = performance.now();
      const deltaY = currentScrollY - lastScrollYRef.current;
      const elapsedFrameRatio = Math.max(0.5, (currentTime - lastScrollTimeRef.current) / 16.67);
      const velocity = deltaY / elapsedFrameRatio;

      lastScrollYRef.current = currentScrollY;
      observedScrollYRef.current = currentScrollY;
      lastScrollTimeRef.current = currentTime;

      if (Math.abs(velocity) >= scrollEventUpdateVelocityThreshold) {
        updateDisplacementFromVelocity(velocity);
      }

      ensureScrollSettleWatcher();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      if (scrollSettleFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollSettleFrameRef.current);
      }
    };
  }, []);

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
    { href: "/knowledge", label: t("nav:knowledge") },
    { href: "/tools", label: t("nav:tools") },
  ];

  const currentPathname = location.pathname.replace(/\/+$/, "") || "/";
  const isNavLinkActive = (href: string) =>
    currentPathname === href || currentPathname.startsWith(`${href}/`);

  const togglePhoneQr = (button: HTMLButtonElement) => {
    const navContainer = navRef.current;

    if (!navContainer) {
      return;
    }

    setMobileMenuOpen(false);
    activePhoneQrButtonRef.current = button;
    setPhoneQrPanelPosition(getPhoneQrPanelPosition(button, navContainer));
    setPhoneQrOpen((isOpen) => !isOpen);
  };

  const toggleDesktopMenu = () => {
    setPhoneQrOpen(false);
    setMobileMenuOpen((isOpen) => !isOpen);
  };

  const renderNavLink = (
    href: string,
    label: string,
    className: string,
    onNavigate?: () => void,
    isActive = false,
  ) => {
    if (href.startsWith("/")) {
      return (
        <AppLink
          to={href}
          className={className}
          onClick={onNavigate}
          aria-current={isActive ? "page" : undefined}
        >
          {label}
        </AppLink>
      );
    }

    return (
      <a
        href={href}
        className={className}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </a>
    );
  };

  const renderPhoneQrButton = (variant: "compact" | "full") => (
    <div className="desktop-menu-item relative flex h-8 w-8 items-center justify-center">
      <button
        ref={(button) => {
          if (variant === "compact") {
            compactPhoneQrButtonRef.current = button;
            return;
          }

          fullPhoneQrButtonRef.current = button;
        }}
        type="button"
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          togglePhoneQr(event.currentTarget);
        }}
        onClick={(event) => {
          if (event.detail === 0) {
            togglePhoneQr(event.currentTarget);
          }
        }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50",
          phoneQrOpen && "bg-muted/50 text-tone-1",
        )}
        title={t("a11y.viewOnPhone")}
        aria-expanded={phoneQrOpen}
        aria-controls="navbar-phone-qr-panel"
      >
        <QrCode className="h-4 w-4" />
        <span className="sr-only">{t("a11y.viewOnPhone")}</span>
      </button>
    </div>
  );

  const renderPhoneQrPanel = () => {
    if (!phoneQrOpen || !phoneQrPanelPosition) {
      return null;
    }

    return (
      <SpotlightCard
        ref={phoneQrPanelRef}
        id="navbar-phone-qr-panel"
        className="lit-glass-card absolute z-[70] w-56 rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] p-3 text-left shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10"
        style={{
          left: `${phoneQrPanelPosition.left}px`,
          top: `${phoneQrPanelPosition.top}px`,
        }}
      >
        <p className="text-xs font-medium text-tone-2">{t("viewOnPhone.title")}</p>
        <div className="mt-3 rounded-xl border border-black/10 bg-white p-2 shadow-sm dark:border-white/10">
          {phoneQrSvgUrl ? (
            <img
              src={phoneQrSvgUrl}
              alt={t("viewOnPhone.qrAlt")}
              className="aspect-square w-full rounded-lg"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-white text-xs text-zinc-500">
              {phoneQrError ? t("viewOnPhone.error") : t("viewOnPhone.loading")}
            </div>
          )}
        </div>
        <p className="mt-3 truncate text-[0.68rem] leading-4 text-tone-4" title={currentPageUrl}>
          {currentPageUrl}
        </p>
      </SpotlightCard>
    );
  };

  return (
    <div
      ref={navRef}
      className="site-navbar-shell fixed bottom-7 inset-x-6 z-50 mx-auto max-w-5xl transition-transform duration-[460ms] ease-out will-change-transform sm:bottom-8 sm:inset-x-8 md:bottom-auto md:top-4 md:inset-x-16 md:mx-0 md:max-w-none min-[900px]:inset-x-20 min-[1000px]:w-auto min-[1000px]:px-0 xl:inset-x-44 2xl:inset-x-56"
      style={{ transform: `translate3d(0, ${scrollDisplacement.toFixed(2)}px, 0)` }}
    >
      <SpotlightCard asChild className="lit-glass-card relative z-50 flex items-center justify-between rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-3.5 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10 sm:px-4 md:hidden">
        <nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <AppLink
              to="/"
              className="font-semibold text-lg md:text-lg tracking-tight hover:opacity-80 transition-opacity"
            >
              {t("site.displayName")}
            </AppLink>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-foreground/80">
            <button 
              onClick={toggleLanguage}
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium hover:bg-muted/50 transition-colors md:h-8 md:w-8 md:text-sm"
              title={t("a11y.toggleLanguage")}
            >
              {(i18n.resolvedLanguage ?? i18n.language).startsWith("zh") ? t("ui.langSwitchToEn") : t("ui.langSwitchToZh")}
            </button>
            <button 
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50 transition-colors md:h-8 md:w-8"
              title={t("a11y.toggleTheme")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">{t("a11y.toggleThemeSr")}</span>
            </button>
            <ContactDialog>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50 transition-colors md:h-8 md:w-8"
                title={t("a11y.viewContact")}
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">{t("a11y.viewContact")}</span>
              </button>
            </ContactDialog>

            <button 
              onClick={toggleDesktopMenu}
              className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted/50 transition-colors"
              title={t("a11y.toggleMenu")}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </SpotlightCard>

      <div className="navbar-compact-row items-center justify-between gap-3">
        <SpotlightCard className="lit-glass-card flex h-12 shrink-0 items-center gap-2.5 rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-5 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10">
          <img
            src="/favicon.png"
            alt=""
            className="h-6 w-6 rounded-full object-contain"
            aria-hidden="true"
          />
          <AppLink
            to="/"
            className="font-semibold text-lg tracking-tight transition-opacity hover:opacity-80"
          >
            {t("site.displayName")}
          </AppLink>
        </SpotlightCard>

        <SpotlightCard className="desktop-menu-cluster lit-glass-card flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-3.5 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10">
          <ContactDialog>
            <button
              className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50"
              title={t("a11y.viewContact")}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">{t("a11y.viewContact")}</span>
            </button>
          </ContactDialog>
          <button
            onClick={toggleLanguage}
            className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium hover:bg-muted/50"
            title={t("a11y.toggleLanguage")}
          >
            {(i18n.resolvedLanguage ?? i18n.language).startsWith("zh") ? t("ui.langSwitchToEn") : t("ui.langSwitchToZh")}
          </button>
          <button
            onClick={toggleTheme}
            className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50"
            title={t("a11y.toggleTheme")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t("a11y.toggleThemeSr")}</span>
          </button>
          {renderPhoneQrButton("compact")}
          <button
            onClick={toggleDesktopMenu}
            className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50"
            title={t("a11y.toggleMenu")}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </SpotlightCard>
      </div>

      <div className="navbar-desktop-row mx-auto w-full max-w-[72rem] items-center justify-between gap-3">
        <SpotlightCard className="lit-glass-card flex h-12 shrink-0 items-center gap-2.5 rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-5 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10">
          <img
            src="/favicon.png"
            alt=""
            className="h-6 w-6 rounded-full object-contain"
            aria-hidden="true"
          />
          <AppLink
            to="/"
            className="font-semibold text-lg tracking-tight transition-opacity hover:opacity-80"
          >
            {t("site.displayName")}
          </AppLink>
        </SpotlightCard>

        <SpotlightCard asChild className="desktop-menu-cluster lit-glass-card flex h-12 min-w-0 items-center justify-center gap-5 rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-7 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10 xl:gap-6">
          <nav>
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(link.href);

              return (
                <span key={link.href} className="desktop-menu-item shrink-0">
                  {renderNavLink(
                    link.href,
                    link.label,
                    cn(
                      "relative inline-flex items-center rounded-full px-1.5 py-1 transition-colors after:absolute after:inset-x-1.5 after:-bottom-0.5 after:h-px after:origin-center after:scale-x-0 after:bg-current after:opacity-0 after:transition-all after:duration-300 hover:text-foreground",
                      isActive && "text-tone-1 after:scale-x-100 after:opacity-70",
                    ),
                    undefined,
                    isActive,
                  )}
                </span>
              );
            })}
          </nav>
        </SpotlightCard>

        <SpotlightCard className="desktop-menu-cluster lit-glass-card flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-3.5 text-sm font-medium text-foreground/80 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10">
          <ContactDialog>
            <button
              className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50"
              title={t("a11y.viewContact")}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">{t("a11y.viewContact")}</span>
            </button>
          </ContactDialog>
          <button
            onClick={toggleLanguage}
            className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium hover:bg-muted/50"
            title={t("a11y.toggleLanguage")}
          >
            {(i18n.resolvedLanguage ?? i18n.language).startsWith("zh") ? t("ui.langSwitchToEn") : t("ui.langSwitchToZh")}
          </button>
          <button
            onClick={toggleTheme}
            className="desktop-menu-item flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted/50"
            title={t("a11y.toggleTheme")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">{t("a11y.toggleThemeSr")}</span>
          </button>
          {renderPhoneQrButton("full")}
        </SpotlightCard>
      </div>

      {renderPhoneQrPanel()}

      {mobileMenuOpen && (
        <SpotlightCard className="navbar-dropdown-panel lit-glass-card absolute bottom-full left-0 right-0 mb-2 origin-bottom rounded-3xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] p-3 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-white/10 md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-[22rem] md:origin-top">
          <div className="flex flex-col gap-1 text-sm font-medium">
            {navLinks.map((link, idx) => (
              <span key={idx} className="block">
                {(() => {
                  const isActive = isNavLinkActive(link.href);

                  return renderNavLink(
                    link.href,
                    link.label,
                    cn(
                      "block rounded-xl px-4 py-2 text-center transition-colors hover:bg-muted/50",
                      isActive
                        ? "bg-[rgb(var(--site-surface-rgb)_/_0.42)] text-tone-1 dark:bg-white/10"
                        : "text-foreground",
                    ),
                    () => setMobileMenuOpen(false),
                    isActive,
                  );
                })()}
              </span>
            ))}
          </div>
        </SpotlightCard>
      )}
    </div>
  );
}
