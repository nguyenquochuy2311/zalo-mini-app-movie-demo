import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import React, { useRef } from 'react'
import { Text } from 'zmp-ui'

import { activeCategoryIdState, collapsedHeaderState, countItemsInCartByCategoryStateSync, menuState } from '@/state'

export default function CategorySidebar() {
  const menus = useAtomValue(menuState)
  const [activeId, setActiveId] = useAtom(activeCategoryIdState)
  const counts = useAtomValue(countItemsInCartByCategoryStateSync)
  const setCollapsedHeader = useSetAtom(collapsedHeaderState)
  const timerRef = useRef(0)

  return (
    <div
      className="w-[90px] pb-[68px] h-[calc(100vh-140px-var(--zaui-safe-area-inset-top,0))] absolute overflow-y-scroll hide-scrollbar py-2.5 space-y-3 bg-white border-0 border-t-[0.5px] border-r-[0.5px] border-solid border-black/10"
      style={{
        overscrollBehaviorY: 'contain', // fix the issue when scrolling the sidebar actually scrolls the whole page
      }}
    >
      {menus.restaurantMenu.dishesMenu.map((category, i) => (
        <div
          key={category.dishCategory.dishCategoryId}
          className={`relative border-0 border-l-4 border-solid pl-2 pr-[7.5px] py-1.5 ${(activeId === '' ? i === 0 : activeId === category.dishCategory.dishCategoryId) ? 'border-primary bg-[#F2573033]' : 'border-transparent'}`}
          onClick={() => {
            setActiveId(category.dishCategory.dishCategoryId)
            /**
             * Scroll to section when category is changed
             */
            const section = document.querySelector(`[data-id="${CSS.escape(category.dishCategory.dishCategoryId)}"]`)
            if (section) {
              if (section) {
                setCollapsedHeader(true)
                // This setTimeout is NECESSARY for the section to be scrolled into view where we want it
                setTimeout(() => {
                  window.scrollLock = true
                  section.scrollIntoView({
                    behavior: 'smooth',
                  })
                  // This clearTimeout is NECESSARY to prevent glitches when user switches between categories too fast
                  window.clearTimeout(timerRef.current)
                  timerRef.current = window.setTimeout(() => {
                    window.scrollLock = false
                  }, 1500)
                }, 0)
              }
            }
          }}
        >
          <Text size="small" className="line-clamp-2">
            {category.dishCategory.dishCategoryName}
          </Text>
          {counts[category.dishCategory.dishCategoryId] > 0 && (
            <div className="bg-white rounded-full p-[2px] absolute top-0.5 right-0.5 z-50">
              <div className="bg-primary rounded-full w-4 h-4 flex justify-center items-center text-white text-[10px] font-medium">
                {counts[category.dishCategory.dishCategoryId]}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
