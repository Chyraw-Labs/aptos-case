'use client'
// import { AllCase } from '@/components/AllCase'
import BackgroundSVG from '@/components/BackgroundSVG'
// import Card from '@/components/Card'
// import { GettingStarted } from '@/components/GettingStarted'
// import Header from '@/components/Header'
import Playground from '@/components/Playground'
// import WalletButton from '@/components/WalletButton'

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <BackgroundSVG
        svgPath="/assets/logo-outline.svg"
        svgSize={{ width: 128, height: 128 }}
        scrollDirection="right"
        backgroundColor="#000"
        scrollSpeed={0.3}
      />
      <Playground />
    </>
  )
}
