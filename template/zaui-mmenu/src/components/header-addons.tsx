import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { tableState } from '@/state'

import CallStaff from './call-staff-sheet'
import { LanguageSwitcher } from './language-switcher'

export function HeaderAddons() {
  const { t } = useTranslation()
  const { table } = useAtomValue(tableState)

  return (
    <div className="pt-11 bg-primary shadow-[0px_0px_0px_1px] shadow-divider overflow-hidden flex items-center space-x-2 p-3">
      <CallStaff />
      <div className="text-white opacity-80 flex-1 truncate">
        {t('lbl.table')}: {table.name}
      </div>
      <LanguageSwitcher />
    </div>
  )
}
