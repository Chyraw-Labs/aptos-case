import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { WalletProvider } from '@/components/WalletProvider'
import '../styles/globals.css'
import { MoveEditorProvider } from '@/components/MoveEditorProvider'
// import UserBehaviorAnalytics from '@/components/UserBehaviorAnalytics'
import dynamic from 'next/dynamic'

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
  title: 'Aptos Case',
  description:
    'Aptos Case 是一个专注于 Aptos 区块链上 Move 编程的教育平台。加入我们，探索教程、资源和社区讨论，提升你在构建去中心化应用方面的技能。',
}
const DynamicUserBehaviorAnalytics = dynamic(
  () => import('../components/UserBehaviorAnalytics'),
  { ssr: false }
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="zh">
        <head>
          <meta
            name="Aptos Case"
            content="Aptos Case 是一个专注于 Aptos 区块链上 Move 编程的教育平台，提供丰富的教程和资源，帮助开发者提升去中心化应用开发技能。"
          />
          <meta
            name="keywords"
            content="Aptos, Move, 编程教育, 区块链, 去中心化应用, 智能合约, DApp"
          />
          <meta name="author" content="Chyraw Labs" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="Aptos Case" />
          <meta
            property="og:description"
            content="Aptos Case 是一个专注于 Aptos 区块链上 Move 编程的教育平台，提供丰富的教程和资源，帮助开发者提升去中心化应用开发技能。"
          />
          <meta property="og:image" content="/path/to/image.jpg" />
          <meta property="og:url" content="https://yourwebsite.com" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Aptos Case" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Aptos Case" />
          <meta
            name="twitter:description"
            content="Aptos Case 是一个专注于 Aptos 区块链上 Move 编程的教育平台，提供丰富的教程和资源，帮助开发者提升去中心化应用开发技能。"
          />
          <meta name="twitter:image" content="/path/to/image.jpg" />
          <meta name="twitter:site" content="@yourtwitterhandle" />
          <meta name="twitter:creator" content="@yourtwitterhandle" />
          <link rel="canonical" href="https://yourwebsite.com" />
          <link rel="icon" href="/path/to/favicon.ico" />
          <link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />
          <link
            rel="stylesheet"
            href="https://path-to-your-external-stylesheet.css"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        >
          <DynamicUserBehaviorAnalytics />
          <MoveEditorProvider>
            <WalletProvider>{children}</WalletProvider>
          </MoveEditorProvider>
        </body>
      </html>
    </>
  )
}
