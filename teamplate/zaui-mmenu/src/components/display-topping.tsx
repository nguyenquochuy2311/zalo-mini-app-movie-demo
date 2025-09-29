import React from 'react'

import { Dish, SelectedToppings } from '@/@types/generic'

export function DisplayTopping({ dish, toppings }: { dish: Dish; toppings?: SelectedToppings }) {
  if (!dish.hasTopping || !dish.toppings || !toppings) {
    return ''
  }
  return (
    <span className="whitespace-pre-line">
      {Object.entries(toppings)
        .map(([key, value]) => {
          const topping = dish.toppings!.find((topping) => topping.toppingId === key)!
          return Object.entries(value)
            .map(([key, value]) => {
              const selectedOption = (topping.toppingItems ?? []).find((item) => item.toppingItemId === key)!
              return `${selectedOption.name}${topping.hasQuantity ? ` x${value}` : ''}`
            })
            .join(', ')
        })
        .join(', ')}
    </span>
  )
}
