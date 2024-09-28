'use client'
// MoveEditorContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react'

// 定义上下文的类型
interface MoveEditorContextType {
  code: string
  setCode: React.Dispatch<React.SetStateAction<string>>
  exportCode: () => string
}

// 创建上下文
const MoveEditorContext = createContext<MoveEditorContextType | null>(null)

export const MoveEditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [code, setCode] = useState('')

  const exportCode = () => code

  return (
    <MoveEditorContext.Provider value={{ code, setCode, exportCode }}>
      {children}
    </MoveEditorContext.Provider>
  )
}

// 自定义 hook 以使用上下文
export const useMoveEditor = () => {
  const context = useContext(MoveEditorContext)
  if (!context) {
    throw new Error('useMoveEditor must be used within a MoveEditorProvider')
  }
  return context
}
