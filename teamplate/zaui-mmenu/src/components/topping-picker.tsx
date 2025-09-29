import React, { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox, List, Radio, Text } from 'zmp-ui'

import { Topping } from '@/@types/mmenu'
import { clsx } from '@/utils/clsx'
import { formatMoney } from '@/utils/format'

import { OptionHint } from './option-hint'
import { QuantityInput } from './quantity-input'

export const ToppingPicker: FC<{
  topping: Topping
  value: Record<string, number>
  onChange: (value: Record<string, number>) => void
  validating?: boolean
}> = ({ topping, value, onChange, validating }) => {
  const { t } = useTranslation()
  const countOptions = useMemo(() => {
    return Object.entries(value).reduce((sum, [_, count]) => sum + count, 0)
  }, [value])

  return (
    <div className="bg-white my-2">
      <div className="space-y-[2px] p-4">
        <Text size="xLarge" className="font-medium">
          {topping.toppingName}
        </Text>
        <Text size="small" className="text-inactive flex flex-col space-y-1.5">
          <OptionHint topping={topping} />
          {!!validating && !!topping.isRequired && countOptions === 0 && (
            <span className="text-red-accent">{t('vld.min-option', { count: 1 })}</span>
          )}
          {!!validating && !!topping.hasQuantity && !!topping.limitQuantity && countOptions > topping.limitQuantity && (
            <span className="text-red-accent">{t('vld.max-option', { count: topping.limitQuantity })}</span>
          )}
        </Text>
      </div>
      <hr className="border-divider !my-0 mx-4"></hr>
      {topping.toppingItems && (
        <List divider noSpacing>
          {topping.toppingItems?.map((item) => (
            <List.Item
              className="*:items-center"
              key={item.toppingItemId}
              onClick={() => {
                if (!topping.hasQuantity) {
                  const checked = !!value[item.toppingItemId]
                  if (!checked) {
                    if (topping.isMultipleSecleted) {
                      onChange({ ...value, [item.toppingItemId]: 1 })
                    } else {
                      onChange({ [item.toppingItemId]: 1 })
                    }
                  } else {
                    if (topping.isMultipleSecleted || !topping.isRequired) {
                      delete value[item.toppingItemId]
                      onChange({ ...value })
                    }
                  }
                }
              }}
              prefix={
                !topping.isMultipleSecleted && !topping.hasQuantity ? (
                  <Radio
                    value={item.toppingItemId}
                    checked={!!value[item.toppingItemId]}
                    className="pointer-events-none"
                  />
                ) : undefined
              }
              suffix={
                topping.hasQuantity ? (
                  <QuantityInput
                    value={value[item.toppingItemId] ?? 0}
                    onChange={(quantity) => {
                      if (topping.isMultipleSecleted) {
                        onChange({ ...value, [item.toppingItemId]: quantity })
                      } else {
                        onChange({ [item.toppingItemId]: quantity })
                      }
                    }}
                  />
                ) : topping.isMultipleSecleted ? (
                  <Checkbox
                    value={item.toppingItemId}
                    checked={!!value[item.toppingItemId]}
                    className="pointer-events-none"
                  />
                ) : undefined
              }
            >
              <Text size="large">
                <span>{item.name}</span>
                <span className={clsx(['inline ml-1', item.price > 0 && 'text-primary'])}>
                  (+{formatMoney(item.price)})
                </span>
              </Text>
            </List.Item>
          ))}
        </List>
      )}
    </div>
  )
}
