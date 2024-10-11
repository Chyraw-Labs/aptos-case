/* eslint-disable @typescript-eslint/ban-ts-comment */
{
  // import React, { useReducer, useEffect } from 'react'
  // import {
  //   AlertCircle,
  //   CheckCircle2,
  //   FileText,
  //   Folder,
  //   Code,
  //   Menu,
  //   Info,
  //   Lightbulb,
  //   FileQuestion,
  //   MessageCircle,
  //   BookOpen,
  //   RotateCcw,
  //   Send,
  //   ArrowLeft,
  // } from 'lucide-react'
  // import { Dialog, Transition } from '@headlessui/react'
  // import FileStructureTree, {
  //   FileStructure,
  // } from '@/components/track_nft/FileStructureTree'
  // import MoveEditorWrapper from '@/components/EditorWrapper'
  // import StepPreview from '@/components/track_nft/StepPreview'
  // import EnhancedErrorFeedback from '@/components/track_nft/EnhancedErrorFeedback'
  // import CollapsiblePanel from '@/components/track_nft/CollapsiblePanel'
  // import { useMoveEditor } from '@/components/MoveEditorProvider'
  // import { isEqual } from 'lodash'
  // const ContentCard = ({ title, content, icon }) => (
  //   <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
  //     <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-300">
  //       {icon}
  //       {title}
  //     </h3>
  //     <div className="text-gray-300">{content}</div>
  //   </div>
  // )
  // function isInputCorrect(input: string, answer: string): boolean {
  //   // Remove whitespace and make comparison case-insensitive
  //   const cleanInput = input.replace(/\s+/g, '').toLowerCase()
  //   const cleanAnswer = answer.replace(/\s+/g, '').toLowerCase()
  //   // Use lodash's isEqual for a deep comparison
  //   return isEqual(cleanInput, cleanAnswer)
  // }
  // // Function to generate error feedback
  // function generateErrorFeedback(input: string, answer: string): string {
  //   if (!input.trim()) {
  //     return 'Please enter your answer before submitting.'
  //   }
  //   const inputLines = input.trim().split('\n')
  //   const answerLines = answer.trim().split('\n')
  //   if (inputLines.length !== answerLines.length) {
  //     return `Your answer has ${inputLines.length} line(s), but it should have ${answerLines.length} line(s).`
  //   }
  //   for (let i = 0; i < answerLines.length; i++) {
  //     if (!isInputCorrect(inputLines[i], answerLines[i])) {
  //       return `Line ${
  //         i + 1
  //       } is incorrect. Please check your answer and try again.`
  //     }
  //   }
  //   return 'Your answer is close, but not quite correct. Please review and try again.'
  // }
  // interface Step {
  //   id: number
  //   title: string
  //   note: string // 注意
  //   content: string // 内容
  //   tips: string // 提示
  //   analyze: string //解析
  //   answer: string // 正确答案
  //   fileStructure: FileStructure
  // }
  // // Update Project interface to use the new Step interface
  // interface Project {
  //   id: number
  //   name: string
  //   steps: Step[]
  // }
  // // Define the state type
  // type State = {
  //   currentStepIndex: number
  //   code: string
  //   error: string
  //   completed: boolean
  //   isSubmitDialogOpen: boolean
  //   activeTab: 'editor' | 'error'
  //   isSidebarOpen: boolean
  //   submitted: boolean
  //   returnToList: boolean
  // }
  // const initialState: State = {
  //   currentStepIndex: 0,
  //   code: '',
  //   error: '',
  //   completed: false,
  //   isSubmitDialogOpen: false,
  //   activeTab: 'editor',
  //   isSidebarOpen: true,
  //   submitted: false,
  //   returnToList: false,
  // }
  // // Define the action type
  // type Action =
  //   | { type: 'SET_CODE'; payload: string }
  //   | { type: 'SET_ERROR'; payload: string }
  //   | { type: 'NEXT_STEP' }
  //   | { type: 'COMPLETE' }
  //   | { type: 'RESET' }
  //   | { type: 'TOGGLE_SUBMIT_DIALOG' }
  //   | { type: 'SET_ACTIVE_TAB'; payload: 'editor' | 'error' }
  //   | { type: 'TOGGLE_SIDEBAR' }
  //   | { type: 'SET_STEP'; payload: number }
  //   | { type: 'SUBMIT' }
  //   | { type: 'RETURN' }
  // // // Define the initial state
  // // const initialState: State = {
  // //   currentStepIndex: 0,
  // //   code: '',
  // //   error: '',
  // //   completed: false,
  // //   isSubmitDialogOpen: false,
  // //   activeTab: 'editor',
  // //   isSidebarOpen: true,
  // // }
  // // Define the reducer function
  // const reducer = (state: State, action: Action): State => {
  //   switch (action.type) {
  //     case 'SET_CODE':
  //       return { ...state, code: action.payload }
  //     case 'SET_ERROR':
  //       return { ...state, error: action.payload }
  //     case 'NEXT_STEP':
  //       return {
  //         ...state,
  //         currentStepIndex: state.currentStepIndex + 1,
  //         code: '',
  //         error: '',
  //       }
  //     case 'COMPLETE':
  //       return { ...state, completed: true }
  //     case 'RESET':
  //       return initialState
  //     case 'TOGGLE_SUBMIT_DIALOG':
  //       return { ...state, isSubmitDialogOpen: !state.isSubmitDialogOpen }
  //     case 'SET_ACTIVE_TAB':
  //       return { ...state, activeTab: action.payload }
  //     case 'TOGGLE_SIDEBAR':
  //       return { ...state, isSidebarOpen: !state.isSidebarOpen }
  //     case 'SET_STEP':
  //       return { ...state, currentStepIndex: action.payload }
  //     case 'SUBMIT':
  //       return { ...state, submitted: true }
  //     case 'RETURN':
  //       return { ...state, returnToList: true }
  //     default:
  //       return state
  //   }
  // }
  // // Define the props type for TrackNFT
  // type TrackNFTProps = {
  //   project: {
  //     id: number
  //     name: string
  //     steps: Array<{
  //       id: number
  //       title: string
  //       content: string
  //       answer: string
  //     }>
  //   }
  //   initialFiles: any // Update this type based on your FileStructureTree component
  //   initialFileContents: Array<[string, string]>
  // }
  // const TrackNFT: React.FC<TrackNFTProps> = ({
  //   project,
  //   initialFiles,
  //   initialFileContents,
  // }) => {
  //   const [state, dispatch] = useReducer(reducer, initialState)
  //   const {
  //     currentStepIndex,
  //     code,
  //     error,
  //     completed,
  //     isSubmitDialogOpen,
  //     activeTab,
  //     isSidebarOpen,
  //     submitted,
  //     returnToList,
  //   } = state
  //   const { exportCode } = useMoveEditor()
  //   useEffect(() => {
  //     const editorCode = exportCode()
  //     dispatch({ type: 'SET_CODE', payload: editorCode })
  //     if (isInputCorrect(editorCode, project.steps[currentStepIndex].answer)) {
  //       if (currentStepIndex < project.steps.length - 1) {
  //         dispatch({ type: 'NEXT_STEP' })
  //       } else {
  //         dispatch({ type: 'COMPLETE' })
  //       }
  //     } else {
  //       dispatch({
  //         type: 'SET_ERROR',
  //         payload: generateErrorFeedback(
  //           editorCode,
  //           project.steps[currentStepIndex].answer
  //         ),
  //       })
  //     }
  //   }, [code, currentStepIndex, project.steps, exportCode])
  //   useEffect(() => {
  //     localStorage.setItem(
  //       'projectProgress',
  //       JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
  //     )
  //   }, [currentStepIndex, project.id])
  //   const handleUpdateFileStructure = (updatedFiles, selectedPath) => {
  //     // Implement file structure update logic
  //     console.log('Updated files:', updatedFiles)
  //     console.log('Selected path:', selectedPath)
  //   }
  //   const ContentCard = ({ title, content, icon }) => (
  //     <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
  //       <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-300">
  //         {icon}
  //         {title}
  //       </h3>
  //       <div className="text-gray-300">{content}</div>
  //     </div>
  //   )
  //   const handleSubmit = () => {
  //     dispatch({ type: 'SUBMIT' })
  //     onSubmit && onSubmit()
  //   }
  //   const handleReset = () => {
  //     dispatch({ type: 'RESET' })
  //   }
  //   const handleReturn = () => {
  //     dispatch({ type: 'RETURN' })
  //     onReturn && onReturn()
  //   }
  //   const currentStep = project.steps[currentStepIndex]
  //   const renderContent = () => {
  //     if (completed) {
  //       return (
  //         <div className="flex flex-col items-center justify-center h-full">
  //           <div className="text-center mb-8">
  //             <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
  //             <h2 className="text-2xl font-bold text-white mb-2">
  //               所有步骤已完成！
  //             </h2>
  //             <p className="text-gray-400">恭喜你完成了项目。</p>
  //           </div>
  //           <div className="flex space-x-4">
  //             <button
  //               onClick={handleSubmit}
  //               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
  //               disabled={submitted}
  //             >
  //               <Send className="mr-2" size={16} />
  //               {submitted ? '已提交' : '提交'}
  //             </button>
  //             <button
  //               onClick={handleReset}
  //               className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors flex items-center"
  //             >
  //               <RotateCcw className="mr-2" size={16} />
  //               重置
  //             </button>
  //             <button
  //               onClick={handleReturn}
  //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
  //             >
  //               <ArrowLeft className="mr-2" size={16} />
  //               返回列表
  //             </button>
  //           </div>
  //         </div>
  //       )
  //     }
  //     return (
  //       <>
  //         <h2 className="text-2xl font-bold mb-4 text-blue-300">
  //           步骤 {currentStepIndex + 1}: {currentStep.title}
  //         </h2>
  //         <ContentCard
  //           title="内容"
  //           content={currentStep.content}
  //           icon={<BookOpen className="mr-2" size={20} />}
  //         />
  //         <ContentCard
  //           title="注意"
  //           content={currentStep.note}
  //           icon={<Info className="mr-2" size={20} />}
  //         />
  //         <ContentCard
  //           title="提示"
  //           content={currentStep.tips}
  //           icon={<Lightbulb className="mr-2" size={20} />}
  //         />
  //         <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
  //           <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-300">
  //             <Code className="mr-2" size={20} />
  //             代码编辑器
  //           </h3>
  //           <div className="mb-2 flex space-x-2">
  //             <button
  //               onClick={() =>
  //                 dispatch({ type: 'SET_ACTIVE_TAB', payload: 'editor' })
  //               }
  //               className={`px-3 py-1 rounded ${
  //                 activeTab === 'editor'
  //                   ? 'bg-blue-500 text-white'
  //                   : 'bg-gray-700 text-gray-300'
  //               }`}
  //             >
  //               编辑器
  //             </button>
  //             <button
  //               onClick={() =>
  //                 dispatch({ type: 'SET_ACTIVE_TAB', payload: 'error' })
  //               }
  //               className={`px-3 py-1 rounded ${
  //                 activeTab === 'error'
  //                   ? 'bg-blue-500 text-white'
  //                   : 'bg-gray-700 text-gray-300'
  //               }`}
  //             >
  //               反馈
  //             </button>
  //           </div>
  //           {activeTab === 'editor' ? (
  //             <MoveEditorWrapper initialCode={code} />
  //           ) : (
  //             <EnhancedErrorFeedback
  //               userInput={code}
  //               expectedAnswer={currentStep.answer}
  //               explanation={error}
  //             />
  //           )}
  //         </div>
  //         <ContentCard
  //           title="解析"
  //           content={currentStep.analyze}
  //           icon={<FileQuestion className="mr-2" size={20} />}
  //         />
  //         <ContentCard
  //           title="正确答案"
  //           content={currentStep.answer}
  //           icon={<MessageCircle className="mr-2" size={20} />}
  //         />
  //       </>
  //     )
  //   }
  //   if (returnToList) {
  //     return null // 或者可以返回一个加载指示器
  //   }
  //   return (
  //     <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
  //       {/* 侧边栏 */}
  //       <div
  //         className={`${
  //           isSidebarOpen ? 'w-80' : 'w-0'
  //         } transition-all duration-300 ease-in-out overflow-hidden`}
  //       >
  //         <div className="h-full bg-gradient-to-b from-gray-800 to-gray-900 p-4 overflow-auto">
  //           <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
  //             <Folder className="mr-2" size={20} />
  //             项目文件
  //           </h2>
  //           <FileStructureTree
  //             initialFiles={currentStep.fileStructure || initialFiles}
  //             initialFileContents={initialFileContents}
  //             onUpdate={handleUpdateFileStructure}
  //             allowEdit={false}
  //           />
  //         </div>
  //       </div>
  //       {/* 主要内容 */}
  //       <div className="flex-1 flex flex-col overflow-hidden">
  //         <header className="bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 flex justify-between items-center">
  //           <button
  //             onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
  //             className="text-gray-400 hover:text-white transition-colors duration-200"
  //           >
  //             <Menu size={24} />
  //           </button>
  //           <h1 className="text-2xl font-bold text-blue-400">{project.name}</h1>
  //           <div className="w-24"></div>
  //         </header>
  //         <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
  //           {renderContent()}
  //         </main>
  //       </div>
  //       {/* 步骤预览侧边栏 */}
  //       <div className="w-72 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 overflow-auto">
  //         <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
  //           <FileText className="mr-2" size={20} />
  //           步骤预览
  //         </h2>
  //         <ul className="space-y-2">
  //           {project.steps.map((step, index) => (
  //             <li
  //               key={step.id}
  //               className={`p-3 rounded-md flex items-center justify-between transition-all duration-200 ${
  //                 index === currentStepIndex
  //                   ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
  //                   : index < currentStepIndex
  //                   ? 'bg-green-700 bg-opacity-50 text-white'
  //                   : 'bg-gray-700 bg-opacity-50 text-gray-300'
  //               }`}
  //             >
  //               <span className="text-sm">{step.title}</span>
  //               {index < currentStepIndex && (
  //                 <CheckCircle2 className="w-4 h-4 text-green-300" />
  //               )}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //       {/* 提交对话框 */}
  //       <Transition appear show={isSubmitDialogOpen} as={React.Fragment}>
  //         <Dialog
  //           as="div"
  //           className="fixed inset-0 z-10 overflow-y-auto"
  //           onClose={() => dispatch({ type: 'TOGGLE_SUBMIT_DIALOG' })}
  //         >
  //           {/* ... 对话框内容 ... */}
  //         </Dialog>
  //       </Transition>
  //     </div>
  //   )
  // }
  // export default TrackNFT
}

