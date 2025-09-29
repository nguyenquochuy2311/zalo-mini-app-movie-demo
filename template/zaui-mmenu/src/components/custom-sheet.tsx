import React, { ReactNode, useState } from 'react'
import { Icon, Sheet, Text } from 'zmp-ui'

import { Portal } from '@/components/portal'

export interface RenderProps {
  open: () => void
  close: () => void
}

export interface CustomSheetProps {
  title?: ReactNode
  renderActions?: (apis: RenderProps) => ReactNode[]
  renderFooter?: () => ReactNode
  renderTrigger: (apis: RenderProps) => ReactNode
  closeIcon?: boolean
  bordered?: boolean
  className?: string
  contentClassName?: string
  children?: ReactNode | ((apis: RenderProps) => ReactNode)
  onOpen?: () => void
  onClose?: () => void
}

export function CustomSheet({
  title,
  renderFooter,
  renderActions,
  renderTrigger,
  children,
  closeIcon,
  bordered,
  className,
  contentClassName,
  onOpen,
  onClose,
}: CustomSheetProps) {
  const [opened, setOpen] = useState(false)
  const open = () => {
    onOpen?.()
    setOpen(true)
  }
  const close = () => {
    onClose?.()
    setOpen(false)
  }

  return (
    <>
      {renderTrigger({ open, close })}
      <Portal>
        <Sheet
          visible={opened}
          onClose={close}
          unmountOnClose
          autoHeight
          className={`[&_.zaui-sheet-content]:max-h-[80%] ${className ?? ''}`}
        >
          <div
            className={`relative flex justify-center py-2 px-4 ${bordered ? 'border-0 border-b-[0.5px] border-black/10 border-solid' : ''}`}
          >
            {closeIcon && (
              <div className="absolute px-3 py-2 left-1 top-0 cursor-pointer" onClick={() => setOpen(false)}>
                <Icon icon="zi-close" />
              </div>
            )}
            <Text size="xLarge" className={`font-medium text-center flex-1 ${closeIcon ? 'px-7' : ''}`}>
              {title}
            </Text>
          </div>
          <div className={`flex-1 overflow-y-auto ${contentClassName ?? ''}`}>
            {typeof children === 'function' ? children({ open, close }) : children}
          </div>
          {renderActions && (
            <div
              className={`flex flex-col ${bordered ? 'border-0 border-t-[0.5px] border-black/10 border-solid' : ''}`}
            >
              {renderFooter && renderFooter()}
              <div className="p-4 pt-3 w-full space-x-2 flex items-center">{renderActions({ open, close })}</div>
            </div>
          )}
        </Sheet>
      </Portal>
    </>
  )
}
