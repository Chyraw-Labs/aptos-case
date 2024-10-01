'use client'
// import { HELLO } from '@/code-case/move'
import { AllCase } from '@/components/AllCase'
import { AllDailyMove } from '@/components/AllDailyMove'
import { AllTrack } from '@/components/AllTrack'
import BackgroundSVG from '@/components/BackgroundSVG'
// import Case from '@/components/Case'
import { GettingStarted } from '@/components/GettingStarted'
import Header from '@/components/Header'
import { MoveBook } from '@/components/MoveBook'
// import Playground from '@/components/Playground'
// import WalletButton from '@/components/WalletButton'

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-20 z-10">
        <Header />
      </div>
      {/* <Playground /> */}
      {/* <BackgroundSVG
        svgPath="/assets/logo-outline.svg"
        svgSize={{ width: 128, height: 128 }}
        scrollDirection="right"
        backgroundColor="#000"
        scrollSpeed={0.3}
      /> */}
      <div className="my-20">
        <GettingStarted />
        <AllTrack />
        <AllCase />
        <AllDailyMove />
        <MoveBook />
      </div>

      {/* <WalletButton /> */}
    </>
  )
}
