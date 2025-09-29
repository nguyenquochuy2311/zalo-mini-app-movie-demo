import { useAtom } from 'jotai'
import { forwardRef, HTMLProps, useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDebounceCallback } from 'usehooks-ts'

import { keywordState } from '@/state'

import { SearchIcon } from './icons'
import Spinner from './spinner'

export interface SearchProps extends HTMLProps<HTMLInputElement> {
  thin?: boolean
}

export const SearchBar = forwardRef<HTMLInputElement, SearchProps>(({ style, thin, ...props }, ref) => {
  const [value, setValue] = useState('')
  const [keyword, setKeyword] = useAtom(keywordState)
  const { t } = useTranslation()

  const setKeywordDebounce = useDebounceCallback(setKeyword, 1000)

  useEffect(() => {
    setKeywordDebounce(value)
  }, [setKeywordDebounce, value])

  useEffect(() => {
    setValue(keyword)
  }, [keyword])

  return (
    <div className="relative flex items-center duration-75" style={style}>
      <div className="absolute flex left-3 pointer-events-none">{keyword !== value ? <Spinner /> : <SearchIcon />}</div>
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="search"
        className={`w-full pl-12 pr-2 border-none ${thin ? 'py-[5px]' : 'py-3'} rounded-lg appearance-none focus:outline-none bg-gray-10 text-[16px] leading-[22px]`}
        placeholder={t('pld.search')}
        {...props}
      />
    </div>
  )
})
