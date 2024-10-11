'use client'
import { DOCSBASE } from '@/code-case/docsbase'
// import { AllCase } from '@/components/AllCase'
// import { AllDailyMove } from '@/components/AllDailyMove'
// import { AllTrack } from '@/components/AllTrack'
import Database from '@/components/database/Database'
// import GameInterface from '@/components/gamify/GameInterface'
import { ToGame } from '@/components/gamify/ToGame'
import { GettingStarted } from '@/components/GettingStarted'
import Header from '@/components/Header'
// import { MoveBook } from '@/components/MoveBook'
import { Visualization } from '@/components/Visualization'
import mermaid from 'mermaid'
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
      <div className="fixed top-0 left-0 w-full h-20 z-50">
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

      <div className="bg-black bg-opacity-30 backdrop-blur-md block w-full h-full absolute top-0 left-0 -z-10"></div>

      <div className="flex flex-col gap-8 my-20 relative z-20">
        <GettingStarted />
        <Visualization />
        <ToGame />
        {/* <AllTrack /> */}
        {/* <AllCase /> */}
        {/* <AllDailyMove /> */}
        {/* <MoveBook /> */}

        <Database initialData={DOCSBASE} />
      </div>

      {/* <WalletButton /> */}
    </>
  )
}
