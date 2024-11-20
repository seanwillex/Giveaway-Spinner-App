import type { AppProps } from 'next/app'
import { ClientProvider } from '@/components/client-provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClientProvider>
      <Component {...pageProps} />
    </ClientProvider>
  )
} 