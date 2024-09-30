import React, { useState, useEffect, Fragment } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import BackgroundSVG from './BackgroundSVG'
import Image from 'next/image'

import { Description, Field, Label, Textarea } from '@headlessui/react'

interface Step {
  id: number
  title: string
  content: string
  expectedOutput: string
}

interface Project {
  id: number
  name: string
  steps: Step[]
}

const ProjectTrack = () => {
  const [project, setProject] = useState<Project>({
    id: 1,
    name: '示例项目',
    steps: [
      {
        id: 1,
        title: '步骤 1',
        content: "这是第一步的内容，请输入 'aptos'",
        expectedOutput: 'aptos',
      },
      {
        id: 2,
        title: '步骤 2',
        content: "这是第二步的内容，请输入 'move'",
        expectedOutput: 'move',
      },
      {
        id: 3,
        title: '步骤 3',
        content: "这是第三步的内容，请输入 'test'",
        expectedOutput: 'test',
      },
    ],
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  const progress = Math.round((currentStepIndex / project.steps.length) * 100)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value)
    setError('error')

    if (
      e.target.value.trim() === project.steps[currentStepIndex].expectedOutput
    ) {
      if (currentStepIndex < project.steps.length - 1) {
        setCurrentStepIndex((prevIndex) => prevIndex + 1)
        setUserInput('')
      } else {
        setCompleted(true)
      }
    }
  }

  const handleConfirm = () => {
    setCompleted(false)
    setCurrentStepIndex(0)
    setUserInput('')
  }

  const handleSubmit = () => {
    setIsSubmitDialogOpen(true)
  }

  useEffect(() => {
    localStorage.setItem(
      'projectProgress',
      JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
    )
  }, [currentStepIndex, project.id])

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

  // 返回页面
  return (
    <div className="flex h-screen bg-black">
      {/* 左侧：项目内容和用户输入 */}
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
          <h2 className="text-xl font-bold mb-2 text-white">
            当前步骤：{project.steps[currentStepIndex].title}
          </h2>
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
        {/* <textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="在这里输入你的答案..."
          className="w-full h-40 p-2 mb-4 border border-gray-900 rounded-md text-black"
        /> */}
        {error && (
          <div className="p-4 mb-4 bg-red-100 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：步骤列表 */}
      <div className="w-64 bg-black p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-white">项目步骤</h2>
        <ul>
          {project.steps.map((step, index) => (
            <li
              key={step.id}
              className={`mb-2 p-2 rounded text-white ${
                index === currentStepIndex
                  ? 'bg-blue-500 text-white'
                  : index < currentStepIndex
                  ? 'bg-green-200'
                  : 'bg-gray-300'
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