import Case from './Case'

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
    mdPath: '/Docs/hello_world.md',
    // codeCase={HELLO}
    cover: '/images/cover/hello_world.jpg',

    description: '开发者初学第一步',
    tags: ['简单', 'Move'],
    title: 'Hello World',
    children: <p className="text-blue-500">智能合约开发入门最佳实践</p>,
  },
]

export const AllCase = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center mx-4 my-4">
          <p className="font-bold text-7xl mb-4 text-center">所有案例</p>
          <div className="text-center mx-auto max-w-prose mb-8">
            <span className="text-base mb-4 block">
              这是 Move 合约的所有案例你可以在
              <span className="font-bold text-blue-400">
                <a href="https://github.com/caoyang2002/move-examples-zh">
                  Move-Example
                </a>
              </span>
              找到这些案例的源码。
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 w-full">
            {tracks.map((track: TrackData, index: number) => (
              <Case
                key={index}
                mdPath={track.mdPath}
                cover={track.cover}
                description={track.description}
                tags={track.tags}
                title={track.title}
                codeCase={track.codeCase}
              >
                {track.children}
              </Case>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
