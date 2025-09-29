import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { authorize } from 'zmp-sdk'
import { Sheet, Text } from 'zmp-ui'
import { SheetProps } from 'zmp-ui/sheet'

import { authorizeScopeState } from '@/state'
import userInfo from '@/static/user-info.png'

import { SolidButton } from './solid-button'

export function RequestInformationSheet(props: Omit<SheetProps, 'children' | 'ref'> & { onConfirm?: () => void }) {
  const { t } = useTranslation()
  const scopes = useAtomValue(authorizeScopeState)
  const requireName = scopes.includes('scope.userInfo')
  const requirePhone = scopes.includes('scope.userPhonenumber')

  return (
    <Sheet autoHeight {...props}>
      <div className="space-y-6 flex flex-col items-center py-6">
        <img src={userInfo} className="h-[128px]" />
        <div className="text-center px-6 space-y-1">
          <Text size="large" className="font-medium">
            {t('lbl.request-info-title', {
              info: t(
                requireName && requirePhone ? 'lbl.name-and-phone-acronym' : requirePhone ? 'lbl.phone' : 'lbl.name',
              ),
            })}
          </Text>
          <Text>
            {t('lbl.request-info-description', {
              info: t(requireName && requirePhone ? 'lbl.name-and-phone' : requirePhone ? 'lbl.phone' : 'lbl.name'),
            })}
          </Text>
        </div>
        <div className="w-full px-4 pt-1">
          <SolidButton
            fullWidth
            onClick={async (e) => {
              try {
                await authorize({ scopes })
                props.onConfirm?.()
              } catch (error) {
                props.onClose?.(e)
              }
            }}
          >
            {t('btn.understood')}
          </SolidButton>
        </div>
      </div>
    </Sheet>
  )
}
