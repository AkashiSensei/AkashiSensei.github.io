import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enCommon from "./content/locales/en/common.json"
import enCourseProjects from "./content/locales/en/course-projects.json"
import enDirections from "./content/locales/en/directions.json"
import enHome from "./content/locales/en/home.json"
import enKnowledge from "./content/locales/en/knowledge.json"
import enNav from "./content/locales/en/nav.json"
import enProjects from "./content/locales/en/projects.json"
import enResume from "./content/locales/en/resume.json"
import enTools from "./content/locales/en/tools.json"
import enWorkbench from "./content/locales/en/workbench.json"
import zhCommon from "./content/locales/zh/common.json"
import zhCourseProjects from "./content/locales/zh/course-projects.json"
import zhDirections from "./content/locales/zh/directions.json"
import zhHome from "./content/locales/zh/home.json"
import zhKnowledge from "./content/locales/zh/knowledge.json"
import zhNav from "./content/locales/zh/nav.json"
import zhProjects from "./content/locales/zh/projects.json"
import zhResume from "./content/locales/zh/resume.json"
import zhTools from "./content/locales/zh/tools.json"
import zhWorkbench from "./content/locales/zh/workbench.json"

const resources = {
  zh: {
    common: zhCommon,
    nav: zhNav,
    home: zhHome,
    resume: zhResume,
    knowledge: zhKnowledge,
    directions: zhDirections,
    projects: zhProjects,
    courseProjects: zhCourseProjects,
    workbench: zhWorkbench,
    tools: zhTools,
  },
  en: {
    common: enCommon,
    nav: enNav,
    home: enHome,
    resume: enResume,
    knowledge: enKnowledge,
    directions: enDirections,
    projects: enProjects,
    courseProjects: enCourseProjects,
    workbench: enWorkbench,
    tools: enTools,
  },
} as const

function getInitialLanguage() {
  if (typeof navigator === "undefined") {
    return "en"
  }

  const browserLanguages = navigator.languages.length > 0
    ? navigator.languages
    : [navigator.language]

  return browserLanguages.some((language) => language.toLowerCase().startsWith("zh"))
    ? "zh"
    : "en"
}

function getHtmlLanguage(language: string) {
  return language.toLowerCase().startsWith("zh") ? "zh-CN" : "en"
}

function syncDocumentLanguage(language: string) {
  if (typeof document === "undefined") {
    return
  }

  document.documentElement.lang = getHtmlLanguage(language)
}

i18n.use(initReactI18next)
i18n.on("languageChanged", syncDocumentLanguage)

void i18n.init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "en",
  defaultNS: "common",
  fallbackNS: "common",
  ns: ["common", "nav", "home", "resume", "knowledge", "directions", "projects", "courseProjects", "workbench", "tools"],
  interpolation: {
    escapeValue: false,
  },
}).then(() => {
  syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language)
})

export default i18n
