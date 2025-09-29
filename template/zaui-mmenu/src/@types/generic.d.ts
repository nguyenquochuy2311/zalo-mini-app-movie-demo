import { Topping } from './mmenu'

export type SelectedTopping = Record<string, number>

export type SelectedToppings = Record<string, SelectedTopping>

export interface Dish {
  id: string
  name: string
  price: number
  images?: string[]
  isNewDish?: boolean
  isDisplayLargeImage?: boolean
  isDishGroup?: boolean
  hasTopping?: boolean
  toppings?: Topping[]
  description?: string
  status?: 'available' | 'unavailable'
}

export interface CartItem {
  product: Dish
  options?: SelectedToppings
  note?: string
  quantity: number
}

export type Cart = CartItem[]

export type FloatingCartStatus = 'visible' | 'hidden' | 'lower'
