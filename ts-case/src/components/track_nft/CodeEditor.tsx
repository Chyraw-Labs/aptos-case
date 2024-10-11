import React, { RefObject } from 'react'
import { Code } from 'lucide-react'
import MoveEditorWrapper from '@/components/EditorWrapper'
import EnhancedErrorFeedback from '@/components/track_nft/EnhancedErrorFeedback'

interface EditorRefType {
  setValue: (value: string) => void
}

interface CodeEditorProps {
  activeTab: 'editor' | 'error'
  onTabChange: (tab: 'editor' | 'error') => void
  code: string
  error: string
  expectedAnswer: string
  editorRef: RefObject<EditorRefType>
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  activeTab,
  onTabChange,
  code,
  error,
  expectedAnswer,
  editorRef,
}) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2 flex items-center text-blue-300">
      <Code className="mr-2" size={20} />
      代码编辑器
    </h3>
    <div className="mb-2 flex space-x-2">
      <button
        onClick={() => onTabChange('editor')}
        className={`px-3 py-1 rounded ${
          activeTab === 'editor'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        编辑器
      </button>
      <button
        onClick={() => onTabChange('error')}
        className={`px-3 py-1 rounded ${
          activeTab === 'error'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-700 text-gray-300'
        }`}
      >
        反馈
      </button>
    </div>
    {activeTab === 'editor' ? (
      <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg">
        <div className="h-64 w-full">
          <MoveEditorWrapper initialCode={code} editorRef={editorRef} />
        </div>
      </div>
    ) : (
      <EnhancedErrorFeedback
        userInput={code}
        expectedAnswer={expectedAnswer}
        explanation={error}
      />
    )}
  </div>
)
