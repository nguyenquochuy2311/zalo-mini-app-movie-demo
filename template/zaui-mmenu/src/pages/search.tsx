import { useAtomValue } from 'jotai'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Header, List, Text } from 'zmp-ui'

import { Dish } from '@/@types/generic'
import { DishItem } from '@/components/dish-item'
import { Highlight } from '@/components/highlight'
import { PageContainer } from '@/components/page-container'
import { SearchBar } from '@/components/searchbar'
import { useFloatingCartStatus } from '@/hooks'
import { keywordState, searchResultState } from '@/state'
import { formatMoney } from '@/utils/format'

export function SearchResultItem({ dish }: { dish: Dish }) {
  useFloatingCartStatus('lower')
  const keyword = useAtomValue(keywordState)
  return (
    <DishItem
      dish={dish}
      customRender={({ viewDetail, controls }) => (
        <List.Item
          onClick={() => viewDetail()}
          className="flex [&_.zaui-list-item-right]:min-w-0 [&_.zaui-list-item-content]:min-w-0 *:items-center"
          prefix={
            dish.images && dish.images.length > 0 && <img className="w-10 h-10 rounded-lg" src={dish.images[0]} />
          }
          suffix={<div onClick={(e) => e.stopPropagation()}>{controls}</div>}
        >
          <div className="flex-1 flex flex-col space-y-1 items-start">
            <Text>{dish.name}</Text>
            {dish.description && (
              <Text size="small" className="text-inactive truncate w-full">
                <Highlight keywords={keyword} content={dish.description} />
              </Text>
            )}
            <Text size="small" className="text-primary font-medium">
              {formatMoney(dish.price)}
            </Text>
          </div>
        </List.Item>
      )}
    />
  )
}

export default function SearchPage() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const result = useAtomValue(searchResultState)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <PageContainer withHeader className="bg-white">
      <Header title={t('lbl.search')} className="no-divider bg-primary text-white" />
      <div className="p-3 pb-0">
        <SearchBar ref={inputRef} thin />
      </div>
      <List divider noSpacing>
        {result.length ? (
          result.map((dish) => <SearchResultItem dish={dish} />)
        ) : (
          <Text className="p-3 text-center text-inactive">{t('lbl.no-result')}</Text>
        )}
      </List>
    </PageContainer>
  )
}
