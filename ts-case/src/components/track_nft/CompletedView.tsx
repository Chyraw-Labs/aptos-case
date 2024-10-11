import React from 'react'
import { CheckCircle2, Send, RotateCcw, ArrowLeft } from 'lucide-react'

interface CompletedViewProps {
  onSubmit: () => void
  onReset: () => void
  onReturn: () => void
  submitted: boolean
}

export const CompletedView: React.FC<CompletedViewProps> = ({
  onSubmit,
  onReset,
  onReturn,
  submitted,
}) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-center mb-8">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">所有步骤已完成！</h2>
      <p className="text-gray-400">恭喜你完成了项目。</p>
    </div>
    <div className="flex space-x-4">
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        disabled={submitted}
      >
        <Send className="mr-2" size={16} />
        {submitted ? '已提交' : '提交'}
      </button>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors flex items-center"
      >
        <RotateCcw className="mr-2" size={16} />
        重置
      </button>
      <button
        onClick={onReturn}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <ArrowLeft className="mr-2" size={16} />
        返回主页
      </button>
    </div>
  </div>
)
