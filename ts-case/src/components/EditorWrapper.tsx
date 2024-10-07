'use client'

import { useState, useCallback, useEffect } from 'react'
import MoveEditor from './MoveEditor'
import AptosCliEditor from './AptosCliEditor'

interface MoveEditorWrapperProps {
  initialCode?: string
  onCodeChange?: (newCode: string) => void
}

const MoveEditorWrapper: React.FC<MoveEditorWrapperProps> = ({
  initialCode = '// 在这里输入你的 Move 代码',
}) => {
  const [code, setCode] = useState(initialCode)

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)

    // 这里可以添加其他需要的逻辑，比如保存到数据库等
  }, [])

  return <MoveEditor initialCode={code} onCodeChange={handleCodeChange} />
}

export default MoveEditorWrapper

interface MoveEditorWrapperProps {
  initialCode?: string
  onCodeChange?: (newCode: string) => void
}

export const AptosCliEditorWrapper: React.FC<MoveEditorWrapperProps> = ({
  initialCode = '// 在这里输入你的命令',
}) => {
  const [code, setCode] = useState(initialCode)
  useEffect(() => {
    console.log('[INFO](EditorWrapper.tsx) AptosCliEditorWrapper code:\n', code)
  }, [code])

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)

    // 这里可以添加其他需要的逻辑，比如保存到数据库等
  }, [])

  return <AptosCliEditor initialCode={code} onCodeChange={handleCodeChange} />
}
