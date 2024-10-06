/* eslint-disable @next/next/no-before-interactive-script-outside-document */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ChevronDownIcon,
  Link2Icon,
  PenBoxIcon,
  Repeat2,
  TrashIcon,
} from 'lucide-react'
import { RE_ENTRANCY_ATTACKS } from '@/code-case/python-example'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
})

declare global {
  interface Window {
    loadPyodide: (config?: { indexURL?: string }) => Promise<any>
  }
}

const PythonPlayground: React.FC = () => {
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [pyodide, setPyodide] = useState<any>(null)
  const [inputCode, setInputCode] = useState<string>(
    '# Enter your Python code here\nprint("Hello, World!")\n2 + 2'
  )
  const [layout, setLayout] = useState({ left: 20, middle: 60, right: 20 })
  const [isLoading, setIsLoading] = useState(true)
  const dragRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadPyodideEnv = async () => {
      if (typeof window !== 'undefined' && window.loadPyodide) {
        try {
          setIsLoading(true)
          const pyodideInstance = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
          })
          setPyodide(pyodideInstance)
          setIsLoading(false)
        } catch (err) {
          setError(
            `Error loading Pyodide: ${
              err instanceof Error ? err.message : String(err)
            }`
          )
          setIsLoading(false)
        }
      }
    }

    loadPyodideEnv()
  }, [])

  const runPython = async () => {
    if (!pyodide) return
    try {
      setIsLoading(true)
      setError(null)

      // Set up Python environment to capture stdout
      await pyodide.runPythonAsync(`
        import sys
        import io
        sys.stdout = io.StringIO()
      `)

      // Run user's Python code
      const result = await pyodide.runPythonAsync(inputCode)

      // Get captured stdout
      const stdout = await pyodide.runPythonAsync('sys.stdout.getvalue()')

      // Combine output
      let output = stdout
      if (result !== undefined) {
        output += '\nReturn value: ' + result
      }

      setResult(output.trim())
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`)
      setResult('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = (e: React.MouseEvent, index: number) => {
    const startX = e.clientX
    const startLeft = layout.left
    const startMiddle = layout.middle

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX
      if (index === 0) {
        setLayout({
          left: Math.max(
            10,
            Math.min(startLeft + (dx / window.innerWidth) * 100, 40)
          ),
          middle: startMiddle - (dx / window.innerWidth) * 100,
          right: layout.right,
        })
      } else {
        setLayout({
          left: layout.left,
          middle: Math.max(
            20,
            Math.min(startMiddle + (dx / window.innerWidth) * 100, 70)
          ),
          right:
            100 -
            layout.left -
            Math.max(
              20,
              Math.min(startMiddle + (dx / window.innerWidth) * 100, 70)
            ),
        })
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  const handleCopy = (pythonCode: string) => {
    navigator.clipboard
      .writeText(pythonCode)
      .then(() => {
        alert('已复制到剪贴板')
      })
      .catch((err) => {
        console.error('复制失败:', err)
      })
  }
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        strategy="beforeInteractive"
      />

      <div className="flex flex-col h-full bg-[#2b2b2b] text-[#a9b7c6]">
        <div className="bg-[#3c3f41] p-2 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Python Playground</h1>
          <button
            className="px-4 py-2 bg-[#4CAF50] text-white rounded hover:bg-[#45a049] focus:outline-none focus:ring-2 focus:ring-[#45a049] focus:ring-opacity-50"
            onClick={runPython}
            disabled={isLoading}
          >
            {isLoading ? 'Running...' : 'Run'}
          </button>
        </div>
        {/* 提示栏 */}
        <div className="flex flex-1 overflow-hidden">
          <div
            style={{ width: `${layout.left}%` }}
            className="bg-[#2b2b2b] p-4 overflow-auto"
          >
            <h2 className="text-lg font-bold mb-2 text-[#CC7832]">
              Instructions
            </h2>
            <p>
              在编辑器中输入您的代码，并点击 <code>运行</code>，以运行您的代码
            </p>
            {/* <p className="mt-2">Example:</p> */}
            <div className="text-right">
              <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                  示例代码
                  <ChevronDownIcon className="size-4 fill-white/60" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                      onClick={() => handleCopy(RE_ENTRANCY_ATTACKS)}
                    >
                      <Repeat2 className="size-4 fill-white/30" />
                      重入攻击
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <Link2Icon className="size-4 fill-white/30" />
                      权限漏洞
                    </button>
                  </MenuItem>
                  <div className="my-1 h-px bg-white/5" />
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <PenBoxIcon className="size-4 fill-white/30" />
                      溢出检查
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      条件竞争
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      Token 消耗
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      闪电贷
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      拒绝服务
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      外部调用
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      返回值
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                      <TrashIcon className="size-4 fill-white/30" />
                      条件竞争
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          <div
            ref={dragRef}
            className="w-1 bg-[#3c3f41] cursor-col-resize"
            onMouseDown={(e) => handleDrag(e, 0)}
          />
          {/* 编辑器 */}
          <div style={{ width: `${layout.middle}%` }} className="bg-[#2b2b2b]">
            <MonacoEditor
              className="overflow-auto"
              height="100%"
              language="python"
              theme="vs-dark"
              value={inputCode}
              onChange={(value) => setInputCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                folding: true,
              }}
            />
          </div>
          <div
            className="w-1 bg-[#3c3f41] cursor-col-resize"
            onMouseDown={(e) => handleDrag(e, 1)}
          />
          <div
            style={{ width: `${layout.right}%` }}
            className="bg-[#2b2b2b] flex flex-col"
          >
            {/* 输出栏 */}
            <div className="bg-[#3c3f41] p-2">
              <h2 className="text-lg font-bold text-[#CC7832]">输出</h2>
            </div>
            <div className="flex-grow overflow-auto p-4">
              {isLoading ? (
                <p>Running...</p>
              ) : error ? (
                <pre className="text-[#FF6B68]">{error}</pre>
              ) : (
                <pre className="whitespace-pre-wrap text-xs text-[#A9B7C6]">
                  {result}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PythonPlayground