import React, { useReducer, useEffect, useCallback, useRef } from 'react'
import {
  BookOpen,
  Info,
  Lightbulb,
  FileQuestion,
  MessageCircle,
} from 'lucide-react'
import { useMoveEditor } from '@/components/MoveEditorProvider'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { StepPreview } from './StepPreview'
import { CompletedView } from './CompletedView'
import { CodeEditor } from './CodeEditor'
import { ContentCard } from './ContentCard'
//@ts-ignore
import { isEqual } from 'lodash'
import { FileStructure } from './FileStructureTree'

function isInputCorrect(input: string, answer: string): boolean {
  // Remove whitespace and make comparison case-insensitive
  const cleanInput = input.replace(/\s+/g, '').toLowerCase()
  const cleanAnswer = answer.replace(/\s+/g, '').toLowerCase()

  // Use lodash's isEqual for a deep comparison
  return isEqual(cleanInput, cleanAnswer)
}

// // Function to generate error feedback
function generateErrorFeedback(input: string, answer: string): string {
  if (!input.trim()) {
    return '请在提交之前输入您的答案'
  }

  const inputLines = input.trim().split('\n')
  const answerLines = answer.trim().split('\n')

  if (inputLines.length !== answerLines.length) {
    return `您的答案有 ${inputLines.length} 行，但正确答案应该有 ${answerLines.length} 行。`
  }

  for (let i = 0; i < answerLines.length; i++) {
    const inputLine = inputLines[i]
    const answerLine = answerLines[i]

    if (inputLine !== answerLine) {
      let errorMessage = `第 ${i + 1} 行不正确。\n`
      errorMessage += `您的答案: ${inputLine}\n`
      errorMessage += `正确答案: ${answerLine}\n`

      // 查找第一个不匹配的字符位置
      let errorIndex = 0
      while (
        errorIndex < inputLine.length &&
        errorIndex < answerLine.length &&
        inputLine[errorIndex] === answerLine[errorIndex]
      ) {
        errorIndex++
      }

      // 生成指向错误的箭头
      const arrow = ' '.repeat(errorIndex) + '^'
      errorMessage += arrow + '\n'

      // 提供具体的错误说明
      if (errorIndex === inputLine.length) {
        errorMessage += '您的答案缺少一些字符。'
      } else if (errorIndex === answerLine.length) {
        errorMessage += '您的答案包含多余的字符。'
      } else {
        errorMessage += `从第 ${errorIndex + 1} 个字符开始不匹配。`
      }

      return errorMessage
    }
  }

  return '您的答案接近正确，但还不完全正确。请仔细检查并再次尝试。'
}

