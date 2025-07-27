'use client'

import { ReactNode } from 'react'
import { Provider as JotaiProvider } from 'jotai'

type ProvidersProps = {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  return <JotaiProvider>{children}</JotaiProvider>
}
