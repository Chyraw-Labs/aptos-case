import { HELLO } from '@/code-case/move'
import Case from './Case'

export const MoveBook = () => {
  return (
    <>
      <div className="flex flex-col items-center mx-4 my-4">
        <p className="font-bold text-9xl mb-4">Move 手册</p>
        <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Case
            mdPath="/Docs/test.md"
            cover="/images/cover/module_and_script.jpg"
            size="md"
            description="用于 Aptos Case 的测试"
            tags={['test']}
            title="测试"
          >
            <p className="text-blue-500">
              附加内容
              <br />
              色温以开尔文 (K) 为单位。苏格兰数学家和物理学家威廉·开尔文于 1848
              年提出了绝对色温标度，即开尔文标度。该标度以 −273.15°C
              作为零点或“绝对零度”。令人困惑的是，开尔文标度与温度计上的标度方向相反，因此暖色（红色和橙色）的数值较低，约为
              2,000-3,000K，而冷色（蓝色和绿色）的数值较高，约为
              20,000K。中性白光为 6,504K。
            </p>
          </Case>
          <Case
            mdPath="/Docs/hello_world.md"
            codeCase={HELLO}
            cover="/images/cover/hello_world.jpg"
            size="md"
            description="开发者初学第一步"
            tags={['简单', 'Move']}
            title="Hello World"
          >
            <p className="text-blue-500">埃洛 · 伍德</p>
          </Case>
          <Case
            mdPath="/Docs/module_script.md"
            cover="/images/cover/module_and_script.jpg"
            // codeCase={HELLO}
            size="md"
            description="模块脚本的讲解"
            tags={['Move', '简单', '基础']}
            title="模块和脚本"
          >
            <p className="text-blue-500">模块和脚本......</p>
          </Case>
          <Case
            mdPath="/Docs/primitive_types.md"
            cover="/images/cover/primitive_types.jpg"
            // codeCase={HELLO}
            size="md"
            description="aptos 上的 move 原始类型"
            tags={['Move', '类型']}
            title="原始类型"
          >
            <p className="text-blue-500">Move 的类型系统...</p>
          </Case>

          <Case
            mdPath="/Docs/local_variables_scope.md"
            cover="/images/cover/local_variables_scope.jpg"
            // codeCase={HELLO}
            size="md"
            description="Move 语言的示例"
            tags={['move', '合约']}
            title="局部变量和作用域"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          {/* 添加更多 Case 组件 */}
        </div>
      </div>
    </>
  )
}
