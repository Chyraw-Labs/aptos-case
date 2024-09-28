'use client'
import { AllCase } from '@/components/AllCase'
import BackgroundSVG from '@/components/BackgroundSVG'
import Case from '@/components/Case'
import { GettingStarted } from '@/components/GettingStarted'
import Header from '@/components/Header'
// import Playground from '@/components/Playground'
// import WalletButton from '@/components/WalletButton'

export default function Home() {
  return (
    <>
      <Header />
      {/* <Playground /> */}
      <BackgroundSVG
        svgPath="/assets/logo-outline.svg"
        svgSize={{ width: 128, height: 128 }}
        scrollDirection="right"
        backgroundColor="#000"
        scrollSpeed={0.3}
      />
      <GettingStarted />

      <AllCase />
      <div className="py-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Case mdPath="/Docs/test.mdx" size="md" description="测试" tag="test">
          <p className="text-blue-500">测试ttttttttttttttttttttttttt</p>
        </Case>
        <Case
          mdPath="/Docs/hello_world.mdx"
          size="md"
          description="Hello World"
          tag="ts-sdk"
        >
          <p className="text-blue-500">hello</p>
        </Case>
        <Case
          mdPath="/Docs/module_script.mdx"
          size="md"
          description="模块脚本"
          tag="ts-sdk"
        >
          <p className="text-blue-500">模块和脚本......</p>
        </Case>
        <Case
          mdPath="/Docs/primitive_types.mdx"
          size="md"
          description="原始类型"
          tag="ts-sdk"
        >
          <p className="text-blue-500">Move 的类型系统...</p>
        </Case>

        <Case
          mdPath="/Docs/local_variables_scope.mdx"
          size="md"
          description="局部变量和作用域"
          tag="ts-sdk"
        >
          <p className="text-blue-500">Move 语法...</p>
        </Case>
        {/* 添加更多 Case 组件 */}
      </div>

      {/* <WalletButton /> */}
    </>
  )
}
