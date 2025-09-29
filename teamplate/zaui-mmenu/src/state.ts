import { atom } from 'jotai'
import { atomFamily, atomWithRefresh, atomWithReset, unwrap } from 'jotai/utils'
import { authorize, getPhoneNumber, getUserID } from 'zmp-sdk'
import { getUserInfo } from 'zmp-sdk'

import { DishTypes } from '@/constants/mmenu'

import { Cart, Dish, FloatingCartStatus } from './@types/generic'
import type {
  CartResponse,
  CheckoutOrderDetailsResponse,
  CheckoutResponse,
  LoginResponse,
  MenuResponse,
  OrderHistoryResponse,
  TableResponse,
} from './@types/mmenu'
import { ConfirmDialogProps } from './components/confirm-dialog'
import { getCurrentAccessToken, request } from './utils/request'
import { toLowerCaseNonAccentVietnamese } from './utils/string'

export const activeCategoryIdState = atom('')

export const languageState = atom('en')

export const selectedDishTypeState = atom<(typeof DishTypes)[number]>('all')

export const selectedCategoryState = atom(0)

export const collapsedHeaderState = atom(false)

export const keywordState = atomWithReset('')

export const floatingCartState = atom<FloatingCartStatus>('visible')

export const searchResultState = unwrap(
  atom(async (get) => {
    const keyword = get(keywordState)
    const searchPattern = toLowerCaseNonAccentVietnamese(keyword.trim())
    const res: Dish[] = []
    if (searchPattern.length >= 3) {
      const menu = await get(supportedMenuState)
      for (const dishMenu of menu.restaurantMenu.dishesMenu) {
        for (const dish of dishMenu.dishes) {
          if (
            toLowerCaseNonAccentVietnamese(dish.name).includes(searchPattern) ||
            (!!dish.description && toLowerCaseNonAccentVietnamese(dish.description).includes(searchPattern))
          ) {
            res.push(dish)
          }
          if (res.length > 20) {
            return res
          }
        }
      }
    }
    return res
  }),
  (prev) => prev ?? [],
)

export const attachedDishesState = atom(async (get) => {
  const menu = await get(menuState)
  const res: Dish[] = []
  for (const dishMenu of menu.restaurantMenu.dishesMenu) {
    for (const dish of dishMenu.dishes) {
      if (dish.attachedDishes) {
        for (const attachedDish of dish.attachedDishes) {
          res.push({
            ...attachedDish,
            id: attachedDish.attachedDishId,
            name: attachedDish.attachedDishName,
            price: attachedDish.price ?? 0,
          })
        }
      }
      if (dish.toppings) {
        for (const topping of dish.toppings) {
          if (topping.attachedDishes) {
            for (const toppingAttachedDish of topping.attachedDishes) {
              res.push({
                ...toppingAttachedDish,
                id: toppingAttachedDish.attachedDishId,
                name: toppingAttachedDish.attachedDishName,
              })
            }
          }
        }
      }
    }
  }
  return res
})

export const dishState = atomFamily((dishId?: string) =>
  atom<Promise<Dish | undefined>>(async (get) => {
    if (dishId) {
      for (const dishMenu of (await get(supportedMenuState)).restaurantMenu.dishesMenu) {
        for (const dish of dishMenu.dishes) {
          if (dish.id === dishId) {
            return dish
          }
        }
      }
      for (const dish of await get(attachedDishesState)) {
        if (dish.id === dishId) {
          return dish
        }
      }
    }
  }),
)

export const attachedDishImageState = atomFamily((dishId?: string) =>
  atom(async (get) => {
    if (dishId) {
      const dish = await get(dishState(dishId))
      return dish?.images
    }
  }),
)

export const clientSideCartState = atom<Cart>([])

export const countCartState = atom(async (get) => {
  const cart = await get(cartState)
  return cart.result.totalItemCount
})

export const cartTotalState = atom(async (get) => {
  const cart = await get(cartState)
  return cart.result.totalCartPaid
})

export const globalConfirmState = atomWithReset<ConfirmDialogProps>({
  title: '',
  message: '',
  visible: false,
  onClose: () => {},
  onConfirm: () => {},
})

export const itemsInCartState = atomFamily((itemId: string) =>
  atom(async (get) => {
    const cart = await get(cartState)
    return cart.result.cartItems.filter((item) => item.dishId.id === itemId)
  }),
)

