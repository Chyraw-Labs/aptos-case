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
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
      radial-gradient(circle, rgba(255, 255, 255, 0.15) 2px, transparent 2px),
      radial-gradient(circle, rgba(255, 255, 255, 0.15) 2px, transparent 2px)
    `,
          backgroundSize: '20px 20px', // 控制间距
          backgroundPosition: '0 0, 10px 10px', // 调整交错排列
        }}
      />

      {/* <Playground /> */}

      {/* <BackgroundSVG
        svgPath="/assets/logo-outline.svg"
        svgSize={{ width: 128, height: 128 }}
        scrollDirection="right"
        backgroundColor="#000"
        scrollSpeed={0.3}
      /> */}
      <div className="bg-black bg-opacity-30 backdrop-blur-md block w-full h-full absolute top-0 left-0 -z-10"></div>

      <div className="flex flex-col gap-8 my-20">
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
