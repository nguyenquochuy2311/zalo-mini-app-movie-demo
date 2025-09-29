import { useAtomValue } from 'jotai'
import { Suspense } from 'react'
import React from 'react'

import { userNameState } from '@/state'

export function Username() {
  const name = useAtomValue(userNameState)
  return name
}

export default function LazyLoadUsername() {
  return (
    <Suspense fallback="...">
      <Username />
    </Suspense>
  )
}
