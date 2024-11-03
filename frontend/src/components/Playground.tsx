// 独立页面
import React, { useState, useRef, useEffect } from 'react'
import {
  // X,
  Maximize2,
  Minimize2,
  LayoutGrid,
  ArrowLeftRight,
} from 'lucide-react'
import WalletButton from './WalletButton'
import Image from 'next/image'
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css'
import '@/styles/wallet.css'
import MoveEditorWrapper from './EditorWrapper'
import { HELLO } from '@/code-case/move'
import SearchKnowledge from './Search'
import { Explorer } from './Explorer'

const Playground: React.FC = () => {
  const [splitRatio, setSplitRatio] = useState(50)
  const [code] = useState('// Write your code here')
  const [output, setOutput] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  const splitPaneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      if (splitPaneRef.current) {
        const splitPaneRect = splitPaneRef.current.getBoundingClientRect()
        const newRatio =
          ((e.clientX - splitPaneRect.left) / splitPaneRect.width) * 100
        setSplitRatio(Math.max(20, Math.min(80, newRatio)))
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  // 运行
  const handleRunCode = () => {
    setOutput(`Executing code:\n\n${code}\n\nOutput would appear here.`)
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleLayoutChange = (preset: 'left' | 'center' | 'right') => {
    switch (preset) {
      case 'left':
        setSplitRatio(25)
        break
      case 'center':
        setSplitRatio(50)
        break
      case 'right':
        setSplitRatio(75)
        break
    }
  }
  const [activeComponent, setActiveComponent] = useState('SearchKnowledge')

  const renderComponent = () => {
    switch (activeComponent) {
      case 'SearchKnowledge':
        return <SearchKnowledge />
      case 'Explorer':
        return <Explorer />
      case 'Opretion':
        return <p>opretion</p>
      default:
        return <SearchKnowledge />
    }
  }

  return (
    <>
      <div className="flex h-screen w-screen">
        <div ref={splitPaneRef} className="flex-1 flex overflow-hidden">
          {/* Logo */}
          <div
            className="overflow-auto bg-opacity-10 backdrop-blur-sm block"
            style={{ width: `${splitRatio}%` }}
          >
            <div className="p-4">
              <a href="/" className="flex justify-center items-center">
                <Image
                  className="flex-shrink-0"
                  src="/assets/logo.svg"
                  alt="logo"
                  width={40}
                  height={40}
                />
                <h1 className="flex-none justify-start px-2 font-bold text-md">
                  Aptos Case
                </h1>
              </a>
              <div className="flex justify-between">
                <WalletButton />
              </div>
              <div className="flex flex-col items-center  mt-2">
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setActiveComponent('SearchKnowledge')}
                    className="px-2 py-1 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm text-sm font-medium hover:bg-opacity-0 hover:backdrop-blur-xl hover:border hover:border-gray-300"
                  >
                    知识库
                  </button>
                  <button
                    onClick={() => setActiveComponent('Explorer')}
                    className="px-2 py-1 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm text-sm font-medium hover:bg-opacity-0 hover:backdrop-blur-xl hover:border hover:border-gray-300"
                  >
                    浏览器
                  </button>
                  <button
                    onClick={() => setActiveComponent('Opretion')}
                    className="px-2 py-1 rounded-2xl bg-white bg-opacity-20 backdrop-blur-sm text-sm font-medium hover:bg-opacity-0 hover:backdrop-blur-xl hover:border hover:border-gray-300"
                  >
                    操作信息
                  </button>
                </div>

                <div className="mt-4 " style={{ width: `${splitRatio}%` }}>
                  {renderComponent()}
                </div>
              </div>

              {/* explorer.aptoslabs.com/ */}
            </div>
          </div>

          {/* Driver */}
          <div
            className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 relative flex-shrink-0"
            onMouseDown={handleDragStart}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-gray-400 rounded-full flex items-center justify-center z-50">
              <ArrowLeftRight size={16} className="text-white" />
            </div>
          </div>

          {/* Right pane */}
          <div
            className="flex flex-col bg-gray-100 overflow-hidden"
            style={{ width: `${100 - splitRatio}%` }}
          >
            {/* Code Editor */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-bold text-black">编辑器</h2>

                <div className="flex space-x-2 pr-16">
                  <button
                    onClick={() => handleLayoutChange('left')}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Maximize2 size={16} className="text-black" />
                  </button>
                  <button
                    onClick={() => handleLayoutChange('center')}
                    className="p-1 rounded hover:bg-gray-200 text-black"
                  >
                    <LayoutGrid size={16} className="text-black" />
                  </button>
                  <button
                    onClick={() => handleLayoutChange('right')}
                    className="p-1 rounded hover:bg-gray-200"
                  >
                    <Minimize2 size={16} className="text-black" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div style={{ height: '100vh', width: '100%' }}>
                  <MoveEditorWrapper initialCode={HELLO} />
                </div>
              </div>
            </div>
            {/* Command Line */}
            <div className="h-1/3 bg-black text-white flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <h2 className="text-xl font-bold">命令行</h2>
                <button
                  onClick={handleRunCode}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  运行
                </button>
              </div>
              <pre className="flex-1 overflow-y-auto p-2 bg-gray-800 rounded m-4">
                {output}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Playground
