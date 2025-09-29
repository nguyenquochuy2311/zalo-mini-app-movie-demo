import { useAtomValue, useSetAtom } from 'jotai'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'zmp-ui'
import { ModalActions } from 'zmp-ui/modal'

import { Portal } from '@/components/portal'
import { globalConfirmState } from '@/state'

export interface ConfirmDialogProps {
  title: ReactNode
  message: ReactNode
  onConfirm: () => void
  visible: boolean
  onClose: () => void
  cancelButtonProps?: Partial<ModalActions>
  okButtonProps?: Partial<ModalActions>
}

export function ConfirmDialog(props: ConfirmDialogProps) {
  const { t } = useTranslation()
  return (
    <Portal>
      <Modal
        visible={props.visible}
        onClose={props.onClose}
        className="text-center"
        unmountOnClose
        actions={[
          {
            text: t('btn.close'),
            close: true,
            ...props.cancelButtonProps,
          },
          {
            text: t('btn.agree'),
            highLight: true,
            ...props.okButtonProps,
            close: false,
            onClick: props.onConfirm,
          },
        ]}
        title={props.title as string}
      >
        {props.message}
      </Modal>
    </Portal>
  )
}

export function GlobalConfirmDialog() {
  const props = useAtomValue(globalConfirmState)
  return <ConfirmDialog {...props} />
}

export function useConfirm() {
  const setConfirmProps = useSetAtom(globalConfirmState)
  const gracefullyClose = () => {
    setConfirmProps((oldProps) => ({ ...oldProps, visible: false }))
  }

  return (props: Omit<ConfirmDialogProps, 'visible' | 'onClose' | 'onConfirm'>) =>
    new Promise<boolean>((resolve) => {
      setConfirmProps({
        ...props,
        visible: true,
        onConfirm: () => {
          resolve(true)
          gracefullyClose()
        },
        onClose: () => {
          resolve(false)
          gracefullyClose()
        },
      })
    })
}
