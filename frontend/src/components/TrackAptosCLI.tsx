/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Terminal,
  FileText,
  Folder,
} from 'lucide-react'
import { Dialog } from '@headlessui/react'
// import { useMoveEditor } from './MoveEditorProvider'
import { AptosCliEditorWrapper } from './EditorWrapper'
// import { useRouter } from 'next/router'

// 确保这些类型定义是正确的
interface Step {
  id: number
  title: string
  content: string
  answer: string
  fileStructure: FileStructure[]
}

interface Project {
  id: number
  name: string
  steps: Step[]
}

interface FileStructure {
  name: string
  type: 'file' | 'folder'
  children?: FileStructure[]
}
interface EditorRefType {
  setValue: (value: string) => void
}

interface FileStructure {
  name: string
  type: 'file' | 'folder'
  children?: FileStructure[]
}

interface FileStructureComponentProps {
  files: FileStructure[]
  level?: number
}

const FileStructureComponent: React.FC<FileStructureComponentProps> = ({
  files,
  level = 0,
}) => {
  return (
    <ul className={`pl-${level > 0 ? 4 : 0}`}>
      {files.map((item, index) => (
        <li key={index} className="mb-1">
          <div className="flex items-center">
            <div style={{ width: `${level * 16}px` }}></div>
            {item.type === 'folder' ? (
              <Folder className="w-4 h-4 mr-2 text-yellow-400 flex-shrink-0" />
            ) : (
              <FileText className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
            )}
            <span className="text-gray-300 truncate">{item.name}</span>
          </div>
          {item.children && (
            <FileStructureComponent files={item.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  )
}

const UniswapStyleAptosTutorial: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [code, setCode] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [fileStructure, setFileStructure] = useState<FileStructure[]>([])
  const [isStepCompleted, setIsStepCompleted] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  // const { exportCode } = useMoveEditor()
  const editorRef = useRef<EditorRefType>(null)
  const [editorKey, setEditorKey] = useState(0) // Add this line
  // const router = useRouter()

  const project: Project = {
    id: 1,
    name: 'Aptos CLI 实用教程',
    steps: [
      {
        id: 1,
        title: '初始化 Move 项目',
        content:
          '使用 aptos move init 命令来初始化一个新的 Move 项目。这将创建必要的项目结构和配置文件。',
        answer: 'aptos move init --name hi_aptos',
        fileStructure: [{ name: 'README.md', type: 'file' }],
      },
      {
        id: 2,
        title: '创建 Aptos 账户',
        content:
          '使用 aptos init 命令在测试网上创建一个新的 Aptos 账户。这将生成您的账户地址、公钥和私钥。',
        answer: 'aptos init --network testnet',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },

      {
        id: 3,
        title: '领取 Token',
        content:
          '使用 Aptos 水龙头为您的新账户充值一些测试代币。这些代币可用于支付交易费用和与智能合约交互。',
        answer: 'aptos account fund-with-faucet --account default',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          {
            name: '.aptos',
            type: 'folder',
            children: [{ name: 'config.yaml', type: 'file' }],
          },
        ],
      },
      {
        id: 4,
        title: ' 在 Aptos 区块链下将 Move 包中的模块作为对象发布',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 5,
        title: '计算一个包的覆盖率',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 6,
        title: '升级在对象下部署的 Move 包中的模块',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 7,
        title: '列出账户链上包和模块的信息',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 8,
        title: '将 Move 包中的模块发布到 Aptos 区块链',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 9,
        title: '运行视图函数',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 10,
        title: '格式化 Move 源代码',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
      {
        id: 11,
        title: '验证一个 Move 包',
        content: '敬请期待',
        answer: 'aptos',
        fileStructure: [
          { name: 'Move.toml', type: 'file' },
          { name: 'sources', type: 'folder', children: [] },
        ],
      },
    ],
  }

  useEffect(() => {
    setFileStructure(project.steps[currentStepIndex].fileStructure)
  }, [currentStepIndex])

  useEffect(() => {
    const isEqual = (inputValue: string, answer: string) => {
      const cleanInput = inputValue.replace(/\s+/g, '').trim()
      const cleanExpected = answer.replace(/\s+/g, '').trim()
      return cleanInput === cleanExpected
    }

    const checkCodeCompletion = () => {
      if (isEqual(code, project.steps[currentStepIndex].answer)) {
        setIsStepCompleted(true)
        setError('')
        if (!completedSteps.includes(currentStepIndex)) {
          setCompletedSteps((prev) => [...prev, currentStepIndex])
        }
      } else if (code.trim() !== '') {
        setIsStepCompleted(false)
        setError('请输入正确的命令')
      }
    }

    checkCodeCompletion()
  }, [code, currentStepIndex, project.steps, completedSteps])

  const handleConfirm = useCallback(() => {
    setCompleted(false)
    setCurrentStepIndex(0)
    setCode('')
    setIsStepCompleted(false)
    setCompletedSteps([])
    setEditorKey((prev) => prev + 1) // Add this line
    if (editorRef.current) {
      editorRef.current.setValue('$')
    }
  }, [])

  const handleSubmit = useCallback(() => {
    setIsSubmitDialogOpen(true)
  }, [])

  const handleReturn = () => {
    window.open('/')
  }

  const handleNextStep = useCallback(() => {
    if (currentStepIndex < project.steps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1)
      setCode('')
      setIsStepCompleted(false)
      setEditorKey((prev) => prev + 1) // Add this line
      if (editorRef.current) {
        editorRef.current.setValue('$')
      }
    } else {
      setCompleted(true)
    }
  }, [currentStepIndex, project.steps.length])

  const handleStepSelect = useCallback((index: number) => {
    setCurrentStepIndex(index)
    setCode('')
    setIsStepCompleted(false)
    setEditorKey((prev) => prev + 1) // Add this line
    if (editorRef.current) {
      editorRef.current.setValue('$')
    }
  }, [])

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
  }, [])

  if (completed) {
    return (
      <div className="flex h-full justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-4xl p-8 bg-gray-800 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">
            🎉 恭喜完成 Aptos CLI 实用教程!
          </h2>
          <div className="flex flex-col items-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-400 mb-6" />
            <h3 className="text-2xl mb-4 text-white">项目里程碑</h3>
            {project.steps.map((step) => (
              <div key={step.id} className="flex items-center mb-3 text-white">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <span className="text-lg">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6">
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
            >
              重新开始
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
            >
              提交项目
            </button>
            <button
              onClick={handleReturn}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
            >
              返回主页
            </button>
          </div>
        </div>

        <Dialog
          open={isSubmitDialogOpen}
          onClose={() => setIsSubmitDialogOpen(false)}
          className="fixed z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen">
            <div
              className="fixed inset-0 bg-black bg-opacity-30"
              aria-hidden="true"
            />
            <Dialog.Panel className="bg-white rounded-lg p-8 z-20 max-w-md w-full relative">
              <Dialog.Title className="text-2xl font-bold text-gray-900 mb-4">
                项目已提交
              </Dialog.Title>
              <p className="text-lg text-gray-600 mb-6">
                您的项目已成功提交。感谢您完成 Aptos CLI 高级教程！
              </p>
              <button
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                onClick={() => {
                  setIsSubmitDialogOpen(false)
                  handleConfirm()
                }}
              >
                返回主页
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-700 to-gray-900">
      {/* 左侧：案例列表 */}
      <div className="w-80 bg-gray-800 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">教程案例</h2>
        <ul>
          {project.steps.map((step, index) => (
            <li
              key={step.id}
              onClick={() => handleStepSelect(index)}
              className={`mb-4 p-4 rounded-lg flex items-center cursor-pointer transition-colors ${
                index === currentStepIndex
                  ? 'bg-blue-600'
                  : completedSteps.includes(index)
                  ? 'bg-green-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {completedSteps.includes(index) ? (
                <CheckCircle className="w-6 h-6 mr-3" />
              ) : (
                <span className="w-6 h-6 mr-3 flex items-center justify-center border border-white rounded-full">
                  {index + 1}
                </span>
              )}
              <span className="flex-1 text-md">{step.title}</span>
              {index === currentStepIndex && (
                <ChevronRight className="w-6 h-6" />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 中间：主要内容 */}
      <div className="flex-1 px-8 pt-8  overflow-auto">
        <h1 className="text-4xl font-bold mb-8">{project.name}</h1>
        <div className="mb-8 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 ">
            案例 {currentStepIndex + 1}: {project.steps[currentStepIndex].title}
          </h2>
          <p className="mb-6 text-xl text-gray-300 leading-relaxed">
            {project.steps[currentStepIndex].content}
          </p>
          <pre className="rounded-lg bg-opacity-10 bg-white text-green-500 p-6 mb-8 shadow-lg">
            {project.steps[currentStepIndex].answer}
          </pre>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h3 className="text-2xl font-semibold mb-4 flex items-center">
            <Terminal className="w-6 h-6 mr-3" />
            终端
          </h3>
          <div className="h-64 mb-4">
            <AptosCliEditorWrapper
              key={editorKey} // Add this line
              editorRef={editorRef}
              initialCode="$ "
              onCodeChange={handleCodeChange}
            />
          </div>
          {isStepCompleted ? (
            <div className="flex items-center justify-between bg-green-600 rounded-lg p-4">
              <span className="text-lg font-semibold flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                任务完成!
              </span>
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                下一步
              </button>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-300 bg-opacity-10 rounded-lg flex items-start">
              <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-lg text-white">{error}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* 右侧：文件结构 */}
      <div className="w-80 bg-gray-800 p-6 overflow-auto">
        <h2 className="text-2xl font-bold mb-6">项目文件</h2>
        <div className="bg-gray-700 rounded-lg p-4">
          <FileStructureComponent files={fileStructure} />
        </div>
      </div>
    </div>
  )
}

export default UniswapStyleAptosTutorial
