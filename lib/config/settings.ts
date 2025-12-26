import fs from 'fs'
import path from 'path'

const settingsDir = path.join(process.cwd(), 'content', 'settings')

export interface BusinessSettings {
  brandName: string
  brandDescription: string
  brandEmail: string
  brandKeywords: string[]
  brandPhone: string
}

export interface GeneralSettings {
  siteUrl: string
  footerText: string
  postsToShow: number
  homeCategory: string
  cookieConsent: boolean
  darkModeSwitcher: boolean
  feedbackEmail: string
  publishedDate: string
  i18n: string
  errorMessage: string
}

export interface ThemeSettings {
  postsSettings: {
    postsToShow: number
    postMaxW: string
    leftColumn: boolean
    rightColumn: boolean
    bottomRow: boolean
    adsInsidePost: boolean
    postStyleVariation: string
  }
  pagesSettings: {
    pageBottomPadding: number
    pageHeaderPadding: number
    pageMaxW: string
  }
  header: {
    logoAlign: string
    headerHeight: number
    bottomMainMenu: boolean
    headerMainMenu: string
    headerMainMenuType: string
  }
  themeColors: {
    brand_color: string
    ctaColor: string
    background_color: string
    darkBrandColor: string
    secondaryColor: string
    darkBackgroundColor: string
  }
  generalThemeSettings: {
    themeStyle: string
  }
}

function readJsonFile<T>(filename: string): T | null {
  try {
    const filePath = path.join(settingsDir, filename)
    if (!fs.existsSync(filePath)) {
      return null
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents) as T
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return null
  }
}

export function getBusinessSettings(): BusinessSettings | null {
  return readJsonFile<BusinessSettings>('business.json')
}

export function getGeneralSettings(): GeneralSettings | null {
  return readJsonFile<GeneralSettings>('general.json')
}

export function getThemeSettings(): ThemeSettings | null {
  return readJsonFile<ThemeSettings>('theme.json')
}

export function getAllSettings() {
  return {
    business: getBusinessSettings(),
    general: getGeneralSettings(),
    theme: getThemeSettings(),
  }
}