export const countItemsInCartState = atomFamily((itemId: string) =>
  atom(async (get) => {
    const items = await get(itemsInCartState(itemId))
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }),
)

/**
 * This state must only be calculated when the `menu` is changed (likely once).
 */
export const categoryIdProductIdsMapState = atom(async (get) => {
  const menu = await get(menuState)
  return menu.restaurantMenu.dishesMenu.reduce(
    (map, dishMenu) =>
      Object.assign(map, {
        [dishMenu.dishCategory.dishCategoryId]: dishMenu.dishes.map((dish) => dish.id),
      }),
    {} as Record<string, string[]>,
  )
})

/**
 * This state will be calculated whenever the `cart` is changed (likely more frequently).
 */
export const countItemsInCartByCategoryState = atom(async (get) => {
  const map = await get(categoryIdProductIdsMapState)
  const cart = await get(cartState)
  return Object.entries(map).reduce(
    (map, [categoryId, productIds]) => {
      const items = cart.result.cartItems.filter((item) => productIds.includes(item.dishId.id))
      return Object.assign(map, {
        [categoryId]: items.reduce((sum, item) => sum + item.quantity, 0),
      })
    },
    {} as Record<string, number>,
  )
})

export const countItemsInCartByCategoryStateSync = unwrap(countItemsInCartByCategoryState, (prev) => prev ?? {})

const searchParams = new URLSearchParams(location.search)
export const restaurantIdState = atom(searchParams.get('restaurant') || '6402c824cc53e22d92a6a4d5') // TODO: Update this logic
export const tableIdState = atom(searchParams.get('table') || '6402c825cc53e22d92a6a59c') // TODO: Update this logic
export const mMenuAppIdState = atom('mmenu-customer') // TODO: Update this logic
export const userIdState = atom(async (get) => (await get(authenticationState)).user.id)

export const userNameState = atom(async (get) => {
  const scopes = await get(authorizeScopeState)
  if (scopes.includes('scope.userInfo')) {
    return (await getUserInfo({ autoRequestPermission: true })).userInfo.name
  } else {
    return (await get(authenticationState)).user.name
  }
})

export const userPhoneState = atom(async (get) => {
  const scopes = await get(authorizeScopeState)
  if (scopes.includes('scope.userPhonenumber')) {
    const { token } = await getPhoneNumber()
    const accessToken = await getCurrentAccessToken()
    const phone = await new Promise<string>((resolve) => {
      console.log({ token, accessToken }) // TODO: Send these 2 tokens to your server to decode the phone number. Instruction: https://mini.zalo.me/docs/api/getPhoneNumber/ > Hướng dẫn chuyển đổi token thành số điện thoại người dùng
      setTimeout(() => resolve('84123456789'), 3000)
    })
    return `0${phone.slice(2)}`
  }
})

export const authorizeScopeState = atom(async (get) => {
  const cart = await get(cartState)
  const scopes: NonNullable<Parameters<typeof authorize>[0]>['scopes'] = []
  if (cart.requireCustomerInfomation) {
    scopes.push('scope.userInfo')
  }
  if (cart.requiredPhoneNumber) {
    scopes.push('scope.userPhonenumber')
  }
  return scopes
})

/**
 * Request states
 */

export const authenticationState = atom(async (get) => {
  const zaloUserId = await getUserID()
  const restaurantId = await get(restaurantIdState)
  const appid = get(mMenuAppIdState)
  const res = (await request('/v2/zalo/signin-by-zalo-id', {
    method: 'POST',
    body: { zaloUserId, restaurantId },
    headers: { appid },
  })) as LoginResponse
  return res
})

export const bearerTokenState = atom(async (get) => {
  const authentication = get(authenticationState)
  return `Bearer ${(await authentication).accessToken}`
})

export const orderHistoryState = atomWithRefresh<Promise<OrderHistoryResponse>>(async (get) => {
  const restaurantId = await get(restaurantIdState)
  const authorization = await get(bearerTokenState)
  const tableId = await get(tableIdState)
  const userId = await get(userIdState)
  const appid = get(mMenuAppIdState)
  try {
    const res = (await request('/v2/orders/restaurants/:restaurantId/order-sessions', {
      params: { restaurantId },
      queries: {
        tableId,
        userId,
      },
      headers: {
        authorization,
        appid,
      },
    })) as OrderHistoryResponse
    return res
  } catch (error) {
    return {
      code: 0,
      message: '',
      activeOrder: {
        pretaxPaymentAmount: 0,
        orderDetails: [],
      },
    } as unknown as OrderHistoryResponse
  }
})

