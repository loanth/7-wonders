import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { TimerProvider } from "@/context/TimerContext"
import './globals.css'

export const metadata: Metadata = {
  title: '7 Wonders Escape',
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <TimerProvider>
          {children}
        </TimerProvider>
        <Analytics />
      </body>
    </html>
  )
}
