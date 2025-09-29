import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Text, useNavigate } from 'zmp-ui'

import { cartState, cartTotalState, countCartState } from '@/state'
import { formatMoney } from '@/utils/format'

import { CartItem } from './cart-item'
import { CustomSheet, CustomSheetProps } from './custom-sheet'
import { SolidButton } from './solid-button'

export function CartSheet({ children }: { children: CustomSheetProps['renderTrigger'] }) {
  const { t } = useTranslation()
  const cart = useAtomValue(cartState)
  const total = useAtomValue(cartTotalState)
  const totalItems = useAtomValue(countCartState)
  const navigate = useNavigate()

  return (
    <CustomSheet
      title={t('lbl.cart')}
      closeIcon
      bordered
      contentClassName="bg-ng-10"
      renderTrigger={children}
      renderFooter={() => (
        <div className="flex flex-col space-y-1 px-4 pt-4 ">
          <div className="flex justify-between space-x-4">
            <Text className="text-text-secondary">{t('lbl.dishes-in-cart')}</Text>
            <Text className="text-text-secondary">{t('lbl.dish-count', { count: totalItems })}</Text>
          </div>
          <div className="flex justify-between space-x-4">
            <Text size="large" className="flex-1 font-medium">
              {t('lbl.total')}
            </Text>
            <Text size="xLarge" className="flex-none font-medium text-primary">
              {formatMoney(total)}
            </Text>
          </div>
        </div>
      )}
      renderActions={({ close }) => [
        <SolidButton key="cancel" onClick={close} className="flex-1">
          {t('btn.close')}
        </SolidButton>,
        <Button
          key="call"
          onClick={() => {
            close()
            navigate('/status')
          }}
          className="bg-primary flex-1"
        >
          {t('btn.order')}
        </Button>,
      ]}
    >
      {({ close }) => (
        <div className="p-2 space-y-3">
          {cart.result.cartItems.map((item) => (
            <CartItem key={item.id} item={item} mMenuDish={item.dishId} onEdit={close} />
          ))}
        </div>
      )}
    </CustomSheet>
  )
}
