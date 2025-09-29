import { useAtomValue } from 'jotai'
import React from 'react'
import { Text } from 'zmp-ui'

import { DishItem } from '@/components/dish-item'
import { MenuEmpty } from '@/components/menu-empty'
import { menuState } from '@/state'

export function MerchantMenuPageContent() {
  const { restaurantMenu: menu } = useAtomValue(menuState)

  return (
    <div className="bg-white flex min-h-screen">
      <div className="flex-none basis-[90px]">{/* Sticky sidebar space */}</div>
      {menu.dishesMenu.length === 0 ? (
        <MenuEmpty />
      ) : (
        <div className="bg-ng-10 py-3 flex-1 pb-[68px]">
          <div className="pl-3 pr-[10px] flex flex-col gap-4">
            {menu.dishesMenu.map((menuItem) => (
              <div
                key={menuItem.dishCategory.dishCategoryId}
                data-id={menuItem.dishCategory.dishCategoryId}
                className={`section-wrapper scroll-m-[calc(var(--zaui-safe-area-inset-top,0)+108px)]`}
                id={`section-wrapper-${menuItem.dishCategory.dishCategoryId}`}
              >
                <Text size="large" className="font-medium" id={`section-${menuItem.dishCategory.dishCategoryId}`}>
                  {menuItem.dishCategory.dishCategoryName}
                </Text>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {menuItem.dishes.map((product) => (
                    <DishItem key={product.id} dish={product} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
