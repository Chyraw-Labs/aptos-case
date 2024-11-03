// import { AllCase } from '@/components/AllCase'
import BackgroundSVG from '@/components/BackgroundSVG'
import PythonPlayground from '@/components/PythonPlayground'

// import PythonPlayground from ''
// import { register } from '@/instrumentation'
// import { useEffect } from 'react'
// import Card from '@/components/Card'
// import { GettingStarted } from '@/components/GettingStarted'
import Header from '@/components/Header'

// import WalletButton from '@/components/WalletButton'

export default function Home() {
  return (
    <>
      {' '}
      <div className="flex flex-col h-screen w-screen">
        <Header />
        <BackgroundSVG
          svgPath="/assets/logo-outline.svg"
          svgSize={{ width: 128, height: 128 }}
          scrollDirection="right"
          backgroundColor="#000"
          scrollSpeed={0.3}
        />{' '}
        <div className="flex-grow overflow-auto">
          {/* 添加 overflow-auto 以处理溢出 */}
          <PythonPlayground />
        </div>
      </div>
    </>
  )
}
