import React, { FC, useMemo } from 'react'

import { ToppingItem } from '@/@types/mmenu'
import { formatMoney } from '@/utils/format'

export const DisplayPriceChange: FC<{ option: ToppingItem }> = ({ option }) => {
  const changes = useMemo(() => option.price, [option])
  return (
    <>
      {changes > 0 && '+'}
      {formatMoney(changes)}
    </>
  )
}
