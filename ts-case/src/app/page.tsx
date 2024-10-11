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
// import { Compositions, Strolling } from '@/static/illustrations'
import mermaid from 'mermaid'
import Image from 'next/image'
import { useEffect } from 'react'

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
        <AutoHidingHeader />
        {/* <div className="fixed top-0 left-0 w-full h-20 z-30">
          <Header />
        </div> */}
        {/* 背景 */}
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

        {/* <div className="bg-black bg-opacity-30 backdrop-blur-md block w-full h-full absolute top-0 left-0 -z-10"></div> */}

        <div className="flex flex-col gap-32 mt-64 mb-8 relative z-20 justify-center items-center">
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
          {/*  */}
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
          {/* </div> */}

          <Database initialData={DOCSBASE} />
          <Footer />
        </div>

        {/* <WalletButton /> */}
      </PopoverProvider>
    </>
  )
}