type State = {
  currentStepIndex: number
  code: string
  error: string
  completed: boolean
  isSubmitDialogOpen: boolean
  activeTab: 'editor' | 'error'
  isSidebarOpen: boolean
  submitted: boolean
  returnToList: boolean
}

const initialState: State = {
  currentStepIndex: 0,
  code: '',
  error: '',
  completed: false,
  isSubmitDialogOpen: false,
  activeTab: 'editor',
  isSidebarOpen: true,
  submitted: false,
  returnToList: false,
}

// Define the action type
type Action =
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }
  | { type: 'TOGGLE_SUBMIT_DIALOG' }
  | { type: 'SET_ACTIVE_TAB'; payload: 'editor' | 'error' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SUBMIT' }
  | { type: 'RETURN' }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_CODE':
      return { ...state, code: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'NEXT_STEP':
      return {
        ...state,
        currentStepIndex: state.currentStepIndex + 1,
        code: '',
        error: '',
        activeTab: 'editor', // 切换回编辑器标签
      }
    case 'COMPLETE':
      return { ...state, completed: true }
    case 'RESET':
      return initialState
    case 'TOGGLE_SUBMIT_DIALOG':
      return { ...state, isSubmitDialogOpen: !state.isSubmitDialogOpen }
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload }
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen }
    case 'SET_STEP':
      return { ...state, currentStepIndex: action.payload }
    case 'SUBMIT':
      return { ...state, submitted: true }
    case 'RETURN':
      return { ...state, returnToList: true }
    default:
      return state
  }
}

