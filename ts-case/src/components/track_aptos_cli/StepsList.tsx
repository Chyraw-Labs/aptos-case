import React from 'react'
import { CheckCircle2 } from 'lucide-react'

const StepsList = ({ steps, currentStepIndex }) => (
  <div className="w-64 bg-black p-6 overflow-auto">
    <h2 className="text-xl font-bold mb-4 text-white">步骤预览</h2>
    <ul>
      {steps.map((step, index) => (
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
)

export default StepsList
