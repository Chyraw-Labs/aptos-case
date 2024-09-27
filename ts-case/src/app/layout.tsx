import { WalletProvider } from '@/components/WalletProvider'
import '../globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <meta name="" content="ao" />
        </head>
        <body>
          <WalletProvider>{children}</WalletProvider>
        </body>
      </html>
    </>
  )
}
