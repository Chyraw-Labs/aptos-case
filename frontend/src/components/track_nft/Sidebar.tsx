import React from 'react'
import { Folder } from 'lucide-react'
import FileStructureTree, {
  FileStructure,
} from '@/components/track_nft/FileStructureTree'

// 定义 Step 类型
interface Step {
  id: number
  title: string
  note: string // 注意
  content: string // 内容
  tips: string // 提示
  analyze: string //解析
  answer: string // 正确答案
  fileStructure: FileStructure
}

interface SidebarProps {
  isOpen: boolean
  currentStep: Step
  initialFiles: FileStructure
  initialFileContents: Array<[string, string]>
  onUpdateFileStructure: (files: FileStructure, selectedPath?: string[]) => void
  className?: string
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentStep,
  initialFiles,
  initialFileContents,
  onUpdateFileStructure,
  className,
}) => (
  <div
    className={`${
      isOpen ? 'w-80' : 'w-0'
    } transition-all duration-300 ease-in-out overflow-hidden ${className}`}
  >
    <div className="h-full bg-gradient-to-b from-gray-800 to-gray-900 p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
        <Folder className="mr-2 text-blue-400" size={20} />
        项目文件
      </h2>
      <FileStructureTree
        initialFiles={currentStep.fileStructure || initialFiles}
        initialFileContents={initialFileContents}
        onUpdate={onUpdateFileStructure}
        allowEdit={false}
      />
    </div>
  </div>
)
