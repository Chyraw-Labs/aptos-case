import React from 'react'
import { FileText, CheckCircle2 } from 'lucide-react'

interface StepPreviewProps {
  steps: Array<{ id: number; title: string }>
  currentStepIndex: number
  className?: string
}

export const StepPreview: React.FC<StepPreviewProps> = ({
  steps,
  currentStepIndex,
  className,
}) => (
  <div
    className={`w-72 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 overflow-auto ${className}`}
  >
    <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
      <FileText className="mr-2" size={20} />
      步骤预览
    </h2>
    <ul className="space-y-2">
      {steps.map((step, index) => (
        <li
          key={step.id} // 使用步骤的 id 作为 key
          className={`p-3 rounded-md flex items-center justify-between transition-all duration-200 ${
            index === currentStepIndex
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : index < currentStepIndex
              ? 'bg-green-700 bg-opacity-50 text-white'
              : 'bg-gray-700 bg-opacity-50 text-gray-300'
          }`}
        >
          <span className="text-sm">{step.title}</span>
          {index < currentStepIndex && (
            <CheckCircle2 className="w-4 h-4 text-green-300" />
          )}
        </li>
      ))}
    </ul>
  </div>
)
