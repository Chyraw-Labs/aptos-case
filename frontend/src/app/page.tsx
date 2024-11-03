'use client'
import { DOCSBASE } from '@/code-case/docsbase'
import AutoHidingHeader from '@/components/AutoHidingHeader'
// import { AllCase } from '@/components/AllCase'
// import { AllDailyMove } from '@/components/AllDailyMove'
// import { AllTrack } from '@/components/AllTrack'
import Database from '@/components/database/Database'
import Footer from '@/components/Footer'
// import GameInterface from '@/components/gamify/GameInterface'
import { ToGame } from '@/components/gamify/ToGame'
import { GettingStarted } from '@/components/GettingStarted'
// import Header from '@/components/Header'
import { MoveBook } from '@/components/MoveBook'
import { PopoverProvider } from '@/components/PopoverProvider'
import Safety from '@/components/safety/Safety'
// import { MoveBook } from '@/components/MoveBook'
import { Visualization } from '@/components/Visualization'
// import WavingFlagBackground from '@/components/WavingFlagBackground'
// import WavingFlagBackground from '@/components/WavingFlagBackground'
// import { Compositions, Strolling } from '@/static/illustrations'
import mermaid from 'mermaid'
import Image from 'next/image'
// import Script from 'next/script'
import { useEffect } from 'react'
// import { Tile} from '@/static/tile.js'
// import { Three } from '@/static/three.min.js'

export default function Home() {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      logLevel: 'debug',
    })
  }, [])

  return (
    <>
      <PopoverProvider>
        {/* <WavingFlagBackground /> */}
        <AutoHidingHeader />

        <div className="flex flex-col gap-32 mt-64 mb-8 relative z-20 justify-center items-center">
          {/* 快速开始 */}
          <div className="flex flex-col md:flex-row items-center  gap-4 max-w-6xl w-full">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/assets/Character_sprinting.png"
                alt="Strolling"
                width={700}
                height={700}
                className="max-w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <GettingStarted />
            </div>
          </div>
          {/* 可视化 */}
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl w-full">
            <div className="w-full md:w-1/2">
              <Visualization />
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/assets/Illustrations_coffee.png"
                alt="Strolling"
                width={700}
                height={700}
                className="max-w-full h-auto"
              />
            </div>
          </div>
          {/* 游戏 */}
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl w-full">
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/assets/character_dancing.png"
                alt="Strolling"
                width={700}
                height={700}
                className="max-w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <ToGame />
            </div>
          </div>
          {/* 安全 */}
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-6xl w-full">
            <div className="w-full md:w-1/2">
              <Safety />
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src="/assets/Character_petting.png"
                alt="Strolling"
                width={700}
                height={700}
                className="max-w-full h-auto scale-x-[-1]"
              />
            </div>
          </div>
          {/* <AllTrack /> */}
          {/* <AllCase /> */}
          {/* <AllDailyMove /> */}
          {/* <MoveBook /> */}
          {/* 这个组件的弹出没有页面跳转，需要更改 mt */}
          {/* <div className="mt-10"> */}
          <MoveBook />

          <Database initialData={DOCSBASE} />
          <Footer />
        </div>

        {/* <WalletButton /> */}
      </PopoverProvider>
    </>
  )
}
