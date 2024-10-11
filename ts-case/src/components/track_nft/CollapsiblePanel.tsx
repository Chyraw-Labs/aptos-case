import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsiblePanelProps {
  title: string
  content: string
}

const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  content,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-sm">
      <button
        className="w-full px-4 py-2 flex justify-between items-center text-left font-semibold text-blue-300 hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="px-4 py-2">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
            {content}
          </pre>
        </div>
      )}
    </div>
  )
}

export default CollapsiblePanel
