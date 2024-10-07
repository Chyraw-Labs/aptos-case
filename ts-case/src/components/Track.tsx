import React, { useState, useRef, useEffect } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
// import { MDXRemoteSerializeResult } from 'next-mdx-remote'
// import { MDXProvider } from '@mdx-js/react'
// import { serialize } from 'next-mdx-remote/serialize'
import {
  X,
  Maximize2,
  Minimize2,
  LayoutGrid,
  ArrowLeftRight,
  Loader,
} from 'lucide-react'
// import styles from '@/styles/md.module.css'
// import { OnMount, OnChange } from '@monaco-editor/react'
// import * as monaco from 'monaco-editor'
import MoveEditorWrapper from './EditorWrapper'
// import { HELLO } from '@/code-case/move'
// import { MoveEditorProvider } from './MoveEditorProvider'
import { useMoveEditor } from './MoveEditorProvider'
import DocsTable from './DocsTable'
import useCompileMove from '@/move-wasm/CompileMove'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { MoveWasm } from '@/move-wasm/MoveWasm'
import MarkdownRenderer from './MarkdownRenderer'
import Image from 'next/image'

interface TrackProps {
  mdPath: string
  codeCase?: string
  cover: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  description?: string
  tags?: string[]
  title: string
  children?: React.ReactNode
}

interface CompileMoveResult {
  response: string
  // 其他属性
}

const Track: React.FC<TrackProps> = ({
  mdPath,
  codeCase = `module case::move_code{
    // write move code here
  }`,
  cover,
  size = 'md',
  className,
  description,
  tags,
  title,
  children,
}) => {
  // const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
  //   null
  // )
  const [mdContent, setMdContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [splitRatio, setSplitRatio] = useState(50)
  const [code, setCode] = useState('// Write your code here')
  const [output, setOutput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const splitPaneRef = useRef<HTMLDivElement>(null)
  const { account } = useWallet()
  // const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const sizeClasses = {
    sm: 'w-32 h-72',
    md: 'w-66 h-120',
    lg: 'w-92 h-160',
  }

  const baseClasses = twMerge(
    'bg-white bg-opacity-80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300  transform transition-transform hover:scale-105 hover:bg-opacity-100',
    sizeClasses[size],
    className
  )

  const fetchMdContent = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const url = `/api/mdx?path=${encodeURIComponent(mdPath)}`
      const response = await fetch(url)
      // console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch Markdown content')
      }
      const content = await response.text()
      console.log(content)
      setMdContent(content)
      setIsLoading(false)
    } catch (err) {
      console.error('Error fetching Markdown:', err)
      setError('Failed to load Markdown content')
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  // TODO Code track
  const { exportCode } = useMoveEditor()
  const editorCode = exportCode()
  useEffect(() => {
    setCode(editorCode)
  }, [editorCode])
  // console.log(exportCode())
  useEffect(() => {
    setCode(codeCase)
  }, [codeCase])
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
  // const handleEditorDidMount: OnMount = (editor) => {
  //   editorRef.current = editor
  // }

  // const handleEditorChange: OnChange = (value) => {
  //   if (value !== undefined) {
  //     setCode(value)
  //   }
  // }
  const result = useCompileMove() as CompileMoveResult | null
  const handleRunCode = () => {
    console.log(result)
    if (!account?.address) {
      setOutput(
        `Address: 未找到\n\n请连接钱包后重试（您可能需要复制当前代码）\n\n[END]`
      )
      return
    }
    if (result) {
      console.log('address: ', account?.address, 'result: ', result.response)
      if (result.response) {
        setOutput(
          `Address: ${account?.address} \n\n编译失败\n\n${result.response}\n[END]`
        )
      } else {
        setOutput(`Address: ${account?.address} \n\n编译成功\n\n[END]`)
      }
    } else {
      setOutput(
        `Address: ${account?.address} \n\n请编辑代码后重新运行\n\n[END]`
      )
      console.log('Result is null or undefined')
    }
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

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton
            as="div"
            className={baseClasses}
            onClick={fetchMdContent}
          >
            {mdPath && (
              <div className="max-w-sm rounded-lg shadow-lg flex flex-col ">
                <div className="relative min-h-[280px]">
                  <Image
                    src={cover}
                    alt={title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                  />
                </div>
                <div className="flex-grow flex flex-col p-6 ">
                  <div className="mb-2">
                    {tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 mr-2 mb-2"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-bold text-xl mb-2 text-black">{title}</h2>
                  <p className="text-gray-700 text-base mb-4">{description}</p>
                  <a className="mt-auto">{children}</a>
                </div>
              </div>
            )}
            {/* <div className="p-4">
              {tag && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {tag}
                </span>
              )}
              {description && (
                <p className="text-gray-600 text-sm">{description}</p>
              )}
              {children}
            </div> */}
          </PopoverButton>

          {open && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
              aria-hidden="true"
            />
          )}

          <PopoverPanel className="fixed inset-0 z-50 overflow-hidden">
            <div className="flex h-screen w-screen">
              <div ref={splitPaneRef} className="flex-1 flex overflow-hidden">
                {/* Left pane */}
                <div
                  className="overflow-auto"
                  style={{ width: `${splitRatio}%` }}
                >
                  <div className="p-4">
                    {isLoading && (
                      <div className="flex flex-col justify-center items-center">
                        <Loader
                          className="animate-spin"
                          size={24}
                          color="#006eff"
                        />
                        <p>加载中...</p>
                      </div>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                    {mdContent && (
                      <div className="container mx-auto px-4 py-8">
                        <MarkdownRenderer content={mdContent} />
                      </div>
                      // <MDXRemote {...mdxSource} components={mdxStyleConfig} />
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 relative flex-shrink-0"
                  onMouseDown={handleDragStart}
                >
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-12 bg-gray-400 rounded-full flex items-center justify-center z-50">
                    {/* <LayoutGrid size={16} className="text-white" /> */}
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
                      <DocsTable />
                      {/* <p>{codeCase}</p> */}
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
                        <MoveEditorWrapper initialCode={code} />
                      </div>
                    </div>
                  </div>
                  {/* Command Line */}
                  <div className="h-1/3 bg-black text-white flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-4">
                      <h2 className="text-xl font-bold">输出</h2>
                      <MoveWasm />
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
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-4 right-4 p-2 rounded-full bg-red-300 shadow-md hover:bg-red-500"
              >
                <X size={16} />
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}

export default Track
