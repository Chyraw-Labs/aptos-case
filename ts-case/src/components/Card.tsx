import React, { useState, useRef, useEffect } from 'react'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import {
  X,
  Maximize2,
  Minimize2,
  LayoutGrid,
  ArrowLeftRight,
} from 'lucide-react'
import styles from '@/styles/md.module.css'
import Editor, { OnMount, OnChange } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'

interface CardProps {
  mdPath: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  description?: string
  tag?: string
  children?: React.ReactNode
}

const Card: React.FC<CardProps> = ({
  mdPath,
  size = 'md',
  className,
  description,
  tag,
  children,
}) => {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [splitRatio, setSplitRatio] = useState(50)
  const [code, setCode] = useState('// Write your code here')
  const [output, setOutput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const splitPaneRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  const sizeClasses = {
    sm: 'w-64 h-40',
    md: 'w-80 h-48',
    lg: 'w-96 h-56',
  }

  const baseClasses = twMerge(
    'bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300',
    sizeClasses[size],
    className
  )

  const fetchMdxContent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      let response
      if (mdPath.startsWith('http')) {
        response = await fetch(mdPath)
      } else {
        const url = `/api/mdx?path=${encodeURIComponent(mdPath)}`
        response = await fetch(url)
      }

      if (!response.ok) {
        throw new Error('Failed to fetch MDX content')
      }

      const mdxText = await response.text()
      const mdxSource = await serialize(mdxText)
      setMdxSource(mdxSource)
    } catch (err) {
      console.error('Error fetching MDX:', err)
      setError('Failed to load MDX content')
    } finally {
      setIsLoading(false)
    }
  }

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
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      setCode(value)
    }
  }

  const handleRunCode = () => {
    // This is a placeholder. In a real application, you'd send the code to a backend for execution.
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

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <PopoverButton
            as="div"
            className={baseClasses}
            onClick={fetchMdxContent}
          >
            {mdPath && (
              <div className="h-1/2 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">overview</span>
              </div>
            )}
            <div className="p-4">
              {tag && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                  {tag}
                </span>
              )}
              {description && (
                <p className="text-gray-600 text-sm">{description}</p>
              )}
              {children}
            </div>
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
                    {isLoading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {mdxSource && (
                      <MDXRemote
                        {...mdxSource}
                        components={{
                          h1: (props) => (
                            <h1 className={styles.h1} {...props} />
                          ),
                          h2: (props) => (
                            <h2 className={styles.h2} {...props} />
                          ),
                          h3: (props) => (
                            <h3 className={styles.h3} {...props} />
                          ),
                          h4: (props) => (
                            <h4 className={styles.h4} {...props} />
                          ),
                          h5: (props) => (
                            <h5 className={styles.h5} {...props} />
                          ),
                          h6: (props) => (
                            <h6 className={styles.h6} {...props} />
                          ),
                          p: (props) => <p className={styles.p} {...props} />,
                          code: (props) => (
                            <code className={styles.code} {...props} />
                          ),
                          pre: (props) => (
                            <pre className={styles.pre} {...props} />
                          ),
                          blockquote: (props) => (
                            <blockquote
                              className={styles.blockquote}
                              {...props}
                            />
                          ),
                          ul: (props) => (
                            <ul className={styles.ul} {...props} />
                          ),
                          li: (props) => (
                            <li className={styles.li} {...props} />
                          ),
                          ol: (props) => (
                            <ol className={styles.ol} {...props} />
                          ),
                        }}
                      />
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
                      <h2 className="text-xl font-bold text-black">
                        Code Editor
                      </h2>
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
                      <Editor
                        height="100%"
                        defaultLanguage="rust"
                        defaultValue={code}
                        onMount={handleEditorDidMount}
                        onChange={handleEditorChange}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>
                  {/* Command Line */}
                  <div className="h-1/3 bg-black text-white flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-4">
                      <h2 className="text-xl font-bold">Command Line</h2>
                      <button
                        onClick={handleRunCode}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Run
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

export default Card
