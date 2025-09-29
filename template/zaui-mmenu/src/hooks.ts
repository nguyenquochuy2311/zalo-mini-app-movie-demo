import { Atom, useSetAtom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { vibrate } from 'zmp-sdk'
import { useNavigate, useSnackbar } from 'zmp-ui'

import { Cart, CartItem, Dish, FloatingCartStatus, SelectedToppings } from './@types/generic'
import { useConfirm } from './components/confirm-dialog'
import {
  bearerTokenState,
  clientSideCartState,
  floatingCartState,
  languageState,
  mMenuAppIdState,
  mMenuCartState,
  orderHistoryState,
  restaurantIdState,
  tableIdState,
  userNameState,
  userPhoneState,
} from './state'
import { isIdentical } from './utils/object'
import { request } from './utils/request'

export function useToggle(initial = false) {
  const [state, setState] = useState(initial)

  const toggle = useCallback(() => setState((state) => !state), [])
  const on = useCallback(() => setState(true), [])
  const off = useCallback(() => setState(false), [])

  const actions = useMemo(() => ({ toggle, on, off }), [toggle, on, off])

  return [state, actions] as const
}

export function useAnimate<T>(value: T) {
  const [animate, toggler] = useToggle(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const firstRender = useRef<boolean>(true)

  useEffect(() => {
    if (!firstRender.current && value) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      toggler.on()
      timeoutRef.current = setTimeout(() => {
        toggler.off()
      }, 500)
    }
    if (firstRender.current) {
      firstRender.current = false
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [toggler, value])

  return [animate, toggler] as const
}

/**
 * Handle cart logic on the client-side
 * @param product Product to add to cart
 * @returns A callback to add product to cart
 */
export function useAddToCart(product: Dish) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const viewDetail = (cartItem?: CartItem) =>
    navigate(`/dish/${product.id}`, {
      state: cartItem,
    })
  const confirm = useConfirm()
  const { openSnackbar } = useSnackbar()

  const setCart = useSetAtom(clientSideCartState)

  async function actionWithConfirm<T>(quantity: number, action: () => Promise<T>) {
    // Số lượng món giảm về 0?
    if (quantity === 0) {
      // Hiện popup confirm xóa món
      const confirmed = await confirm({
        title: t('lbl.confirm-remove-cart-item'),
        message: t('lbl.are-you-sure-remove-cart-item'),
      })
      if (!confirmed) {
        return
      }
    }
    return await action()
  }

  const updateCartItem = (
    item: CartItem | Parameters<Cart['find']>[0],
    quantity: number,
    options?: SelectedToppings,
    note?: string,
  ) => {
    return actionWithConfirm(quantity, async () => {
      setCart((cart) => {
        const existed = typeof item === 'function' ? cart.find(item) : cart[cart.indexOf(item)]
        if (existed) {
          if (quantity > 0) {
            existed.quantity = quantity
            if (typeof options !== 'undefined') {
              existed.options = options
            }
            if (typeof note !== 'undefined') {
              existed.note = note
            }
            return [...cart]
          } else {
            return cart.filter((item) => item !== existed)
          }
        }
        return cart
      })
    })
  }

  const addToCart = async (
    quantity: number,
    options?: SelectedToppings,
    note?: string,
    behaviors?: { showToast?: boolean; append?: boolean },
  ) => {
    return actionWithConfirm(quantity, async () => {
      setCart((cart) => {
        const res = [...cart]
        const existed = cart.find(
          (item) => item.product.id === product.id && item.note == note && isIdentical(item.options, options),
        )
        const processCartChange = () => {
          // (+)/(-) vào giỏ hàng
          if (quantity > 0) {
            if (existed) {
              if (behaviors?.append) {
                existed.quantity += quantity
              } else {
                existed.quantity = quantity
              }
            } else {
              res.push({
                product,
                quantity,
                options,
                note,
              })
            }
            if (behaviors?.showToast) {
              openSnackbar({
                type: 'success',
                text: t('lbl.add-to-cart-success'),
              })
            }
          } else {
            res.splice(cart.indexOf(existed!), 1)
          }
        }
        // Group dish?
        if (product.isDishGroup) {
          viewDetail()
        } else {
          // Món có tùy chọn?
          if (product.hasTopping) {
            // Đang ở trang chi tiết món, tiến hành thêm món
            if (options) {
              processCartChange()
            } else {
              // Đang ở trang listing, cần navigate qua trang chi tiết
              // Món đang nằm trong giỏ hàng?
              if (existed) {
                // Mở trang chi tiết món đang nằm trong giỏ hàng
              } else {
                viewDetail()
              }
            }
          } else {
            processCartChange()
          }
        }
        return res
      })
    })
  }

  return { addToCart, updateCartItem, viewDetail }
}

export const useCallStaff = () => {
  const { t } = useTranslation()
  const { openSnackbar } = useSnackbar()
  const requestCallStaff = useCallStaffRequest()

  return () => {
    vibrate({ type: 'oneShot', milliseconds: 1000 })
    requestCallStaff()
    openSnackbar({
      type: 'success',
      text: t('lbl.call-staff-success'),
    })
  }
}
export const useFloatingCartStatus = (status: FloatingCartStatus) => {
  const setFloatingCart = useSetAtom(floatingCartState)
  useEffect(() => {
    setFloatingCart(status)
  }, [status, setFloatingCart])
}

/**
 * Request hooks
 */
export function useImperativeGet<T>(state: Atom<T>) {
  return useAtomCallback(useCallback((get) => get(state), [state]))
}

export const useImperativeRequest = () => {
  const getAuthorization = useImperativeGet(bearerTokenState)
  const getLang = useImperativeGet(languageState)
  const getAppId = useImperativeGet(mMenuAppIdState)
  const { openSnackbar } = useSnackbar()

  return async function <Path extends string>(...params: Parameters<typeof request<Path>>) {
    try {
      return await request(params[0], {
        ...params[1],
        headers: {
          authorization: await getAuthorization(),
          appId: getAppId(),
          lang: getLang(),
          ...params[1]?.headers,
        },
      })
    } catch (error) {
      openSnackbar({
        type: 'error',
        text: (error as Error).message,
      })
    }
  }
}

export const useCallStaffRequest = () => {
  const request = useImperativeRequest()
  const getRestaurantId = useImperativeGet(restaurantIdState)
  const getTableId = useImperativeGet(tableIdState)

  return async () =>
    request('/v2/restaurants/:restaurantId/call-staff', {
      method: 'POST',
      params: { restaurantId: await getRestaurantId() },
      queries: {},
      body: {
        tableId: await getTableId(),
      },
    })
}

/**
 * Handle cart logic on the server-side
 * @returns A callback to send a network request for handling cart logic on the server.
 */
export const useAddToCartRequest = (product: Dish) => {
  const { t } = useTranslation()
  const { openSnackbar } = useSnackbar()
  const confirm = useConfirm()
  const request = useImperativeRequest()
  const getRestaurantId = useImperativeGet(restaurantIdState)
  const getTableId = useImperativeGet(tableIdState)
  const navigate = useNavigate()
  const viewDetail = (cartItemId?: string) =>
    navigate(`/dish/${product.id}`, {
      state: cartItemId,
    })
  const refreshCart = useSetAtom(mMenuCartState)

  const confirmZeroQuantity = () =>
    confirm({
      title: t('lbl.confirm-remove-cart-item'),
      message: t('lbl.are-you-sure-remove-cart-item'),
    })

  const addToCart = useCallback(
    async (
      quantity: number,
      note?: string,
      options?: SelectedToppings,
      attachedDishes?: { attachedDishId: string; quantity?: number; attachedDishName: string }[],
      cartItemId?: string,
      behaviors?: {
        delayRefresh?: number
      },
    ) => {
      const result = await request('/v2/restaurants/:restaurantId/client/cart', {
        method: 'PATCH',
        params: { restaurantId: await getRestaurantId() },
        body: {
          tableId: await getTableId(),
          dishId: product.id,
          quantity,
          ...(cartItemId ? { cartItemId } : {}),
          note: note || undefined,
          toppingItems:
            options &&
            Object.entries(options).reduce(
              (acc, [toppingId, items]) =>
                acc.concat(Object.entries(items ?? {}).map(([id, quantity]) => ({ toppingId, id, quantity }))),
              [] as { toppingId: string; id: string; quantity?: number }[],
            ),
          attachedDishes,
        },
      })
      if (behaviors?.delayRefresh) {
        setTimeout(() => {
          refreshCart()
        }, behaviors.delayRefresh)
      } else {
        refreshCart()
      }
      return result
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [product.id],
  )

  const showSuccessToast = () =>
    openSnackbar({
      type: 'success',
      text: t('lbl.add-to-cart-success'),
    })
  return { addToCart, viewDetail, showSuccessToast, confirmZeroQuantity }
}

export const useReorderRequest = () => {
  const request = useImperativeRequest()
  const getRestaurantId = useImperativeGet(restaurantIdState)

  const requestReorder = async (payload: {
    dishDetailId: string
    orderOrderId: string
    quantity: number
    note: string
  }) => {
    request('/v2/restaurants/:restaurantId/orderManagement/quick-order', {
      method: 'POST',
      params: {
        restaurantId: await getRestaurantId(),
      },
      body: {
        ...payload,
      },
    })
  }

  return { requestReorder }
}

export const useCheckoutRequest = () => {
  const request = useImperativeRequest()
  const getRestaurantId = useImperativeGet(restaurantIdState)
  const getTableId = useImperativeGet(tableIdState)
  const refreshCart = useSetAtom(mMenuCartState)
  const refreshOrderHistory = useSetAtom(orderHistoryState)
  const getUserPhone = useImperativeGet(userPhoneState)
  const getUserName = useImperativeGet(userNameState)

  const requestCheckout = async () => {
    const body: {
      tableId: string
      userName?: string
      userPhoneNumber?: string
      userAddress?: string
      userCompany?: string
      numberOfCustomers?: number
      servingTime?: number
      userNote?: string
    } = {
      tableId: await getTableId(),
      userPhoneNumber: await getUserPhone(),
      userName: await getUserName(),
    }
    await request('/v1/restaurants/:restaurantId/client/cart/checkout', {
      method: 'POST',
      params: {
        restaurantId: await getRestaurantId(),
      },
      body,
    })
    refreshOrderHistory()
    refreshCart()
  }

  return { requestCheckout }
}

export const usePaymentRequest = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const confirm = useConfirm()

  const requestPayment = async () => {
    const confirmed = await confirm({
      title: t('lbl.confirm-payment'),
      message: t('lbl.confirm-payment-desc'),
      okButtonProps: {
        text: t('btn.request-checkout'),
      },
    })
    if (confirmed) {
      vibrate({ type: 'oneShot', milliseconds: 1000 })
      navigate('/checkout', { replace: true })
    }
  }

  return { requestPayment }
}

export const useRatingRequest = () => {
  const request = useImperativeRequest()
  const getRestaurantId = useImperativeGet(restaurantIdState)
  const getUserName = useImperativeGet(userNameState)

  const requestRating = async (payload: { rating: number; reviewText: string }) => {
    request('/v2/restaurants/:restaurantId/review/submitRestaurantReview', {
      method: 'POST',
      params: {
        restaurantId: await getRestaurantId(),
      },
      body: {
        ...payload,
        customerName: await getUserName(),
        restaurantId: await getRestaurantId(),
      },
    })
  }

  return { requestRating }
}
