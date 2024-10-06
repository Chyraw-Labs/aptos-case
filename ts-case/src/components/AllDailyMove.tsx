import { MAILBOX } from '@/code-case/move'
import Track from './Track'

export const AllDailyMove = () => {
  return (
    <>
      <div className="flex flex-col mx-4 my-4">
        <p className="font-bold text-6xl mb-4">Move 工坊</p>
        <p className="font-bold text-xs mb-4">
          本节深入探讨 Aptos
          上最常用的库和框架，以及如何使用它们编写复杂但简单高效的模块。完成本课程后，您可以使用
          Aptos Framework 中的库使他们的代码更简单但更复杂。
        </p>
        <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Track
            mdPath="/Docs/test-mermaid.md"
            cover="/images/cover/module_and_script.jpg"
            size="md"
            description="用于 Aptos Case 的测试"
            tags={['test', 'track']}
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
          </Track>
          <Track
            mdPath="/Docs/e_move.md"
            cover="/images/cover/error.jpg"
            size="md"
            description="什么是 Move Error"
            tags={['test']}
            title="错误码"
            // codeCase={HELLO}
          >
            <p className="text-blue-500">daily move by greg</p>
          </Track>
          <Track
            title="Move 中的 0x1 中断是什么意思？"
            description="Move 0x1 中断是什么意思？"
            mdPath="/Docs/move-0x1-abort.md"
            cover="/images/cover/move-0x1-abort.jpg"
            size="md"
            tags={['错误码']}
            // codeCase={HELLO}
          >
            <p className="text-blue-500">daily move by greg</p>
          </Track>
          <Track
            title="结构体中能力的作用"
            description="通过邮箱案例讲解 Move 结构体中能力的作用"
            mdPath="/Docs/what-does-key- copy-drop-store-mean.md"
            cover="/images/cover/what-does-key- copy-drop-store-mean.jpg"
            size="md"
            tags={['Move', '结构体', '能力']}
            codeCase={MAILBOX}
          >
            <p className="text-blue-500">daily move by greg</p>
          </Track>

          {/* 添加更多 Case 组件 */}
        </div>
      </div>
    </>
  )
}
