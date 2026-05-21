import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enCommon from "./content/locales/en/common.json"
import enDirections from "./content/locales/en/directions.json"
import enHome from "./content/locales/en/home.json"
import enNav from "./content/locales/en/nav.json"
import enProjects from "./content/locales/en/projects.json"
import enTools from "./content/locales/en/tools.json"
import enWorkbench from "./content/locales/en/workbench.json"
import zhCommon from "./content/locales/zh/common.json"
import zhDirections from "./content/locales/zh/directions.json"
import zhHome from "./content/locales/zh/home.json"
import zhNav from "./content/locales/zh/nav.json"
import zhProjects from "./content/locales/zh/projects.json"
import zhTools from "./content/locales/zh/tools.json"
import zhWorkbench from "./content/locales/zh/workbench.json"

const resources = {
  zh: {
    common: zhCommon,
    nav: zhNav,
    home: zhHome,
    directions: zhDirections,
    projects: zhProjects,
    workbench: zhWorkbench,
    tools: zhTools,
  },
  en: {
    common: enCommon,
    nav: enNav,
    home: enHome,
    directions: enDirections,
    projects: enProjects,
    workbench: enWorkbench,
    tools: enTools,
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: "zh",
  fallbackLng: "en",
  defaultNS: "common",
  fallbackNS: "common",
  ns: ["common", "nav", "home", "directions", "projects", "workbench", "tools"],
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
