import './i18n'
import './css/app.scss'
import 'intersection-observer'

import ResizeObserver from 'resize-observer-polyfill'

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver
}

import React, { Suspense } from 'react'
import { Route } from 'react-router-dom'
import { AnimationRoutes, App, ZMPRouter } from 'zmp-ui'

import { CartFloatingCounter } from './components/cart-floating-counter'
import { GlobalConfirmDialog } from './components/confirm-dialog'
import { RootProvider } from './components/root-provider'
import CheckoutPage from './pages/checkout'
import FoodDetailPage from './pages/detail/dish'
import OrderHistoryRootPage from './pages/history'
import MenuPage from './pages/menu'
import SearchPage from './pages/search'
import StatusPage from './pages/status'

const MMenuApp = () => {
  return (
    <App>
      <RootProvider>
        <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<MenuPage />} />
            <Route
              path="/dish/:id"
              element={
                <Suspense>
                  <FoodDetailPage />
                </Suspense>
              }
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/history" element={<OrderHistoryRootPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </AnimationRoutes>
          <CartFloatingCounter />
        </ZMPRouter>
      </RootProvider>
      <GlobalConfirmDialog />
    </App>
  )
}
export default MMenuApp
