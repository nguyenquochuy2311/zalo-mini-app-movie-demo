import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Text } from 'zmp-ui'

import { Dish, SelectedToppings } from '@/@types/generic'
import { DishOrder } from '@/@types/mmenu'
import { Portal } from '@/components/portal'
import { useReorderRequest } from '@/hooks'
import { formatMoney } from '@/utils/format'

import { ElasticTextarea } from './elastic-textarea'
import { QuantityInput } from './quantity-input'
import { SolidButton } from './solid-button'

export interface OrderMoreDialogProps {
  dish: Dish
  mMenuDishOrder: DishOrder
  children: (renderProps: { open: () => void }) => React.ReactNode
  options?: SelectedToppings
  note?: string
}

export function OrderMoreDialog(props: OrderMoreDialogProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = React.useState(false)
  const [note, setNote] = useState('')
  const [quantity, setQuantity] = React.useState(1)
  const { requestReorder: reorderRequest } = useReorderRequest()

  return (
    <>
      {props.children({ open: () => setVisible(true) })}
      <Portal>
        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          className="text-center [&_.zaui-modal-content-cover]:aspect-w-[325] [&_.zaui-modal-content-cover]:aspect-h-[130] [&_img]:object-cover [&_.zaui-modal-content-main]:p-[12px_16px_16px]"
          coverSrc={props.dish.images ? props.dish.images[0] : ''}
          unmountOnClose
          title={t('btn.order-more')}
        >
          <div className="bg-[#F7F7F8] border-[0.5px] border-solid border-black/10 rounded-lg px-3 py-2 flex justify-between items-center space-x-2 mb-3">
            <div className="space-y-1 text-left">
              <Text>{props.dish.name}</Text>
              <Text className="text-inactive whitespace-pre-wrap">{props.mMenuDishOrder.toppingDisplayText}</Text>
              <Text size="small" className="text-primary font-medium">
                {formatMoney(props.dish.price)}
              </Text>
            </div>
            <div className="bg-white rounded-full p-1">
              <QuantityInput value={quantity} onChange={setQuantity} />
            </div>
          </div>
          <ElasticTextarea
            label={t('lbl.note')}
            placeholder={t('pld.note')}
            maxLength={40}
            showCount
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="mt-6 space-y-3">
            <Button
              fullWidth
              onClick={async () => {
                reorderRequest({
                  dishDetailId: props.mMenuDishOrder.dishOrderId,
                  orderOrderId: props.mMenuDishOrder.orderDetailId,
                  quantity,
                  note,
                })
                setVisible(false)
              }}
            >
              {t('btn.order')}
            </Button>
            <SolidButton fullWidth className="text-black bg-white" onClick={() => setVisible(false)}>
              {t('btn.close')}
            </SolidButton>
          </div>
        </Modal>
      </Portal>
    </>
  )
}
