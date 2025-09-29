import { useAtomValue } from 'jotai'
import React, { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Text } from 'zmp-ui'

import { Dish } from '@/@types/generic'
import { useAddToCartRequest } from '@/hooks'
import { countItemsInCartState } from '@/state'
import { formatMoney } from '@/utils/format'

import { QuantityInput, QuantityInputProps } from './quantity-input'
import { SolidButton } from './solid-button'
import { VariantsInCartSheet } from './variants-in-cart-sheet'

export type DishItemProps = {
  dish: Dish
  customRender?: (
    renderProps: { dish: Dish; count: number; controls: ReactNode } & ReturnType<typeof useAddToCartRequest>,
  ) => React.ReactNode
}

export function DishItem({ dish, customRender }: DishItemProps) {
  const { t } = useTranslation()
  const { addToCart, viewDetail, confirmZeroQuantity, showSuccessToast } = useAddToCartRequest(dish)
  const count = useAtomValue(countItemsInCartState(dish.id))

  const noImage = useMemo(() => !dish.images || !dish.images.length, [dish.images])

  const quantityInputStyles: QuantityInputProps['styles'] = {
    wrapper: {
      height: 28,
      border: '2.33px solid white',
      backgroundColor: 'white',
      borderRadius: 9999,
    },
    button: {
      height: 24,
      width: 24,
    },
  }

  const controls =
    !dish.isDishGroup && dish.hasTopping && count > 0 ? (
      <VariantsInCartSheet dish={dish}>
        {({ open }) => <QuantityInput key={count} styles={quantityInputStyles} value={count} onChange={open} />}
      </VariantsInCartSheet>
    ) : (
      <QuantityInput
        key={count}
        styles={quantityInputStyles}
        value={count}
        onChange={addToCart}
        onZero={confirmZeroQuantity}
        debounce={1000}
        renderZero={({ onClick }) => (
          <Button
            className="border-[2.33px] border-white border-solid rounded-full !h-[28px] !w-[28px]"
            icon={<Icon icon="zi-plus" />}
            size="small"
            variant="primary"
            onClick={(e) => {
              if (dish.isDishGroup || dish.hasTopping) {
                viewDetail()
              } else {
                onClick(e)
              }
            }}
          />
        )}
      />
    )

  if (customRender) {
    return customRender({ dish, count, addToCart, viewDetail, confirmZeroQuantity, showSuccessToast, controls })
  }

  return (
    <>
      <div
        className={`relative border border-solid border-[#DCDFE5] bg-background rounded-lg overflow-hidden ${dish.isDisplayLargeImage || noImage ? 'col-span-2' : ''}`}
        onClick={() => {
          if (dish.status !== 'unavailable') {
            viewDetail()
          }
        }}
      >
        {!noImage && (
          <div className="relative">
            <div
              className={`${dish.isDisplayLargeImage ? 'aspect-w-9 aspect-h-5' : 'aspect-w-1 aspect-h-1'} ${dish.status === 'unavailable' ? 'opacity-50' : ''}`}
            >
              <img src={dish.images![0]} alt={dish.name} className="w-full h-full object-center object-cover" />
            </div>
            {dish.status === 'available' && (
              <div className="absolute right-1.5 bottom-1.5" onClick={(e) => e.stopPropagation()}>
                {controls}
              </div>
            )}
          </div>
        )}

        {dish.isNewDish && (
          <div className="bg-white/40 rounded-full p-[2.63px] absolute top-2 left-2">
            <div className="uppercase text-primary font-black px-2 py-1 bg-white text-[11px] leading-[11px] rounded-full">
              {t('lbl.new')}
            </div>
          </div>
        )}

        <div className="p-3 flex space-x-2">
          <div className="flex-1 flex flex-col space-y-2 relative min-w-0">
            <Text
              size="small"
              className={`!mt-0 line-clamp-2 ${dish.isDisplayLargeImage || noImage ? '' : 'h-[36px]'}`}
            >
              {dish.name}
            </Text>
            <div className="flex items-center justify-between space-x-2">
              <Text size="small" className="text-primary font-medium truncate">
                {formatMoney(dish.price)}
              </Text>
              {dish.status === 'unavailable' && (
                <SolidButton xSmall className="px-2.5 text-xs flex-none">
                  {t('lbl.unavailable')}
                </SolidButton>
              )}
            </div>
          </div>
          {noImage && dish.status === 'available' && (
            <div className="flex-none" onClick={(e) => e.stopPropagation()}>
              {controls}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
