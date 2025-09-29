import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'zmp-ui'

import type { CartItem, DishID, Status, ToppingType } from '@/@types/mmenu'
import dummyDish from '@/static/dummy-dish.svg'
import { formatMoney } from '@/utils/format'

import { DishItem } from './dish-item'
import { QuantityInput } from './quantity-input'
import { SolidButton } from './solid-button'

export interface CartItemProps {
  item: CartItem
  mMenuDish: DishID
  onEdit?: () => void
}

export function CartItem({ item, mMenuDish: product, onEdit }: CartItemProps) {
  const { t } = useTranslation()
  return (
    <DishItem
      dish={{
        ...product,
        toppings: product.toppings.map((t) => ({
          ...t,
          toppingId: t.id,
          toppingType: t.toppingType as ToppingType,
          toppingItems: t.toppingItems.map((i) => ({
            ...i,
            toppingItemId: i.id,
            status: i.status as Status,
            quantity: i.quantity ?? 0,
          })),
        })),
      }}
      customRender={({ addToCart, viewDetail, confirmZeroQuantity }) => (
        <div className="bg-background rounded-lg border p-3 flex space-x-3">
          <img className="w-10 h-10 rounded-lg" src={product.images?.[0] ?? dummyDish} />
          <div className="flex-1 flex flex-col space-y-1 items-start">
            <Text>{product.name}</Text>
            <Text size="small" className="text-inactive whitespace-pre-wrap">
              {item.toppingDisplayText}
            </Text>
            {item.note && (
              <Text size="small" className="text-inactive">
                {item.note}
              </Text>
            )}
            <Text size="small" className="text-primary font-medium">
              {formatMoney(product.price)}
            </Text>
            <SolidButton
              xSmall
              variant="tertiary"
              onClick={() => {
                viewDetail(item.id)
                onEdit?.()
              }}
            >
              {t('btn.edit')}
            </SolidButton>
          </div>
          <QuantityInput
            value={item.quantity}
            onChange={(quantity) => addToCart(quantity, undefined, undefined, undefined, item.id)}
            debounce={1000}
            onZero={confirmZeroQuantity}
          />
        </div>
      )}
    />
  )
}
