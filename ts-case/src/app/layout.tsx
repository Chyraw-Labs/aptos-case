import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { WalletProvider } from '@/components/WalletProvider'
import '../styles/globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',

  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Science',
  description: 'Science',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <meta name="sort-cat" content="cat" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
          <WalletProvider>{children}</WalletProvider>
        </body>
      </html>
    </>
  )
}
