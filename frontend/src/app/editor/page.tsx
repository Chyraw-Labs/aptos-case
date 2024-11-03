// pages/index.tsx
import { HELLO } from '@/code-case/move'
import MoveEditorWrapper from '@/components/EditorWrapper'

export default function Home() {
  // const handleCodeChange = (newCode: string) => {
  //   console.log('New code:', newCode)
  // }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MoveEditorWrapper initialCode={HELLO} />
    </div>
  )
}
