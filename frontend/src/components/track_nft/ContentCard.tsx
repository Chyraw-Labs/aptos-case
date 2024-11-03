import React from 'react'

interface ContentCardProps {
  title: string
  content: string
  icon: React.ReactNode
  titleStyle?: string
}

export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  content,
  icon,
  titleStyle,
}) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4">
    <h3
      className={`text-lg font-semibold mb-2 flex items-center ${titleStyle}`}
    >
      {icon}
      {title}
    </h3>
    <div className="text-gray-300">{content}</div>
  </div>
)
