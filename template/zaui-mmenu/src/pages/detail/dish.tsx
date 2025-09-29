import { useAtomValue } from 'jotai'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { Button, Header, Page, Text, useNavigate, useSnackbar } from 'zmp-ui'

import { SelectedTopping, SelectedToppings } from '@/@types/generic'
import { AttachedDishPicker } from '@/components/attached-dish-picker'
import { ElasticTextarea } from '@/components/elastic-textarea'
import { PageContainer } from '@/components/page-container'
import { QuantityInput } from '@/components/quantity-input'
import { ToppingPicker } from '@/components/topping-picker'
import { DishNotFoundError } from '@/constants/errors'
import { useAddToCartRequest, useFloatingCartStatus } from '@/hooks'
import { cartItemState, dishState } from '@/state'
import { formatMoney } from '@/utils/format'

export default function FoodDetailPage() {
  const { id } = useParams()
  const dish = useAtomValue(dishState(id))
  if (!dish) throw new DishNotFoundError()

  const navigate = useNavigate()
  const { addToCart } = useAddToCartRequest(dish)
  const { t } = useTranslation()
  useFloatingCartStatus(dish.isDishGroup ? 'lower' : 'hidden')

  const { state: cartItemId } = useLocation() as { state?: string }
  const cartItem = useAtomValue(cartItemState(cartItemId))
  const [quantity, setQuantity] = useState(cartItem?.quantity ?? 1)
  const [note, setNote] = useState(cartItem?.note ?? '')
  const [selectedToppings, setSelectedToppings] = useState<SelectedToppings>(
    cartItem?.toppingItems.reduce((userSelectedOptions, topping) => {
      if (topping.toppingId && topping.id && topping.quantity) {
        if (!userSelectedOptions[topping.toppingId]) {
          userSelectedOptions[topping.toppingId] = {}
        }
        userSelectedOptions[topping.toppingId][topping.id] = topping.quantity
      }
      return userSelectedOptions
    }, {} as SelectedToppings) ??
      dish.toppings?.reduce(
        (defaultOptions, topping) =>
          Object.assign(defaultOptions, {
            [topping.toppingId]: topping.toppingItems?.reduce(
              (acc, toppingItem) =>
                Object.assign(acc, {
                  [toppingItem.toppingItemId]: !topping.hasQuantity && toppingItem.isDefault ? 1 : 0,
                }),
              {} as SelectedTopping,
            ),
          }),
        {} as SelectedToppings,
      ) ??
      {},
  )

  const [validating, setValidating] = useState(false)
  const [loading, setLoading] = useState(false)
  const { openSnackbar } = useSnackbar()

  const additionalPrice = useMemo(() => {
    let price = 0
    if (dish.toppings) {
      for (const topping of dish.toppings) {
        if (selectedToppings[topping.toppingId]) {
          if (topping.toppingItems) {
            for (const item of topping.toppingItems) {
              if (selectedToppings[topping.toppingId][item.toppingItemId]) {
                price += item.price * selectedToppings[topping.toppingId][item.toppingItemId]
              }
            }
          }
        }
      }
    }
    return price
  }, [dish.toppings, selectedToppings])

  const validate = () => {
    if (dish.toppings) {
      for (const topping of dish.toppings) {
        if (selectedToppings[topping.toppingId]) {
          const values = Object.values(selectedToppings[topping.toppingId])
          const sum = values.reduce((sum, value) => sum + value, 0)
          if (topping.isRequired) {
            if (sum === 0) {
              return false
            }
          }
          if (topping.limitQuantity) {
            if (sum > topping.limitQuantity) {
              return false
            }
          }
        } else {
          if (topping.isRequired && !topping.attachedDishes) {
            return false
          }
        }
      }
    }
    return true
  }

  return (
    <Page restoreScroll>
      <Header title={t('lbl.pick-dish')} className="no-divider bg-primary text-white" />
      <PageContainer withHeader withBottomNav={dish.isDishGroup} className="flex flex-col min-h-screen">
        {dish.images && (
          <div className="flex overflow-x-auto snap-mandatory snap-x">
            {dish.images.map((image) => (
              <div
                key={image}
                className={`snap-start flex-none w-screen ${dish.isDisplayLargeImage ? 'aspect-w-9 aspect-h-5' : 'aspect-w-1 aspect-h-1'}`}
              >
                <img className="w-full h-full object-center object-cover" src={image} />
              </div>
            ))}
          </div>
        )}
        <div className="flex-1 w-full flex flex-col space-y-3 pb-6">
          <div className="w-full bg-white">
            <div className="flex space-x-2 justify-between p-4">
              <Text size="xLarge">{dish.name}</Text>
              <Text size="xLarge" className="font-medium text-primary">
                {formatMoney(dish.price)}
              </Text>
            </div>
            {dish.description && (
              <Text size="normal" className="p-4 pt-0 whitespace-pre-wrap text-text-secondary">
                {dish.description}
              </Text>
            )}
          </div>

          {dish.hasTopping && dish.toppings && (
            <>
              {dish.toppings.map((topping) =>
                topping.attachedDishes ? (
                  <AttachedDishPicker key={topping.toppingId} topping={topping} />
                ) : (
                  <ToppingPicker
                    key={topping.toppingId}
                    validating={validating}
                    topping={topping}
                    value={selectedToppings[topping.toppingId]}
                    onChange={(value) => {
                      setSelectedToppings((st) => ({
                        ...st,
                        [topping.toppingId]: value,
                      }))
                    }}
                  />
                ),
              )}
            </>
          )}
          {!dish.isDishGroup && (
            <div className="px-4">
              <ElasticTextarea
                label={t('lbl.note')}
                placeholder={t('pld.note')}
                value={note}
                onChange={(e) => setNote(e.currentTarget.value)}
                showCount
                maxLength={40}
              />
            </div>
          )}
        </div>
        {!dish.isDishGroup && (
          <div
            className="p-4 space-y-3 bg-white sticky bottom-0"
            style={{
              boxShadow: '0px -2px 6px 0px #0D0D0D24',
            }}
          >
            <div className="w-full flex justify-between space-x-4 font-medium">
              <Text size="large">{t('lbl.total')}</Text>
              <Text size="xLarge" className="text-primary">
                {formatMoney((dish.price + additionalPrice) * quantity)}
              </Text>
            </div>
            <div className="w-full flex justify-between space-x-4 font-medium">
              <QuantityInput value={quantity} onChange={setQuantity} min={cartItemId ? 0 : 1} />
              <Button
                className="flex-1"
                fullWidth
                loading={loading}
                onClick={async () => {
                  try {
                    setLoading(true)
                    setValidating(true)
                    if (validate()) {
                      if (
                        await addToCart(quantity, note, selectedToppings, undefined, cartItemId, {
                          delayRefresh: 200,
                        })
                      ) {
                        navigate(-1)
                      }
                    } else {
                      openSnackbar({
                        type: 'error',
                        text: t('lbl.invalid-topping-options'),
                      })
                    }
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                {cartItemId ? t('btn.update-cart') : t('btn.add-to-cart')}
              </Button>
            </div>
          </div>
        )}
      </PageContainer>
    </Page>
  )
}
