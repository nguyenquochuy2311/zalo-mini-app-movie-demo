import React, { Suspense } from 'react'
import { Page } from 'zmp-ui'

import { MerchantMenuPageLoading } from '@/components/merchant-menu-page-loading'
import { MerchantTabs } from '@/components/merchant-tabs'
import { PageContainer } from '@/components/page-container'
import { useFloatingCartStatus } from '@/hooks'

import { OrderHistoryPageContent } from './content'

export default function OrderHistoryRootPage() {
  useFloatingCartStatus('hidden')

  return (
    <>
      <Page restoreScroll>
        <PageContainer withBottomNav className="h-full flex flex-col">
          <Suspense fallback={<MerchantMenuPageLoading />}>
            <OrderHistoryPageContent />
          </Suspense>
        </PageContainer>
      </Page>
      <MerchantTabs activeTab="history" />
    </>
  )
}
