import { useAtomValue } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Spinner, Text, useNavigate, useSnackbar } from 'zmp-ui'

import { IconDishBow } from '@/components/icons'
import { PageContainer } from '@/components/page-container'
import { RequestInformationSheet } from '@/components/request-information-sheet'
import { SolidButton } from '@/components/solid-button'
import { useCheckoutRequest, useFloatingCartStatus } from '@/hooks'
import { cartState } from '@/state'
import decor from '@/static/decor.webp'

export default function StatusPage() {
  useFloatingCartStatus('hidden')
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)
  const { requestCheckout } = useCheckoutRequest()
  const cart = useAtomValue(cartState)
  const { openSnackbar } = useSnackbar()

  const processCheckout = async () => {
    requestCheckout().finally(() => setLoading(false))
  }

  useEffect(() => {
    if (cart.shouldShowCustomerInformationFormPopup) {
      setPopupOpen(true)
    } else {
      processCheckout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageContainer
      style={{
        backgroundColor: 'linear-gradient(360deg, #FFFFFF 0%, #EBEDEF 100%)',
        backgroundImage: `url(${decor})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom',
      }}
      className="flex flex-col items-center justify-center h-screen px-[42.5px] text-center"
    >
      {popupOpen && (
        <RequestInformationSheet
          visible={popupOpen}
          onClose={() => {
            openSnackbar({
              text: t('vld.user-info-required'),
              type: 'error',
              duration: 5000,
            })
            navigate(-1)
          }}
          onConfirm={() => {
            processCheckout()
            setPopupOpen(false)
          }}
        />
      )}
      <div className="bg-white flex justify-center items-center rounded-full relative w-[122px] h-[122px]">
        <IconDishBow
          style={{
            opacity: loading ? 0.3 : 1,
          }}
        />
        {loading && (
          <div className="absolute inset-0 *:w-[122px] *:h-[122px] *:after:content-none">
            <Spinner />
          </div>
        )}
        <div
          className="p-[5.33px] bg-white absolute -top-[5.33px] -right-[5.33px] rounded-full"
          style={{
            opacity: loading ? 0 : 1,
          }}
        >
          <Icon className="text-primary " icon="zi-check-circle-solid" size={32} />
        </div>
      </div>

      <Text size="xLarge" className="font-medium mt-4">
        {t(loading ? 'lbl.processing-order' : 'lbl.order-success')}
      </Text>

      <Text size="normal" className="text-text-subtle mt-2">
        {t(loading ? 'lbl.please-wait' : 'lbl.order-success-desc')}
      </Text>

      <Button
        className="mt-4"
        fullWidth
        style={{
          opacity: !loading ? 1 : 0,
        }}
        onClick={() => navigate('/history', { replace: true })}
      >
        {t('btn.view-history')}
      </Button>
      <SolidButton
        className="mt-4 bg-white"
        style={{
          opacity: !loading ? 1 : 0,
        }}
        onClick={() => navigate('/', { replace: true })}
      >
        {t('btn.back-to-menu')}
      </SolidButton>
    </PageContainer>
  )
}
