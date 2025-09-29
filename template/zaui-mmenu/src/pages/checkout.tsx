import { useAtomValue } from 'jotai'
import React, { Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Icon, useNavigate, useSnackbar } from 'zmp-ui'

import { DishOrder } from '@/@types/mmenu'
import { PageContainer } from '@/components/page-container'
import { RatingDialog } from '@/components/rating-dialog'
import { SolidButton } from '@/components/solid-button'
import Spinner from '@/components/spinner'
import { useFloatingCartStatus } from '@/hooks'
import { checkoutOrderDetailsState, checkoutResultState } from '@/state'
import { formatDecimal, formatMoney } from '@/utils/format'

export function CheckoutOrderDetails() {
  const orderSession = useAtomValue(checkoutOrderDetailsState)

  if (orderSession?.orderDetails) {
    return orderSession.orderDetails
      .reduce((items, section) => items.concat(section.dishOrder), [] as DishOrder[])
      .map((item) => (
        <div
          key={`${item.orderDetailId}-${item.dishId}`}
          className="flex gap-3 px-0.5 pt-2 pb-2 border-0 border-b-[0.5px] border-solid border-black/10 last:pb-0 last:border-b-0"
        >
          <div className="self-start text-base leading-5 text-stone-950">x{item.quantity}</div>
          <div className="flex flex-col flex-1 pb-2">
            <div className="flex gap-1.5">
              <div className="flex-1 text-base tracking-normal leading-5 text-zinc-800">{item.dishName}</div>
              <div className="text-sm tracking-normal leading-5 text-right text-neutral-500">
                {formatMoney(item.totalPrice)}
              </div>
            </div>
            {item.toppingDisplayText && (
              <div className="mt-1 text-base leading-5 text-ellipsis text-zinc-500 whitespace-pre-wrap">
                {item.toppingDisplayText}
              </div>
            )}
          </div>
        </div>
      ))
  }
}

export default function CheckoutPage() {
  useFloatingCartStatus('hidden')
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const result = useAtomValue(checkoutResultState)
  const orderSession = useAtomValue(checkoutOrderDetailsState)
  const navigate = useNavigate()

  const { openSnackbar } = useSnackbar()

  useEffect(() => {
    if (result) {
      openSnackbar({
        type: 'success',
        text: t('lbl.request-checkout-success'),
      })
    } else {
      navigate(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (result) {
    return (
      <PageContainer withHeader>
        <Header title="Mmenu" showBackIcon={false} className="no-divider bg-primary text-white" />
        <div className="flex flex-col items-center pt-8 mx-auto w-full max-w-[480px]">
          <div className="text-lg font-medium leading-6 text-center text-stone-950">
            {t('lbl.table')}: {result.tableText}
          </div>
          <div className="mt-4 text-lg font-medium leading-6 text-center text-stone-950 w-[275px]">
            {t('lbl.wait-for-payment')}
          </div>
          <div className="mt-2 text-base leading-5 text-center text-ellipsis text-zinc-500">
            {t('lbl.processing-request')}
          </div>
          <RatingDialog>
            {({ open }) => (
              <div
                onClick={open}
                className="flex flex-col justify-center px-6 py-3 mt-4 text-base font-medium leading-5 text-center bg-amber-400 rounded-[100px] text-stone-950"
              >
                <div className="flex gap-2 items-center">
                  <Icon icon="zi-star-solid" />
                  <div className="my-auto">{t('lbl.are-you-satisfied')}</div>
                </div>
              </div>
            )}
          </RatingDialog>
          <div className="flex flex-col self-stretch p-4 mt-7 w-full bg-white">
            <div className="flex gap-1.5 text-base tracking-normal leading-5">
              <div className="flex-1 text-zinc-800">
                {t('lbl.dish-count', { count: orderSession?.totalDishQuantityNumber })}
              </div>
              <div className="text-right text-neutral-700">{formatMoney(result.pretaxPaymentAmount)}</div>
            </div>
            <Suspense
              fallback={
                <div className="mt-1.5">
                  <SolidButton disabled xSmall className="px-3" onClick={() => setExpanded((e) => !e)}>
                    <span className="inline-flex items-center space-x-1">
                      <span>{t('btn.view-list')}</span> <Spinner className="w-4 h-4 p-1" />
                    </span>
                  </SolidButton>
                </div>
              }
            >
              <div className="mt-1.5">
                <SolidButton xSmall className="px-3" onClick={() => setExpanded((e) => !e)}>
                  <span className="inline-flex items-center space-x-1">
                    <span>{t('btn.view-list')}</span>{' '}
                    <Icon icon={expanded ? 'zi-chevron-up' : 'zi-chevron-down'} size={20} />
                  </span>
                </SolidButton>
              </div>
              {expanded && (
                <div className="mt-3">
                  <CheckoutOrderDetails />
                </div>
              )}
            </Suspense>
            <div className="shrink-0 mt-3 border border-t-0 border-dashed border-neutral-500" />
            <div className="flex gap-1 mt-5 text-base leading-5 text-neutral-700">
              <div className="flex-1 text-ellipsis">{t('lbl.card-id')}</div>
              <div className="flex-1 text-right text-ellipsis">{result.pointCardNumber}</div>
            </div>
            <div className="flex gap-1 mt-3 text-base leading-5 text-neutral-700">
              <div className="flex-1 text-ellipsis">{t('lbl.vat-tax')}</div>
              <div className="flex-1 text-right text-ellipsis">{formatMoney(result.taxPaymentAmount)}</div>
            </div>
            <div className="flex gap-1 mt-3 text-base leading-5 whitespace-nowrap text-neutral-700">
              <div className="flex-1 text-ellipsis">{t('lbl.tip')}</div>
              <div className="flex-1 text-right text-ellipsis">{formatMoney(result.tipAmount)}</div>
            </div>
            <div className="flex gap-1 mt-3 text-base leading-5 whitespace-nowrap text-neutral-700">
              <div className="flex-1 text-ellipsis">{t('lbl.point')}</div>
              <div className="flex-1 text-right text-ellipsis">
                {formatDecimal(result.pointEarn ?? result.pointEarnPercentageRate * result.paymentAmount)}
              </div>
            </div>
            <div className="flex gap-1 mt-3 text-base leading-5 text-neutral-700">
              <div className="flex-1 text-ellipsis">{t('lbl.payment-method')}</div>
              <div className="flex-1 text-right text-ellipsis">{result.paymentMethod}</div>
            </div>
            <div className="shrink-0 mt-5 border border-t-0 border-dashed border-neutral-500" />
            <div className="flex gap-1 mt-3 text-neutral-700">
              <div className="flex-1 my-auto text-base leading-5 text-ellipsis">{t('lbl.total')}</div>
              <div className="flex-1 text-xl font-medium tracking-normal leading-7 text-right text-ellipsis">
                {formatMoney(result.paymentAmount)}
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    )
  }
}
