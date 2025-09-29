import i18n from 'i18next'
import { useMemo } from 'react'
import { initReactI18next, useTranslation } from 'react-i18next'

import { LocalizationName } from './@types/mmenu'
import en from './locales/en.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import th from './locales/th.json'
import vi from './locales/vi.json'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
export const resources = {
  en: {
    translation: en,
  },
  ja: {
    translation: ja,
  },
  ko: {
    translation: ko,
  },
  th: {
    translation: th,
  },
  vi: {
    translation: vi,
  },
} as const

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n

// For IDE autocompletion
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en']
  }
}

/**
 * mMenu returns each entity name as a list of `LocalizationName`. This hooks return the name matching the current i18n language **REACTIVELY**.
 * @param names
 * @returns
 */
export function useLocalizationName(names?: LocalizationName[], fallback?: string) {
  const { i18n } = useTranslation()
  const name = useMemo(() => {
    if (names) {
      const index = names.findIndex((n) => n.language === i18n.language)
      return names[index === -1 ? 0 : index].name || fallback
    }
    return fallback
  }, [fallback, i18n.language, names])
  return name
}
