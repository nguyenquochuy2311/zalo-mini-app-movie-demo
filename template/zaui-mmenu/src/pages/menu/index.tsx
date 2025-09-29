import { useAtom, useSetAtom } from 'jotai'
import React, { useRef } from 'react'
import { Header, Page, useNavigate } from 'zmp-ui'

import { HeaderAddons } from '@/components/header-addons'
import { MerchantTabs } from '@/components/merchant-tabs'
import { PageContainer } from '@/components/page-container'
import { SearchBar } from '@/components/searchbar'
import { SCROLL_TO_REVEAL_THRESHOLD } from '@/constants/common'
import { useFloatingCartStatus } from '@/hooks'
import { activeCategoryIdState, collapsedHeaderState } from '@/state'

import CategoryChips from './category-chips'
import CategorySidebar from './category-sidebar'
import { MerchantMenuPageContent } from './content'

export default function MenuPage() {
  const navigate = useNavigate()
  const [collapsedHeader, setCollapsedHeader] = useAtom(collapsedHeaderState)
  const deltaScrollRef = useRef(0)
  const lastScrollRef = useRef(0)
  useFloatingCartStatus('visible')

  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setCollapsedHeader(true)
    } else {
      setCollapsedHeader(false)
    }
  }

  const setActiveCategoryId = useSetAtom(activeCategoryIdState)

  return (
    <>
      <Page
        restoreScroll
        onScroll={(e) => {
          /**
           * If the page is scrolling due to other interactions, such as when the user clicks on the category sidebar, skip
           */
          if (window.scrollLock) return

          /**
           * Change selected category on scroll
           */
          const items = document.querySelectorAll(`.section-wrapper`)
          let middleId = ''
          const middle = window.innerHeight / 2
          items.forEach((item) => {
            const rect = item.getBoundingClientRect()
            if (rect.top < middle && rect.bottom > middle) {
              middleId = item.getAttribute('data-id') || ''
            }
          })
          if (middleId) {
            setActiveCategoryId(middleId)
          }

          /**
           * Collapse/expand header addons
           */
          const currentY = e.currentTarget.scrollTop
          const delta = currentY - lastScrollRef.current

          if (delta * deltaScrollRef.current > 0) {
            // same direction
            deltaScrollRef.current += delta
          } else {
            // reverse direction
            deltaScrollRef.current = delta
          }
          lastScrollRef.current = currentY

          if (deltaScrollRef.current > SCROLL_TO_REVEAL_THRESHOLD) {
            handleSwipe('up')
          } else if (deltaScrollRef.current < -SCROLL_TO_REVEAL_THRESHOLD) {
            handleSwipe('down')
          }
        }}
      >
        <PageContainer withBottomNav>
          <Header title="Mmenu" showBackIcon={false} className="no-divider bg-primary text-white" />
          <div
            className="fixed z-10 duration-200 border-0 border-b-[0.5px] border-solid border-black/10 w-full"
            style={{
              top:
                parseInt(getComputedStyle(document.body).getPropertyValue('--zaui-safe-area-inset-top')) +
                (collapsedHeader ? -96 : 0),
            }}
            ref={(el) => {
              if (el && el.parentElement) {
                el.parentElement.style.paddingTop = `calc(${collapsedHeader ? 96 : el.getBoundingClientRect().height}px + var(--zaui-safe-area-inset-top, 0px))`
              }
            }}
          >
            <HeaderAddons />
            <div className="p-3 pb-0 cursor-pointer bg-white" onClick={() => navigate('/search', { animate: false })}>
              <SearchBar thin style={{ pointerEvents: 'none' }} />
            </div>
            <CategoryChips />
            <CategorySidebar />
          </div>
          <MerchantMenuPageContent />
        </PageContainer>
      </Page>
      <MerchantTabs activeTab="menu" />
    </>
  )
}
