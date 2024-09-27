'use client'
import BackgroundSVG from '@/components/BackgroundSVG'
import Card from '@/components/Card'
import Header from '@/components/Header'
// import WalletButton from '@/components/WalletButton'

export default function Home() {
  return (
    <>
      <Header />
      <BackgroundSVG
        svgPath="/assets/logo-outline.svg"
        svgSize={{ width: 128, height: 128 }}
        scrollDirection="right"
        backgroundColor="#000"
        scrollSpeed={0.3}
      />

      <Card
        mdPath="/Docs/test.mdx"
        size="md"
        description="Click to view detailed content"
        tag="Documentation"
      >
        <p>Additional custom content</p>
      </Card>

      {/* <WalletButton /> */}
    </>
  )
}
