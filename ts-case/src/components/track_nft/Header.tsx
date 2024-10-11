import React from 'react'
import { Menu } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
  projectName: string
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  projectName,
}) => (
  <header className="bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 flex justify-between items-center">
    <button
      onClick={onToggleSidebar}
      className="text-gray-400 hover:text-white transition-colors duration-200"
    >
      <Menu size={24} />
    </button>
    <h1 className="text-2xl font-bold text-blue-400">{projectName}</h1>
    <div className="w-24"></div>
  </header>
)
