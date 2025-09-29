import React from 'react'

import { Chip } from './chip'

type Option<T extends React.Key> = {
  value: T
  label: React.ReactNode
}

type Props<T extends React.Key> = {
  options: Option<T>[]
  value?: T
  onChange?: (value: T, option: Option<T>) => void
  className?: string
}

export function ChipList<T extends React.Key>({ value, onChange, options, className }: Props<T>) {
  return (
    <div className={`flex space-x-2 px-2 py-3 overflow-x-auto snap-x snap-mandatory ${className ?? ''}`}>
      {options.map((option) => (
        <Chip
          key={option.value}
          variant={option.value === value ? 'primary' : 'filled'}
          onClick={() => {
            onChange?.(option.value, option)
          }}
          className="snap-center"
        >
          {option.label}
        </Chip>
      ))}
    </div>
  )
}

export default ChipList