export const checkoutResultState = atom(async (get) => {
  const restaurantId = await get(restaurantIdState)
  const authorization = await get(bearerTokenState)
  const orderSessionId = (await get(orderHistoryState)).activeOrder?.orderId
  const appid = get(mMenuAppIdState)
  if (orderSessionId) {
    const res = (await request('/v2/restaurants/:restaurantId/order-sessions/:orderSessionId/customerRequestToPay', {
      method: 'POST',
      params: { restaurantId, orderSessionId },
      headers: {
        authorization,
        appid,
      },
    })) as CheckoutResponse
    return res.result
  }
})

export const checkoutOrderDetailsState = atom(async (get) => {
  const authorization = await get(bearerTokenState)
  const restaurantId = await get(restaurantIdState)
  const orderSessionId = (await get(orderHistoryState)).activeOrder?.orderId
  const appid = get(mMenuAppIdState)
  if (orderSessionId) {
    const res = (await request('/v2/restaurants/:restaurantId/order-sessions/:orderSessionId/forInvoice', {
      params: { restaurantId, orderSessionId },
      headers: {
        authorization,
        appid,
      },
    })) as CheckoutOrderDetailsResponse
    return res.orderSession
  }
})

export const tableState = atom(async (get) => {
  const tableId = get(tableIdState)
  const restaurantId = await get(restaurantIdState)
  const authorization = await get(bearerTokenState)
  return (await request('/v2/restaurants/:restaurantId/table/customer/getTableInformation', {
    method: 'POST',
    params: { restaurantId },
    body: {
      tableId,
    },
    headers: { authorization },
  })) as TableResponse
})

export const rawMenuState = atom(async (get) => {
  const lang = get(languageState)
  const tableId = get(tableIdState)
  const authorization = await get(bearerTokenState)
  const restaurantId = await get(restaurantIdState)
  const userId = await get(userIdState)
  const res = (await request('/v2/menus/restaurants/:restaurantId/menus/customer-web', {
    params: { restaurantId },
    queries: {
      tableId,
      userId,
      status: 'available,unavailable',
    },
    headers: { lang, authorization },
  })) as MenuResponse
  return res
})

export const supportedMenuState = atom(async (get) => {
  const res = await get(rawMenuState)

  return {
    ...res,
    restaurantMenu: {
      ...res.restaurantMenu,
      dishesMenu: res.restaurantMenu.dishesMenu.map((dishMenu) => ({
        ...dishMenu,
        dishes: dishMenu.dishes
          // temporarily hide combo dishes
          .filter((dish) => dish.dishType !== 'combo'),
      })),
    },
  }
})

export const menuState = atom(async (get) => {
  const res = await get(supportedMenuState)
  const selectedDishType = get(selectedDishTypeState)

  return {
    ...res,
    restaurantMenu: {
      ...res.restaurantMenu,
      dishesMenu: res.restaurantMenu.dishesMenu
        .map((dishMenu) => ({
          ...dishMenu,
          dishes: dishMenu.dishes.filter((dish) => selectedDishType === 'all' || dish.dishType === selectedDishType),
        }))
        .filter((dishMenu) => dishMenu.dishes.length > 0),
    },
  }
})

export const mMenuCartState = atomWithRefresh(async (get) => {
  const lang = get(languageState)
  const authorization = await get(bearerTokenState)
  const restaurantId = await get(restaurantIdState)
  const tableId = get(tableIdState)
  const res = (await request('/v2/restaurants/:restaurantId/client/cart', {
    params: { restaurantId },
    queries: { tableId },
    headers: {
      lang,
      authorization,
    },
  })) as CartResponse
  res.result.cartItems.sort((a, b) => b.id.localeCompare(a.id))
  return res
})

export const cartItemState = atomFamily((cartItemId?: string) =>
  atom(async (get) => {
    if (cartItemId) {
      const cart = await get(mMenuCartState)
      return cart.result.cartItems.find((item) => item.id === cartItemId)
    }
  }),
)

export const cartState = unwrap(
  mMenuCartState,
  (prev) =>
    prev ??
    ({
      result: {
        cartItems: [],
      },
    } as unknown as CartResponse),
)
