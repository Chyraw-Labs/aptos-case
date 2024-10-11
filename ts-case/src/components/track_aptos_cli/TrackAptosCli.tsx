import React, { useState, useEffect } from 'react'
import ProjectHeader from './ProjectHeader'
import StepContent from './StepContent'
import CodeEditor from './CodeEditor'
import ErrorMessage from './ErrorMessage'
// import StepsList from './StepsList'
import CompletionDialog from './CompletionDialog'
// import FileStructureTree from
// import { useMoveEditor } from './MoveEditorProvider'
// import { AptosCliEditorWrapper } from './EditorWrapper'
import FileStructureTree from '../FileStructureTree'
import { useMoveEditor } from '../MoveEditorProvider'
import { AptosCliEditorWrapper } from '../EditorWrapper'
import StepsList from './StepsList'

const TrackAptosCLI = () => {
  const [project, setProject] = useState({
    id: 1,
    name: 'Aptos CLI 使用教程',
    steps: [
      // ... (steps data)
    ],
  })
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [code, setCode] = useState('// 请在这里输入你的答案...')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [initialFiles, setInitialFiles] = useState([{ root: ['README.md'] }])

  const { exportCode } = useMoveEditor()

  useEffect(() => {
    // ... (effect logic)
  }, [code, currentStepIndex, exportCode, project.steps])

  useEffect(() => {
    // ... (progress saving logic)
  }, [currentStepIndex, project.id, project.steps])

  const handleUpdateFileStructure = (updatedFiles, selectedPath) => {
    // ... (file structure update logic)
  }

  const handleConfirm = () => {
    // ... (confirmation logic)
  }

  const handleSubmit = () => {
    setIsSubmitDialogOpen(true)
  }

  if (completed) {
    return (
      <CompletionDialog
        project={project}
        onConfirm={handleConfirm}
        onSubmit={handleSubmit}
        isOpen={isSubmitDialogOpen}
        onClose={() => setIsSubmitDialogOpen(false)}
      />
    )
  }

  return (
    <div className="flex h-full bg-black">
      <div className="w-80 bg-black p-6 overflow-auto">
        <FileStructureTree
          initialFiles={initialFiles}
          initialFileContents={[]} // Add your initial file contents here
          onUpdate={handleUpdateFileStructure}
          allowEdit={false}
        />
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <ProjectHeader
          name={project.name}
          progress={(currentStepIndex / project.steps.length) * 100}
        />
        <StepContent step={project.steps[currentStepIndex]} />
        <CodeEditor>
          <AptosCliEditorWrapper initialCode={'$'} />
        </CodeEditor>
        <ErrorMessage error={error} />
      </div>
      <StepsList steps={project.steps} currentStepIndex={currentStepIndex} />
    </div>
  )
}

export default TrackAptosCLI
