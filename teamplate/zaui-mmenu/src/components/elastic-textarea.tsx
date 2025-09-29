import React, { FC, useEffect, useRef } from 'react'
import { Input } from 'zmp-ui'
import { TextAreaProps, TextAreaRef } from 'zmp-ui/input'

export interface ElasticTextareaProps extends TextAreaProps {}

export const ElasticTextarea: FC<ElasticTextareaProps> = ({ onChange, ...props }) => {
  const ref = useRef<TextAreaRef>(null)
  useEffect(() => {
    if (ref.current?.textarea) {
      adjustHeight(ref.current.textarea)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.minHeight = '0px'
    el.style.minHeight = `${el.scrollHeight + (props.showCount && el.value.length ? 22 : 0)}px`
  }

  return (
    <Input.TextArea
      {...props}
      className="[&_.zaui-input]:resize-none [&_.zaui-input]:h-auto"
      ref={ref}
      onChange={(e) => {
        if (onChange) {
          onChange(e)
        }
        adjustHeight(e.currentTarget)
      }}
      rows={1}
    />
  )
}
