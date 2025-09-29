import { useAtom } from 'jotai'
import React, { useEffect, useState, useTransition } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from 'zmp-ui'

import { languageState } from '@/state'
import gb from '@/static/gb.png'
import ja from '@/static/ja.png'
import ko from '@/static/ko.png'
import th from '@/static/th.png'
import vi from '@/static/vi.png'

import { CustomSheet } from './custom-sheet'
import { CheckIcon } from './icons'
import { SolidButton } from './solid-button'

const langs = [
  {
    name: 'English',
    value: 'en',
    flag: gb,
  },
  {
    name: 'Japanese',
    value: 'ja',
    flag: ja,
  },
  {
    name: 'Korean',
    value: 'ko',
    flag: ko,
  },
  {
    name: 'Thai',
    value: 'th',
    flag: th,
  },
  {
    name: 'Vietnamese',
    value: 'vi',
    flag: vi,
  },
]

export function LanguageSwitcher() {
  const [currentLanguage, setCurrentLanguage] = useAtom(languageState)
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage)
  const { t, i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(currentLanguage)
  }, [i18n, currentLanguage])
  const [loading, startTransition] = useTransition()

  return (
    <CustomSheet
      title={t('lbl.language')}
      renderActions={({ close }) => [
        <SolidButton key="cancel" onClick={close} className="flex-1">
          {t('btn.close')}
        </SolidButton>,
        <Button
          key="submit"
          loading={loading}
          fullWidth
          onClick={() => {
            startTransition(() => {
              setCurrentLanguage(selectedLanguage)
              close()
            })
          }}
          className="bg-primary"
        >
          {t('btn.agree')}
        </Button>,
      ]}
      renderTrigger={({ open }) => {
        const lang = langs.find((l) => l.value === currentLanguage)!
        return (
          <div className="rounded-lg p-2 pl-3 space-x-1 bg-white flex items-center" onClick={open}>
            <img className="w-6 h-4" src={lang.flag} alt={lang.name} />
            <Icon icon="zi-chevron-down" className="h-4 leading-4" />
          </div>
        )
      }}
      onOpen={() => {
        setSelectedLanguage(currentLanguage)
      }}
    >
      <div className="px-4">
        <hr className="border-divider border-t-0 mb-0"></hr>
        {langs.map((lang) => (
          <div key={lang.value} className="flex space-x-4">
            <div className="flex-1 min-w-0 relative">
              <div
                key={lang.value}
                className="flex items-center relative cursor-pointer py-3"
                onClick={() => setSelectedLanguage(lang.value)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <img className="w-6 h-4" src={lang.flag} alt={lang.name} />
                    <span className={`${lang.value === selectedLanguage ? 'font-medium' : 'font-normal'}`}>
                      {lang.name}
                    </span>
                  </div>
                </div>
                {lang.value === selectedLanguage && (
                  <div className="absolute right-0">
                    <CheckIcon />
                  </div>
                )}
              </div>
              <hr className={`border-divider border-t-0 my-0`}></hr>
            </div>
          </div>
        ))}
      </div>
    </CustomSheet>
  )
}
