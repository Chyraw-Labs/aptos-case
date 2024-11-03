import TooltipButton from '@/components/TooltipButton'

export default function Safety() {
  const openSafety = () => {
    window.open('/safety', '_blank')
  }

  return (
    <div className="flex flex-col items-center mx-4 my-4 z-10">
      <p className="font-bold text-7xl mb-4">合约安全</p>
      <div className="text-center mx-auto max-w-prose">
        <span className="text-base mb-4 block">
          在区块链的世界中，因为安全漏洞导致的损失时有发生，而且代价惨重，作为开发者要努力保证合约的安全，避免合约被攻击。合约安全是区块链安全的重要保障，也是
          <span className="font-bold text-blue-400">区块链技术发展的关键</span>
          。写出安全的合约是区块链开发者必须掌握的重要技能。
        </span>
      </div>

      <div className="flex flex-row items-center gap-4 my-2">
        <TooltipButton
          message="通过 Python 学习不安全的合约为何容易被攻击"
          onClick={openSafety}
          className="rounded bg-cyan-500 py-2 px-4 text-xl text-white hover:bg-[#84feff] hover:text-black hover:font-bold"
        >
          查看演示
        </TooltipButton>
      </div>
    </div>
    // <>
    //   <div className="flex flex-col h-screen w-screen">
    //     <Header />
    //     <BackgroundSVG
    //       svgPath="/assets/logo-outline.svg"
    //       svgSize={{ width: 128, height: 128 }}
    //       scrollDirection="right"
    //       backgroundColor="#000"
    //       scrollSpeed={0.3}
    //     />
    //     <div className="flex-grow overflow-auto">
    //       <PythonPlayground />
    //     </div>
    //   </div>
    // </>
  )
}
