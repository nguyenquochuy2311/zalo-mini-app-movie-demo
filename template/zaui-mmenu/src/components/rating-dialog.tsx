import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Modal, Text } from 'zmp-ui'

import { Portal } from '@/components/portal'
import { useRatingRequest } from '@/hooks'

import { ElasticTextarea } from './elastic-textarea'

export interface RatingDialogProps {
  children: (renderProps: { open: () => void }) => React.ReactNode
}

export function RatingDialog(props: RatingDialogProps) {
  const { t } = useTranslation()
  const [visible, setVisible] = React.useState(true)
  const [star, setStar] = React.useState(0)
  const [feedback, setFeedback] = React.useState('')
  const { requestRating } = useRatingRequest()

  return (
    <>
      {props.children({ open: () => setVisible(true) })}
      <Portal>
        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
          unmountOnClose
          title={t('lbl.how-was-your-experience')}
          actions={[
            {
              text: t('btn.close'),
              close: true,
            },
            {
              text: t('btn.send'),
              close: false,
              disabled: star === 0,
              highLight: true,
              onClick: () => {
                setVisible(false)
                requestRating({
                  rating: star,
                  reviewText: feedback,
                })
              },
            },
          ]}
        >
          <div className="space-y-3">
            <Text className="text-center">{t('lbl.please-rate')}</Text>
            <div className="border-[0.5px] border-x-0 border-solid border-secondary py-3.5 flex">
              {[1, 2, 3, 4, 5].map((i) => {
                const selected = i <= star
                return (
                  <div key={i} className="flex-1 text-center" onClick={() => setStar(i)}>
                    <Icon
                      icon={selected ? 'zi-star-solid' : 'zi-star'}
                      className={`${selected ? 'text-[#E8BA02]' : ''}`}
                    />
                  </div>
                )
              })}
            </div>
            <div>
              <ElasticTextarea
                label={t('lbl.feedback')}
                placeholder={t('pld.feedback')}
                maxLength={40}
                showCount
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
        </Modal>
      </Portal>
    </>
  )
}
