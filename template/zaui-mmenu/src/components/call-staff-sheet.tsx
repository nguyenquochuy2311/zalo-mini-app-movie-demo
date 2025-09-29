import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, List, Radio, Text } from 'zmp-ui'

import { useCallStaff, usePaymentRequest } from '@/hooks'

import { CustomSheet } from './custom-sheet'
import { BellIcon, PingIcon } from './icons'
import { SolidButton } from './solid-button'

enum Purpose {
  Serve = 'opt.serve',
  Pay = 'opt.pay',
}

export default function CallStaff() {
  const { t } = useTranslation()
  const [selectedPurpose, setPurpose] = useState<Purpose>(Purpose.Serve)
  const callStaff = useCallStaff()
  const { requestPayment } = usePaymentRequest()

  return (
    <CustomSheet
      renderTrigger={({ open }) => (
        <div
          className="bg-white text-primary inline-flex items-center space-x-1 pr-2 pl-3 py-1 rounded-lg"
          onClick={open}
        >
          <Text size="normal" className="font-medium">
            {t('btn.call-staff')}
          </Text>{' '}
          <PingIcon />
        </div>
      )}
      renderActions={({ close }) => [
        <SolidButton key="cancel" onClick={close} className="flex-1">
          {t('btn.cancel')}
        </SolidButton>,
        <Button
          key="call"
          onClick={() => {
            if (selectedPurpose === Purpose.Serve) {
              callStaff()
            } else {
              requestPayment()
            }
            close()
          }}
          className="bg-primary flex-1"
        >
          {t('btn.call-staff')}
        </Button>,
      ]}
    >
      <div className="flex justify-center">
        <BellIcon />
      </div>
      <div className="space-y-[2px] p-4 ">
        <Text size="xLarge" className="font-medium">
          {t('btn.call-staff')}
        </Text>
        <Text size="small" className="text-inactive flex flex-col space-y-1.5">
          {t('lbl.call-staff-purpose')}
        </Text>
      </div>
      <hr className="border-divider !my-0 border-t-0 mx-4"></hr>
      <List divider noSpacing>
        {Object.values(Purpose).map((purpose) => (
          <List.Item
            key={purpose}
            prefix={<Radio value={purpose} checked={selectedPurpose === purpose} />}
            onClick={() => setPurpose(purpose)}
          >
            <Text size="large">{t(purpose)}</Text>
          </List.Item>
        ))}
      </List>
      <hr className="border-divider !my-0 border-t-0 mx-4"></hr>
    </CustomSheet>
  )
}
