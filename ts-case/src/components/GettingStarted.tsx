import TooltipButton from './TooltipButton' // Ensure you import the merged component

export const GettingStarted = () => {
  const openTrackNFT = () => {
    window.open('/track_nft', '_blank')
  }
  const openTrackBasicSyntaxAndCLI = () => {
    window.open('/track_basic_syntax_and_cli', '_blank')
  }
  const openCodingConventions = () => {
    window.open('/track_coding_conventions', '_blank')
  }
  return (
    <div className="flex flex-col items-center mx-4 my-4">
      <p className="font-bold text-7xl mb-4">快速开始</p>
      <div className="text-center mx-auto max-w-prose">
        <span className="text-base mb-4 block">
          这是一门速成教程，可以帮助学习者快速入门 Move 语言的合约开发。您将
          <span className="font-bold text-blue-400">从基础知识开始</span>
          ，学习如何编写简单实用的 Move 代码，并熟悉 Aptos
          的开发模型。完成本教程后，您可以完成
          <span className="font-bold text-blue-400">
            初步的链上交互以及编写简单的 Move 模块
          </span>
          。
        </span>
      </div>
      <div className="flex flex-row items-center gap-4 my-2">
        <TooltipButton
          message="跟随项目，快速学习 Move 语言"
          onClick={openTrackNFT}
          className="rounded bg-cyan-500 py-2 px-4 text-xl text-white hover:bg-[#84feff] hover:text-black hover:font-bold"
        >
          项目练习
        </TooltipButton>
        <TooltipButton
          message="练习 Aptos CLI 工具以及简单 Move语法，了解编码技能"
          onClick={openTrackBasicSyntaxAndCLI}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          基础语法
        </TooltipButton>
        <TooltipButton
          message="练习开发最佳实践，强化编码技能"
          onClick={openCodingConventions}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          编码进阶
        </TooltipButton>
      </div>
    </div>
  )
}
