import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomNavigation, useNavigate } from 'zmp-ui'

import { Badge } from '@/components/badge'
import { countCartState } from '@/state'

import { IconHistorySolid, IconNoteSolid } from './icons'

type MenuType = 'menu' | 'history'

export function MerchantTabs({ activeTab }: { activeTab: MenuType }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const count = useAtomValue(countCartState)

  const [tab, setTab] = useState<MenuType>(activeTab)

  function handleTabChange(tab: MenuType) {
    setTab(tab as MenuType)
    navigate(tab === 'menu' ? '/' : `/${tab}`, { animate: false })
  }

  return (
    <BottomNavigation fixed activeKey={tab} onChange={(tab) => handleTabChange(tab as MenuType)}>
      <BottomNavigation.Item
        key="menu"
        label={t('nav.menu')}
        icon={
          count > 0 ? (
            <Badge label={String(count)}>
              <IconNoteSolid />
            </Badge>
          ) : (
            <IconNoteSolid />
          )
        }
      />
      <BottomNavigation.Item key="history" label={t('nav.history')} icon={<IconHistorySolid />} />
    </BottomNavigation>
  )
}
