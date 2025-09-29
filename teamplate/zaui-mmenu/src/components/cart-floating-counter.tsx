import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'zmp-ui'

import { IconShoppingCart } from '@/components/icons'
import { useAnimate } from '@/hooks'
import { cartTotalState, countCartState, floatingCartState } from '@/state'
import { clsx } from '@/utils/clsx'
import { formatMoney } from '@/utils/format'

import { CartSheet } from './cart-sheet'

export function CartFloatingCounter() {
  const { t } = useTranslation()
  const totalItems = useAtomValue(countCartState)
  const total = useAtomValue(cartTotalState)
  const status = useAtomValue(floatingCartState)

  const [animate] = useAnimate(total)

  return (
    <CartSheet>
      {({ open }) => (
        <div
          className={clsx(
            'fixed left-0 right-0 z-10 bottom-0 px-3 duration-200 ease-in-out',
            status === 'visible' && 'with-bottom-nav',
            status !== 'hidden' && totalItems > 0 ? 'translate-y-0 bottom-2' : 'translate-y-full',
          )}
        >
          <div
            className={clsx(
              'bg-[#212121] py-3.5 px-4 rounded-lg flex text-white gap-2 items-center',
              animate && 'animate-add-to-cart',
            )}
            onClick={open}
          >
            <IconShoppingCart className="shrink-0" />
            <Text className="shrink-0">{t('lbl.view-cart')}</Text>
            <Text className="text-right ml-auto break-all">
              {formatMoney(total)} - {t('lbl.dish-count', { count: totalItems })}
            </Text>
          </div>
        </div>
      )}
    </CartSheet>
  )
}