interface EditorRefType {
  setValue: (value: string) => void
}

interface Step {
  id: number
  title: string
  content: string
  answer: string
  note: string
  tips: string
  analyze: string
  fileStructure: FileStructure
}

interface Project {
  id: number
  name: string
  steps: Step[]
}

type TrackNFTProps = {
  project: Project
  initialFiles: FileStructure
  initialFileContents: Array<[string, string]>
  onSubmit?: () => void
  onReturn?: () => void
}

// 组件
const TrackNFT: React.FC<TrackNFTProps> = ({
  project,
  initialFiles,
  initialFileContents,
  onSubmit,
  onReturn, // 添加这行
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { exportCode, setCode } = useMoveEditor()
  // const { exportCode, setCode } = useMoveEditor()
  const editorRef = useRef<EditorRefType>(null)

  const {
    currentStepIndex,
    code,
    error,
    completed,
    activeTab,
    isSidebarOpen,
    submitted,
    returnToList,
  } = state

  const handleCodeUpdate = useCallback(() => {
    const editorCode = exportCode()
    dispatch({ type: 'SET_CODE', payload: editorCode })

    if (isInputCorrect(editorCode, project.steps[currentStepIndex].answer)) {
      if (currentStepIndex < project.steps.length - 1) {
        dispatch({ type: 'NEXT_STEP' })
      } else {
        dispatch({ type: 'COMPLETE' })
      }
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: generateErrorFeedback(
          editorCode,
          project.steps[currentStepIndex].answer
        ),
      })
    }
  }, [currentStepIndex, project.steps, exportCode])

  // 监听代码变化
  useEffect(() => {
    handleCodeUpdate()
  }, [handleCodeUpdate])

  useEffect(() => {
    // 使用 setTimeout 确保在下一个渲染周期执行
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.setValue('')
      }
      setCode('')
    }, 0)
  }, [currentStepIndex, setCode])

  // 保存进度
  useEffect(() => {
    localStorage.setItem(
      'projectProgress',
      JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
    )
  }, [currentStepIndex, project.id])

  useEffect(() => {
    const editorCode = exportCode()
    dispatch({ type: 'SET_CODE', payload: editorCode })

    if (isInputCorrect(editorCode, project.steps[currentStepIndex].answer)) {
      if (currentStepIndex < project.steps.length - 1) {
        dispatch({ type: 'NEXT_STEP' })
      } else {
        dispatch({ type: 'COMPLETE' })
      }
    } else {
      dispatch({
        type: 'SET_ERROR',
        payload: generateErrorFeedback(
          editorCode,
          project.steps[currentStepIndex].answer
        ),
      })
    }
  }, [code, currentStepIndex, project.steps, exportCode])

  useEffect(() => {
    localStorage.setItem(
      'projectProgress',
      JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
    )
  }, [currentStepIndex, project.id])

  const handleUpdateFileStructure = (
    updatedFiles: FileStructure,
    selectedPath?: string[]
  ): void => {
    console.log('Updated files:', updatedFiles)
    console.log('Selected path:', selectedPath)

    // 实现文件结构更新逻辑
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  const handleSubmit = () => {
    dispatch({ type: 'SUBMIT' })
    if (onSubmit) {
      onSubmit()
    }
  }

  const handleReturn = () => {
    dispatch({ type: 'RETURN' })
    if (onReturn) {
      onReturn()
    }
  }

  const currentStep = project.steps[currentStepIndex]

  const renderContent = () => {
    if (completed) {
      return (
        <CompletedView
          onSubmit={handleSubmit}
          onReset={handleReset}
          onReturn={handleReturn}
          submitted={submitted}
        />
      )
    }

    return (
      <>
        <h2 className="text-2xl font-bold mb-4 text-blue-300">
          步骤 {currentStepIndex + 1}: {currentStep.title}
        </h2>

        <ContentCard
          title="内容"
          content={currentStep.content}
          icon={<BookOpen className="mr-2" size={20} />}
        />

        <ContentCard
          title="注意"
          content={currentStep.note}
          icon={<Info className="mr-2" size={20} />}
        />

        <ContentCard
          title="提示"
          content={currentStep.tips}
          icon={<Lightbulb className="mr-2" size={20} />}
        />

        <CodeEditor
          key={currentStepIndex} // 添加 key prop
          activeTab={activeTab}
          onTabChange={(tab) =>
            dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })
          }
          code={code}
          error={error}
          expectedAnswer={project.steps[currentStepIndex].answer}
          editorRef={editorRef}
        />

        <ContentCard
          title="解析"
          content={currentStep.analyze}
          icon={<FileQuestion className="mr-2" size={20} />}
        />

        <ContentCard
          title="正确答案"
          content={currentStep.answer}
          icon={<MessageCircle className="mr-2" size={20} />}
        />
      </>
    )
  }

  if (returnToList) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        currentStep={project.steps[currentStepIndex]}
        initialFiles={initialFiles}
        initialFileContents={initialFileContents}
        onUpdateFileStructure={handleUpdateFileStructure}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          projectName={project.name}
        />

        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {renderContent()}
        </main>
      </div>

      <StepPreview steps={project.steps} currentStepIndex={currentStepIndex} />

      {/* Keep the SubmitDialog component as is */}
    </div>
  )
}

export default TrackNFT
