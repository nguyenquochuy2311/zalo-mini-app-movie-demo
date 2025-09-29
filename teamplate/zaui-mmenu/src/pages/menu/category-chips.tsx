import { useAtom, useSetAtom } from 'jotai'
import React, { useTransition } from 'react'
import { useTranslation } from 'react-i18next'

import ChipList from '@/components/chip-list'
import { DishTypes } from '@/constants/mmenu'
import { activeCategoryIdState, selectedDishTypeState } from '@/state'

export default function CategoryChips() {
  const { t } = useTranslation()
  const [selected, setSelected] = useAtom(selectedDishTypeState)
  const setSelectedCategory = useSetAtom(activeCategoryIdState)
  const [_, startTransition] = useTransition()

  return (
    <ChipList
      className="pt-4 bg-background"
      options={DishTypes.map((dishType) => ({
        value: dishType,
        label: t(`dishType.${dishType}`),
      }))}
      value={selected}
      onChange={(value) => {
        const page = document.querySelector('.zaui-page')
        if (page) {
          page.scrollTop = 0
        }
        startTransition(() => {
          setSelected(value as (typeof DishTypes)[number])
          setSelectedCategory('')
        })
      }}
    />
  )
}
