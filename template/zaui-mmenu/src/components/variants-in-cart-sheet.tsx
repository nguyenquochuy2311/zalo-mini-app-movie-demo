import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, useNavigate } from 'zmp-ui'

import { Dish } from '@/@types/generic'
import { itemsInCartState } from '@/state'

import { CartItem } from './cart-item'
import { CustomSheet, CustomSheetProps } from './custom-sheet'

export function VariantsInCartSheet({ children, dish }: { children: CustomSheetProps['renderTrigger']; dish: Dish }) {
  const { t } = useTranslation()
  const items = useAtomValue(itemsInCartState(dish.id))
  const navigate = useNavigate()

  return (
    <CustomSheet
      title={dish.name}
      closeIcon
      bordered
      contentClassName="bg-ng-10"
      renderTrigger={children}
      renderActions={({ close }) => [
        <Button
          key="more"
          fullWidth
          onClick={() => {
            close()
            navigate(`/dish/${dish.id}`)
          }}
        >
          {t('btn.order-more-this')}
        </Button>,
      ]}
    >
      {({ close }) => (
        <div className="p-2 space-y-3">
          {items.map((item) => (
            <CartItem key={item.id} item={item} mMenuDish={item.dishId} onEdit={close} />
          ))}
        </div>
      )}
    </CustomSheet>
  )
}
