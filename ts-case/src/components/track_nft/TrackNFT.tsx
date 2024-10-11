import React, { useReducer, useEffect, useRef } from 'react'
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  | { type: 'SET_STEP_COMPLETED' }
  | { type: 'CLEAR_STEP_COMPLETED' }

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
        activeTab: 'editor',
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
    case 'SET_STEP_COMPLETED':
      return { ...state, completed: true }
    case 'CLEAR_STEP_COMPLETED':
      return { ...state, completed: false }
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
  const editorRef = useRef<EditorRefType>(null)
  const prevStepRef = useRef(state.currentStepIndex)

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

  useEffect(() => {
    console.log('Current step:', currentStepIndex)
    console.log('Current code:', code)
    // ... 其余的 useEffect 代码
  }, [currentStepIndex, code, project.steps, exportCode, setCode, project.id])

  useEffect(() => {
    const handleCodeUpdate = () => {
      const editorCode = exportCode()

      // 只有当代码发生变化时才更新
      if (editorCode !== code) {
        dispatch({ type: 'SET_CODE', payload: editorCode })

        if (
          isInputCorrect(editorCode, project.steps[currentStepIndex].answer)
        ) {
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
      }
    }

    // 如果步骤发生变化，重置编辑器
    if (currentStepIndex !== prevStepRef.current) {
      if (editorRef.current) {
        editorRef.current.setValue('')
      }
      setCode('')
      prevStepRef.current = currentStepIndex
    }

    handleCodeUpdate()

    // 保存进度
    localStorage.setItem(
      'projectProgress',
      JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
    )
  }, [currentStepIndex, code, project.steps, exportCode, setCode, project.id])

  // useEffect(() => {
  //   const editorCode = exportCode()
  //   dispatch({ type: 'SET_CODE', payload: editorCode })

  //   if (isInputCorrect(editorCode, project.steps[currentStepIndex].answer)) {
  //     if (currentStepIndex < project.steps.length - 1) {
  //       dispatch({ type: 'NEXT_STEP' })
  //     } else {
  //       dispatch({ type: 'COMPLETE' })
  //     }
  //   } else {
  //     dispatch({
  //       type: 'SET_ERROR',
  //       payload: generateErrorFeedback(
  //         editorCode,
  //         project.steps[currentStepIndex].answer
  //       ),
  //     })
  //   }
  // }, [code, currentStepIndex, project.steps, exportCode])

  // useEffect(() => {
  //   localStorage.setItem(
  //     'projectProgress',
  //     JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
  //   )
  // }, [currentStepIndex, project.id])

  // const reducer = (state: State, action: Action): State => {
  //   console.log('Reducer action:', action.type, action.payload)
  //   switch (
  //     action.type
  //     // ... 其余代码保持不变
  //   ) {
  //   }
  // }
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
    <div className="h-full w-full fixed">
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

        <StepPreview
          steps={project.steps}
          currentStepIndex={currentStepIndex}
        />
      </div>
    </div>
  )
}

export default TrackNFT
