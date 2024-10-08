'use client'
import { MAILBOX } from '@/code-case/move'
import Track from './Track'
// import { tracks, TrackData } from './trackData'
interface TrackData {
  mdPath: string
  cover: string
  description: string
  tags: string[]
  title: string
  codeCase?: string
  children?: React.ReactNode
}
const tracks: TrackData[] = [
  {
    mdPath: '/Docs/test-mermaid.md',
    cover: '/images/cover/module_and_script.jpg',
    description: '用于 Aptos Case 的测试',
    tags: ['test', 'track'],
    title: '测试',
    children: (
      <p className="text-blue-500">
        苏格兰数学家和物理学家威廉·开尔文于 1848
        年提出了绝对色温标度，即开尔文标度。
      </p>
    ),
  },
  {
    mdPath: '/Docs/e_move.md',
    cover: '/images/cover/error.jpg',
    description: '什么是 Move Error',
    tags: ['test'],
    title: '错误码',
    children: <p className="text-blue-500">daily move by greg</p>,
  },
  {
    title: 'Move 中的 0x1 中断是什么意思？',
    description: 'Move 0x1 中断是什么意思？',
    mdPath: '/Docs/move-0x1-abort.md',
    cover: '/images/cover/move-0x1-abort.jpg',
    tags: ['错误码'],
    children: <p className="text-blue-500">daily move by greg</p>,
  },
  {
    title: '结构体中能力的作用',
    description: '通过邮箱案例讲解 Move 结构体中能力的作用',
    mdPath: '/Docs/what-does-key- copy-drop-store-mean.md',
    cover: '/images/cover/what-does-key- copy-drop-store-mean.jpg',
    tags: ['Move', '结构体', '能力'],
    codeCase: MAILBOX,
    children: <p className="text-blue-500">daily move by greg</p>,
  },
  {
    title: '结构体中能力的作用',
    description: '通过邮箱案例讲解 Move 结构体中能力的作用',
    mdPath: '/Docs/what-does-key- copy-drop-store-mean.md',
    cover: '/images/cover/what-does-key- copy-drop-store-mean.jpg',
    tags: ['Move', '结构体', '能力'],
    codeCase: MAILBOX,
    children: <p className="text-blue-500">daily move by greg</p>,
  },
  {
    title: '结构体中能力的作用',
    description: '通过邮箱案例讲解 Move 结构体中能力的作用',
    mdPath: '/Docs/what-does-key- copy-drop-store-mean.md',
    cover: '/images/cover/what-does-key- copy-drop-store-mean.jpg',
    tags: ['Move', '结构体', '能力'],
    codeCase: MAILBOX,
    children: <p className="text-blue-500">daily move by greg</p>,
  },
  {
    title: '结构体中能力的作用',
    description: '通过邮箱案例讲解 Move 结构体中能力的作用',
    mdPath: '/Docs/what-does-key- copy-drop-store-mean.md',
    cover: '/images/cover/what-does-key- copy-drop-store-mean.jpg',
    tags: ['Move', '结构体', '能力'],
    codeCase: MAILBOX,
    children: <p className="text-blue-500">daily move by greg</p>,
  },
  {
    title: '结构体中能力的作用',
    description: '通过邮箱案例讲解 Move 结构体中能力的作用',
    mdPath: '/Docs/what-does-key- copy-drop-store-mean.md',
    cover: '/images/cover/what-does-key- copy-drop-store-mean.jpg',
    tags: ['Move', '结构体', '能力'],
    codeCase: MAILBOX,
    children: <p className="text-blue-500">daily move by greg</p>,
  },
]
export const AllDailyMove = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center mx-4 my-4">
          <p className="font-bold text-7xl mb-4 text-center">Move 工坊</p>
          <div className="text-center mx-auto max-w-prose mb-8">
            <span className="text-base mb-4 block">
              这是关于 Aptos 公链中 Move 语言的说明，来自 Aptos
              工程师。通过这些文章和代码，您将
              <span className="font-bold text-blue-400">
                了解 Move 的底层设计
              </span>
              ，这能够帮助你编写出更健壮和安全的代码。
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
            {tracks.map((track: TrackData, index: number) => (
              <Track
                key={index}
                mdPath={track.mdPath}
                cover={track.cover}
                description={track.description}
                tags={track.tags}
                title={track.title}
                codeCase={track.codeCase}
              >
                {track.children}
              </Track>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
