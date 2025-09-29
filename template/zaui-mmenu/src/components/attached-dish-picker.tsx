import { useAtomValue } from 'jotai'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { List, Text } from 'zmp-ui'

import { Topping } from '@/@types/mmenu'
import { attachedDishImageState } from '@/state'
import dummyDish from '@/static/dummy-dish.svg'
import { formatMoney } from '@/utils/format'

import { DishItem } from './dish-item'
import { QuantityInput } from './quantity-input'

const AttachedDishImage = (props: { id: string }) => {
  const images = useAtomValue(attachedDishImageState(props.id))
  return <img src={images?.[0] ?? dummyDish} className="w-10 h-10 rounded-lg" />
}

export const AttachedDishPicker: FC<{
  topping: Topping
}> = ({ topping }) => {
  const { t } = useTranslation()
  return (
    <div className="bg-white my-2">
      <div className="space-y-[2px] p-4">
        <Text size="xLarge" className="font-medium">
          {topping.toppingName}
        </Text>
        <Text size="small" className="text-inactive flex flex-col space-y-1.5">
          {t('lbl.group-dish-hint')}
        </Text>
      </div>
      <hr className="border-divider border-b-0 !my-0 mx-4"></hr>
      {topping.attachedDishes && (
        <List divider noSpacing>
          {topping.attachedDishes.map((item) => (
            <DishItem
              key={item.attachedDishId}
              dish={{
                ...item,
                id: item.attachedDishId,
                name: item.attachedDishName,
                images: item.image ? [item.image] : undefined,
              }}
              customRender={({ dish, count, addToCart, viewDetail, confirmZeroQuantity }) => (
                <List.Item
                  className="*:w-full *:items-center *:*:overflow-hidden"
                  key={dish.id}
                  onClick={() => viewDetail()}
                  suffix={
                    <QuantityInput
                      max={topping.limitQuantity}
                      value={count}
                      onChange={(quantity) => {
                        addToCart(quantity)
                      }}
                      onZero={confirmZeroQuantity}
                      debounce={1000}
                    />
                  }
                >
                  <div className="flex space-x-2 flex-1">
                    <AttachedDishImage id={dish.id} />

                    <div className="flex flex-col space-y-1 font-medium overflow-hidden">
                      <Text size="small">{dish.name}</Text>
                      <Text size="small" className="text-primary">
                        {formatMoney(dish.price)}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ))}
        </List>
      )}
    </div>
  )
}
