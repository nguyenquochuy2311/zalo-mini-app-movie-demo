import React from 'react'
import { Button } from 'zmp-ui'
import { ButtonProps } from 'zmp-ui/button'

export function SolidButton({ className, xSmall, ...props }: ButtonProps & { xSmall?: boolean }) {
  return (
    <Button
      className={`${className} bg-secondary text-secondary-foreground active:bg-secondary active:opacity-80 ${props.disabled ? 'opacity-80 !text-secondary-foreground' : ''} ${xSmall ? 'min-w-0 h-auto px-2 py-[3px] text-[14px] font-normal text-[#3D3D3D]' : ''}`}
      {...props}
    />
  )
}
