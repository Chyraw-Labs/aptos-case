'use client'
// import { HELLO } from '@/code-case/move'
import { AllCase } from '@/components/AllCase'
import BackgroundSVG from '@/components/BackgroundSVG'
// import Case from '@/components/Case'
import { GettingStarted } from '@/components/GettingStarted'
import Header from '@/components/Header'
// import Playground from '@/components/Playground'
// import WalletButton from '@/components/WalletButton'

export default function Home() {
  return (
    <>
      <Header />
      {/* <Playground /> */}
      <BackgroundSVG
        svgPath="/assets/logo-outline.svg"
        svgSize={{ width: 128, height: 128 }}
        scrollDirection="right"
        backgroundColor="#000"
        scrollSpeed={0.3}
      />
      <GettingStarted />

      <AllCase />

      {/* <WalletButton /> */}
    </>
  )
}
