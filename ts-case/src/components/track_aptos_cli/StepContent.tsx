import React from 'react'

const StepContent = ({ step }) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold mb-2 text-white">当前步骤： </h2>
    <h3 className="text-lg font-bold mb-2 text-white">{step.title}</h3>
    <pre className="bg-gray-800 m-1 p-2 text-white rounded whitespace-pre-wrap max-h-96 overflow-auto">
      {step.content}
    </pre>
  </div>
)

export default StepContent
