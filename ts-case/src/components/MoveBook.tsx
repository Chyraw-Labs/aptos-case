import Case from './Case'
import { EXAMPLE_FOR, EXAMPLE_IF } from '@/code-case/move-example'

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
    mdPath: '/Docs/module_script.md',
    cover: '/images/cover/module_and_script.jpg',
    description: '模块脚本的讲解',
    tags: ['Move', '简单', '基础'],
    title: '模块和脚本',
    children: [],
  },
  {
    mdPath: '/Docs/primitive_types.md',
    cover: '/images/cover/primitive_types.jpg',
    description: 'aptos 上的 move 原始类型',
    tags: ['Move', '类型'],
    title: '原始类型',
    children: [],
  },
  {
    mdPath: '/Docs/local_variables_scope.md',
    cover: '/images/cover/local_variables_scope.jpg',
    description: 'Move 语言的示例',
    tags: ['move', '合约'],
    title: '局部变量和作用域',
    children: [],
  },
  {
    mdPath: '/Docs/equality.md',
    cover: '/images/cover/equality.jpg',
    description: 'Move 语言的示例',
    tags: ['move', '合约'],
    title: '等式判断',
    children: [],
  },
  {
    mdPath: '/Docs/abort_assert.md',
    cover: '/images/cover/abort_assert.jpg',
    description: 'Move 语言的示例',
    tags: ['move', '合约'],
    title: '终止和断言',
    children: [],
  },
  {
    mdPath: '/Docs/conditionals.md',
    cover: '/images/cover/conditionals.jpg',
    description: 'Move 语言的示例',
    tags: ['move', '合约'],
    title: '条件语句',
    codeCase: EXAMPLE_IF,
    children: [],
  },
  {
    mdPath: '/Docs/while-for-loop.md',
    cover: '/images/cover/while-for-loop.jpg',
    description: 'for、loop、while 语句',
    tags: ['move', '合约'],
    title: '循环语句',
    codeCase: EXAMPLE_FOR,
    children: [],
  },
  {
    mdPath: '/Docs/functions.md',
    cover: '/images/cover/functions.jpg',
    description:
      'Move 语言中模块函数和脚本函数的语法是共享的。模块内的函数可以重复使用，而脚本函数仅用于一次交易的调用。',
    tags: ['move', '合约'],
    title: '函数',
    children: [],
  },
  {
    mdPath: '/Docs/constants.md',
    cover: '/images/cover/constants.jpg',
    description: '',
    tags: ['move', '合约'],
    title: '常量',
    children: [],
  },
  {
    mdPath: '/Docs/generics.md',
    cover: '/images/cover/generics.jpg',
    description:
      '泛型可以用来定义不同输入数据类型上的函数和结构体。这种语言特性有时被称为参数多态性。在Move中，我们经常将泛型与类型参数和类型参数互换使用。',
    tags: ['move', '合约'],
    title: '泛型',
    children: [],
  },
  {
    mdPath: '/Docs/abilities.md',
    cover: '/images/cover/abilities.jpg',
    description:
      '能力是 Move 语言中的一个类型特性，它控制给定类型的值允许执行的操作。',
    tags: ['move', '合约'],
    title: '能力',
    children: [],
  },
  {
    mdPath: '/Docs/aliases.md',
    cover: '/images/cover/aliases.jpg',
    description: '可以为指定的模块或函数定义一个特别的名称',
    tags: ['move', '合约'],
    title: '别名',
    children: [],
  },
  {
    mdPath: '/Docs/friends.md',
    cover: '/images/cover/friends.jpg',
    description: '用于声明当前模块信任的模块。',
    tags: ['move', '合约'],
    title: '友元',
    children: [],
  },
  {
    mdPath: '/Docs/packages.md',
    cover: '/images/cover/packages.jpg',
    description: '包允许 Move 程序员更容易地重用代码并在项目之间共享。',
    tags: ['move', '合约'],
    title: '包',
    children: [],
  },
  {
    mdPath: '/Docs/package_upgrades.md',
    cover: '/images/cover/package_upgrades.jpg',
    description: 'Aptos 区块链上的 Move 代码（例如，Move 模块）可以升级',
    tags: ['move', '合约'],
    title: '升级包',
    children: [],
  },
  {
    mdPath: '/Docs/unit-tests.md',
    cover: '/images/cover/unit-tests.jpg',
    description: '测试 Move 合约，以便于部署到区块链上',
    tags: ['move', '合约'],
    title: '单元测试',
    children: [],
  },
  {
    mdPath: '/Docs/move_prover.md',
    cover: '/images/cover/move_prover.jpg',
    description:
      'Move 证明器可以自动验证 Move 智能合约的逻辑属性，同时提供类似于类型检查器或代码检查工具的用户体验。',
    tags: ['move', '合约'],
    title: 'Move 验证器',
    children: [],
  },
  {
    mdPath: '/Docs/move_specification_language.md',
    cover: '/images/cover/move_specification_language.jpg',
    description:
      'Move 证明器可以自动验证 Move 智能合约的逻辑属性，同时提供类似于类型检查器或代码检查工具的用户体验。',
    tags: ['move', '合约'],
    title: 'Move 语言规范',
    children: [],
  },
  {
    mdPath: '/Docs/randomness.md',
    cover: '/images/cover/randomness.jpg',
    description: '',
    tags: ['move', '合约'],
    title: '随机',
    children: [],
  },
  {
    mdPath: '/Docs/use_aptos_cli.md',
    cover: '/images/cover/use_aptos_cli.jpg',
    description: 'aptos cli',
    tags: ['aptos', 'cli'],
    title: '命令行工具',
    children: [],
  },
]

export const MoveBook = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col items-center mx-4 my-4">
          <p className="font-bold text-7xl mb-4 text-center">Move 手册</p>
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
