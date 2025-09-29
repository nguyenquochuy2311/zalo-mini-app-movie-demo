import React, { Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { SnackbarProvider, Text } from 'zmp-ui'

import { MerchantMenuPageLoading } from '@/components/merchant-menu-page-loading'
import { Errors } from '@/constants/errors'

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<MerchantMenuPageLoading />}>
      <SnackbarProvider>
        <ErrorBoundary FallbackComponent={ErrorPage}>{children}</ErrorBoundary>
      </SnackbarProvider>
    </Suspense>
  )
}

function ErrorPage(props: FallbackProps) {
  let message = 'Đã xảy ra lỗi, vui lòng quay lại sau'
  if (props.error?.message === Errors.MERCHANT_NOT_FOUND) {
    message = 'Cửa hàng này không tồn tại'
  } else if (props.error?.message === Errors.ORDER_SESSION_EXPIRED) {
    message = 'Phiên đặt hàng không tồn tại hoặc đã hết hạn'
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <Text className="text-text-secondary text-center">{message}</Text>
    </div>
  )
}
