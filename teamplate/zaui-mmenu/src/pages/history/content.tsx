import { useAtomValue } from 'jotai'
import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Header, Text } from 'zmp-ui'

import { HeaderAddons } from '@/components/header-addons'
import LazyLoadUsername from '@/components/lazy-load-username'
import { OrderMoreDialog } from '@/components/order-more-dialog'
import { SolidButton } from '@/components/solid-button'
import { usePaymentRequest } from '@/hooks'
import { orderHistoryState } from '@/state'
import dummyDish from '@/static/dummy-dish.svg'
import { formatMoney, formatTime } from '@/utils/format'

export function OrderHistoryPageContent() {
  const { t } = useTranslation()
  const orders = useAtomValue(orderHistoryState)

  const { requestPayment } = usePaymentRequest()

  return (
    <>
      <Header title="Mmenu" showBackIcon={false} className="no-divider bg-primary text-white" />
      <HeaderAddons />
      <div className="flex-1 overflow-y-auto pb-2">
        {orders.activeOrder?.orderDetails?.map((item, i, items) => (
          <div key={item.orderDetailId} className="p-4 bg-white">
            <div className="flex justify-between space-x-4">
              <Text size="small" className="font-medium">
                {t('lbl.order-no', { count: items.length - i })} - {formatTime(orders.activeOrder!.createdAt)}
              </Text>
              <Text size="small" className="text-right">
                <span>{t('lbl.caller')}:</span>{' '}
                <span className="font-medium">
                  {item.isCustomerApp ? orders.activeOrder!.representativeName || <LazyLoadUsername /> : t('lbl.staff')}
                </span>
              </Text>
            </div>
            {item.dishOrders?.map((dish) => (
              <Fragment key={dish.dishId}>
                <hr className="border-divider border-t-0 my-3"></hr>
                <div className="flex space-x-3">
                  <div className="flex flex-col space-y-2 items-center">
                    <img src={dish.images?.[0] ?? dummyDish} className="w-10 h-10 rounded-lg" />
                    <Text>x{dish.quantity}</Text>
                  </div>
                  <div className="flex flex-col space-y-1 flex-1 items-start">
                    <Text>{dish.dishName}</Text>
                    {dish.toppingDisplayText && (
                      <Text className="text-inactive whitespace-pre-wrap">{dish.toppingDisplayText}</Text>
                    )}
                    {dish.attachedDishDisplayText && (
                      <Text className="text-inactive">{dish.attachedDishDisplayText}</Text>
                    )}
                    <div className="flex space-x-1 items-center">
                      <div
                        className={`w-[10px] h-[10px] rounded-full ${dish.status ? 'bg-[#32A458]' : 'bg-primary'}`}
                      ></div>
                      <Text className="text-inactive">{dish.status}</Text>
                    </div>
                    <OrderMoreDialog dish={{ ...dish, id: dish.dishId, name: dish.dishName }} mMenuDishOrder={dish}>
                      {({ open }) => (
                        <SolidButton xSmall onClick={open}>
                          {t('btn.order-more')}
                        </SolidButton>
                      )}
                    </OrderMoreDialog>
                  </div>
                  <Text className="text-inactive">{formatMoney(dish.price)}</Text>
                </div>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
      <div className="p-4 bg-white space-y-4 border-0 border-t-[0.5px] border-solid border-black/10">
        <div className="space-y-2">
          <div className="flex space-x-4 justify-between">
            <Text className="text-inactive">{t('lbl.how-many-dish-ordered')}</Text>
            <Text className="text-inactive">
              {t('lbl.dish-count', {
                count:
                  orders.activeOrder?.orderDetails?.reduce(
                    (count, order) =>
                      count + (order.dishOrders?.reduce((count, dish) => count + dish.quantity, 0) ?? 0),
                    0,
                  ) ?? 0,
              })}
            </Text>
          </div>
          <div className="flex space-x-4 justify-between">
            <Text size="large" className="font-medium">
              {t('lbl.total')}
            </Text>
            <Text size="large" className="font-medium text-primary">
              {formatMoney(orders.activeOrder?.pretaxPaymentAmount ?? 0)}
            </Text>
          </div>
          <Text size="small" className="text-inactive">
            {t('lbl.taxes-and-fees')}
          </Text>
        </div>
        <Button
          fullWidth
          variant="primary"
          onClick={requestPayment}
          disabled={!orders.activeOrder?.orderDetails?.length}
        >
          {t('btn.request-checkout')}
        </Button>
      </div>
    </>
  )
}
