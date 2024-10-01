import Case from './Case'
import { EXAMPLE_FOR, EXAMPLE_IF } from '@/code-case/move-example'

export const MoveBook = () => {
  return (
    <>
      <div className="flex flex-col mx-4 my-4">
        <p className="font-bold text-9xl mb-4">Move 手册</p>
        <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
          <Case
            mdPath="/Docs/equality.md"
            cover="/images/cover/equality.jpg"
            // codeCase={HELLO}
            size="md"
            description="Move 语言的示例"
            tags={['move', '合约']}
            title="等式判断"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/abort_assert.md"
            cover="/images/cover/abort_assert.jpg"
            // codeCase={HELLO}
            size="md"
            description="Move 语言的示例"
            tags={['move', '合约']}
            title="终止和断言"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/conditionals.md"
            cover="/images/cover/conditionals.jpg"
            size="md"
            description="Move 语言的示例"
            tags={['move', '合约']}
            codeCase={EXAMPLE_IF}
            title="条件语句"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>

          <Case
            mdPath="/Docs/while-for-loop.md"
            cover="/images/cover/while-for-loop.jpg"
            // codeCase={HELLO}
            size="md"
            description="for、loop、while 语句"
            tags={['move', '合约']}
            codeCase={EXAMPLE_FOR}
            title="循环语句"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/functions.md"
            cover="/images/cover/functions.jpg"
            // codeCase={HELLO}
            size="md"
            description="Move 语言中模块函数和脚本函数的语法是共享的。模块内的函数可以重复使用，而脚本函数仅用于一次交易的调用。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="函数"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>

          <Case
            mdPath="/Docs/constants.md"
            cover="/images/cover/constants.jpg"
            // codeCase={HELLO}
            size="md"
            description=""
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="常量"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/generics.md"
            cover="/images/cover/generics.jpg"
            size="md"
            description="泛型可以用来定义不同输入数据类型上的函数和结构体。这种语言特性有时被称为参数多态性。在Move中，我们经常将泛型与类型参数和类型参数互换使用。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="泛型"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/abilities.md"
            cover="/images/cover/abilities.jpg"
            size="md"
            description="能力是 Move 语言中的一个类型特性，它控制给定类型的值允许执行的操作。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="能力"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/aliases.md"
            cover="/images/cover/aliases.jpg"
            size="md"
            description="可以为指定的模块或函数定义一个特别的名称"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="别名"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/friends.md"
            cover="/images/cover/friends.jpg"
            size="md"
            description="用于声明当前模块信任的模块。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="友元"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/packages.md"
            cover="/images/cover/packages.jpg"
            size="md"
            description="包允许 Move 程序员更容易地重用代码并在项目之间共享。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="包"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/package_upgrades.md"
            cover="/images/cover/package_upgrades.jpg"
            size="md"
            description="Aptos 区块链上的 Move 代码（例如，Move 模块）可以升级"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="升级包"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/unit-tests.md"
            cover="/images/cover/unit-tests.jpg"
            size="md"
            description="测试 Move 合约，以便于部署到区块链上"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="单元测试"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/move_prover.md"
            cover="/images/cover/move_prover.jpg"
            size="md"
            description="Move 证明器可以自动验证 Move 智能合约的逻辑属性，同时提供类似于类型检查器或代码检查工具的用户体验。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="Move 验证器"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/move_specification_language.md"
            cover="/images/cover/move_specification_language.jpg"
            size="md"
            description="Move 证明器可以自动验证 Move 智能合约的逻辑属性，同时提供类似于类型检查器或代码检查工具的用户体验。"
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="Move 语言规范"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          <Case
            mdPath="/Docs/randomness.md"
            cover="/images/cover/randomness.jpg"
            size="md"
            description=""
            tags={['move', '合约']}
            // codeCase={EXAMPLE_FOR}
            title="随机"
          >
            <p className="text-blue-500">Move 语法...</p>
          </Case>
          {/*  */}
          {/* ----------------------------------- */}
          {/* 附录 */}
          <Case
            mdPath="/Docs/use_aptos_cli.md"
            cover="/images/cover/use_aptos_cli.jpg"
            size="md"
            description="aptos cli"
            tags={['aptos', 'cli']}
            // codeCase={EXAMPLE_FOR}
            title="命令行工具"
          >
            <p className="text-blue-500">aptos 命令行工具...</p>
          </Case>
        </div>
      </div>
    </>
  )
}
