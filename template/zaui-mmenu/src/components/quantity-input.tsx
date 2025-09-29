import React, { MouseEventHandler, useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { Button, Icon, Text } from 'zmp-ui'

import { IconMinus } from './icons'

export interface QuantityInputProps {
  max?: number
  min?: number
  value: number
  onChange: (value: number) => void
  debounce?: number
  onZero?: () => Promise<boolean>
  renderZero?: (renderProps: { onClick: MouseEventHandler<HTMLElement> }) => React.ReactNode
  styles?: {
    wrapper?: React.CSSProperties
    button?: React.CSSProperties
    text?: React.CSSProperties
  }
}

export function QuantityInput({
  max,
  min = 0,
  value,
  onChange,
  debounce,
  onZero,
  renderZero,
  styles,
}: QuantityInputProps) {
  const [localValue, setLocalValue] = useState(value)
  const onChangeDebounce = useDebounceCallback(onChange, debounce)
  const currentValue = debounce ? localValue : value

  useEffect(() => {
    if (!onChangeDebounce.isPending) {
      setLocalValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleMinus: MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation()
    if (currentValue > min) {
      const newValue = currentValue - 1
      if (onZero) {
        if (newValue === 0) {
          const confirmed = await onZero()
          if (!confirmed) {
            return
          }
        }
      }
      if (debounce) {
        setLocalValue(newValue)
        onChangeDebounce(newValue)
      } else {
        onChange(newValue)
      }
    }
  }

  const handlePlus: MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation()
    if (typeof max === 'undefined' || currentValue < max) {
      const newValue = currentValue + 1
      if (debounce) {
        setLocalValue(newValue)
        onChangeDebounce(newValue)
      } else {
        onChange(newValue)
      }
    }
  }

  if (currentValue === 0 && renderZero) {
    return renderZero({ onClick: handlePlus })
  }

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex items-center space-x-2" style={styles?.wrapper}>
      <Button
        style={{
          width: 28,
          height: 28,
          ...styles?.button,
        }}
        size="small"
        variant="secondary"
        type="neutral"
        icon={<IconMinus size={16} />}
        onClick={handleMinus}
      />
      <Text
        className={`text-center font-bold`}
        style={{ ...styles?.text, width: `${currentValue.toString().length}ch` }}
      >
        {currentValue}
      </Text>
      <Button
        style={{
          width: 28,
          height: 28,
          ...styles?.button,
        }}
        size="small"
        variant="secondary"
        type="neutral"
        icon={<Icon icon="zi-plus" size={16} />}
        onClick={handlePlus}
      />
    </div>
  )
}
