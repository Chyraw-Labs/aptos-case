'use client'
import React, {
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react'
import MoveEditor from './MoveEditor'
import AptosCliEditor from './AptosCliEditor'

interface MoveEditorWrapperProps {
  initialCode?: string
  onCodeChange?: (newCode: string) => void
  editorRef?: React.RefObject<{ setValue: (value: string) => void }>
}

const MoveEditorWrapper: React.FC<MoveEditorWrapperProps> = React.forwardRef(
  ({ initialCode = '// 在这里输入你的 Move 代码', onCodeChange }, ref) => {
    const [code, setCode] = useState(initialCode)

    useEffect(() => {
      setCode(initialCode)
    }, [initialCode])

    const handleCodeChange = useCallback(
      (newCode: string) => {
        setCode(newCode)
        if (onCodeChange) {
          onCodeChange(newCode)
        }
      },
      [onCodeChange]
    )

    useImperativeHandle(ref, () => ({
      setValue: (value: string) => {
        setCode(value)
      },
    }))

    return <MoveEditor initialCode={code} onCodeChange={handleCodeChange} />
  }
)

MoveEditorWrapper.displayName = 'MoveEditorWrapper'

export default MoveEditorWrapper

// aptos cli editor

interface AptosEditorWrapperProps {
  initialCode?: string
  onCodeChange?: (newCode: string) => void
  editorRef?: React.RefObject<{ setValue: (value: string) => void }>
}

export const AptosCliEditorWrapper: React.FC<AptosEditorWrapperProps> =
  React.forwardRef(
    ({ initialCode = '// 在这里输入你的 Move 代码', onCodeChange }, ref) => {
      const [code, setCode] = useState(initialCode)
      useEffect(() => {
        setCode(initialCode)
      }, [initialCode])

      const handleCodeChange = useCallback(
        (newCode: string) => {
          setCode(newCode)
          if (onCodeChange) {
            onCodeChange(newCode)
          }
        },
        [onCodeChange]
      )

      useImperativeHandle(ref, () => ({
        setValue: (value: string) => {
          setCode(value)
        },
      }))

      return (
        <AptosCliEditor initialCode={code} onCodeChange={handleCodeChange} />
      )
    }
  )

AptosCliEditorWrapper.displayName = 'AptosCliEditorWrapper'
