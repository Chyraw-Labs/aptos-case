import React, { useState, useEffect, Fragment } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import BackgroundSVG from './BackgroundSVG'
import Image from 'next/image'

import { Description, Field, Label, Textarea } from '@headlessui/react'
import FileStructureTree, { FileStructure } from './FileStructureTree'

interface Step {
  id: number
  title: string
  content: string
  expectedOutput: string
  fileStructure: FileStructure
}

interface Project {
  id: number
  name: string
  steps: Step[]
}

const ProjectTrack = () => {
  // const [files, setFiles] = useState<FileStructure>([{ root: ['README.md'] }])
  const [initialFiles, setInitialFiles] = useState<FileStructure>([
    { root: ['README.md'] },
  ])

  const initialFileContents: [string, string][] = [
    ['file1.txt', 'Content of file1'],
    ['file2.txt', 'Content of file2'],
    ['file3.txt', 'Content of file3'],
    ['file4.txt', 'Content of file4'],
  ]

  const [project] = useState<Project>({
    id: 1,
    name: '从零创建基础 NFT 项目',
    steps: [
      {
        id: 1,
        title: '1. 初始化 Move 项目',
        content: '打开您的系统命令行工具，输入 "aptos move init --name my_nft"',
        expectedOutput: 'aptos move init --name my_nft',
        fileStructure: [{ root: ['README.md'] }],
      },
      {
        id: 2,
        title: '2. 创建 Aptos 账户',
        content: "继续输入 'aptos init'",
        expectedOutput: 'aptos init',
        fileStructure: [{ root: ['Move.toml', { sources: [] }] }],
      },
      {
        id: 3,
        title: '3. 创建 Move 合约文件: nft.move',
        content: "这是第三步的内容，请输入 'mkdir sources/nft.move'",
        expectedOutput: 'mkdir sources/nft.move',
        fileStructure: [
          { root: ['Move.toml', { sources: [] }] },
          { '.aptos': ['config.yaml'] },
        ],
      },
      {
        id: 4,
        title: '4. 在 nft.move 中定义 NFT 模块',
        content: "请输入 'module case::nft{}'",
        expectedOutput: 'module case::nft{}',
        fileStructure: [
          { root: ['Move.toml', { sources: ['nft.move'] }] },
          { '.aptos': ['config.yaml'] },
        ],
      },
    ],
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  const progress = Math.round((currentStepIndex / project.steps.length) * 100)

  // 手动文件结构
  const handleUpdateFileStructre = (
    updatedFiles: FileStructure,
    selectedPath?: string[]
  ) => {
    console.log(updatedFiles)
    if (selectedPath) {
      console.log('[INFO](ProjectTrack.tsx) 选择的 item 路径是:', selectedPath)
      //
    }
  }
  // 输入框
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value)
    // setError('error')
    setError('请输入: ' + project.steps[currentStepIndex].expectedOutput)

    if (
      e.target.value.trim() === project.steps[currentStepIndex].expectedOutput
    ) {
      console.log('[INFO] ProjectTrack.tsx: 用户的输入与预期输出匹配')

      setError('')
      if (currentStepIndex < project.steps.length - 1) {
        setCurrentStepIndex((prevIndex) => prevIndex + 1)
        setUserInput('')
      } else {
        setCompleted(true)
      }
    }
  }

  // 确认
  const handleConfirm = () => {
    setCompleted(false)
    setCurrentStepIndex(0)
    setUserInput('')
  }

  // 提交
  const handleSubmit = () => {
    setIsSubmitDialogOpen(true)
  }

  useEffect(() => {
    localStorage.setItem(
      'projectProgress',
      JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
    )
    // changeFileStructure(step.fileStructure)
    setInitialFiles(project.steps[currentStepIndex].fileStructure)
  }, [currentStepIndex, project.id, project.steps])

  // function changeFileStructure(files: FileStructure) {
  //   console.log('changeFiles: ', files)
  //   setInitialFiles(files)
  // }

  // useEffect(() => {
  //   project.steps.forEach((step) => {
  //     // changeFileStructure(step.fileStructure)
  //     setInitialFiles(step.fileStructure)
  //   })
  // }, [project.steps[currentStepIndex].fileStructure]) // 只在 steps 变化时调用

  // 完成项目
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-4xl p-6 bg-black rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white flex justify-center items-center">
            恭喜完成项目!
          </h2>
          <div className="flex flex-col items-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl mb-2 text-white">项目里程碑</h3>
            {project.steps.map((step) => (
              <div key={step.id} className="flex items-center mb-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                <span>{step.title}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              确认
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              提交
            </button>
          </div>
        </div>

        <Transition appear show={isSubmitDialogOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsSubmitDialogOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    项目已提交
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      您的项目已成功提交。感谢您的完成！
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => {
                        setIsSubmitDialogOpen(false)
                        handleConfirm()
                      }}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    )
  }

  // 主页面
  return (
    <div className="flex h-screen bg-black">
      {/* 左侧：动态增加或删除文件夹 */}
      <div className="w-80 bg-black p-6 overflow-auto">
        {/* <h2 className="text-xl font-bold mb-4 text-white">当前项目状态</h2> */}
        {/* <FileStructureTree initialFiles={files} onUpdate={handleUpdate} /> */}
        <FileStructureTree
          initialFiles={initialFiles}
          initialFileContents={initialFileContents}
          onUpdate={handleUpdateFileStructre}
        />
      </div>
      {/* 中间 */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4 text-white">{project.name}</h1>
        {/* 进度条 */}
        <div className="w-full bg-gray-400 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-white">当前步骤： </h2>
          <h3 className="text-lg font-bold mb-2 text-white">
            {project.steps[currentStepIndex].title}
          </h3>

          <p className="mb-4 text-white">
            {project.steps[currentStepIndex].content}
          </p>
        </div>
        {/* 文本输入框 */}
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="在这里输入你的答案..."
          className="w-full h-40 p-2 mb-4 border border-gray-900 rounded-md text-black"
        />

        {error && (
          <div className="p-4 mb-4 bg-blue-100 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
              <p className="text-sm font-medium text-blue-800">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：步骤列表 */}
      <div className="w-64 bg-black p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-white">步骤预览</h2>
        <ul>
          {project.steps.map((step, index) => (
            <li
              key={step.id}
              className={`mb-2 p-2 rounded  ${
                index === currentStepIndex
                  ? 'bg-blue-500 text-white'
                  : index < currentStepIndex
                  ? 'bg-green-200 text-black'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {step.title}
              {index < currentStepIndex && (
                <CheckCircle2 className="inline w-4 h-4 ml-2 text-green-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectTrack
