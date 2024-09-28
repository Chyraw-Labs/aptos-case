// components/MoveEditorWrapper.tsx
'use client'

import { useState, useCallback } from 'react'
import MoveEditor from './MoveEditor'

interface MoveEditorWrapperProps {
  initialCode?: string
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
