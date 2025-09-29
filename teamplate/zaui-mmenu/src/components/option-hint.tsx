import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Topping } from '@/@types/mmenu'

export const OptionHint: FC<{
  topping: Topping
}> = ({ topping }) => {
  const { t } = useTranslation()

  const requirement = t(topping.isRequired ? 'lbl.required' : 'lbl.not-required')

  return (
    <span className="first-letter:uppercase">
      {topping.hasQuantity
        ? requirement
        : `${topping.isMultipleSecleted ? t('lbl.pick-many') : t('lbl.pick-one')}, ${requirement}`}
    </span>
  )
}
