import TooltipButton from './TooltipButton' // Ensure you import the merged component

export const GettingStarted = () => {
  const openTrackNFT = () => {
    window.open('/track_nft', '_blank')
  }
  const openTrackBasicSyntax = () => {
    window.open('/track_basic_syntax', '_blank')
  }

  const openTrackAptosCLI = () => {
    window.open('/track_aptos_cli', '_blank')
  }
  const openCodingConventions = () => {
    window.open('/track_coding_conventions', '_blank')
  }
  return (
    <div className="flex flex-col items-center mx-4 my-4">
      <p className="font-bold text-7xl mb-4">快速开始</p>
      <div className="text-center mx-auto max-w-prose">
        <span className="text-base mb-4 block">
          这是一门速成教程，可以帮助学习者快速入门 Aptos 公链的 Move
          语言的合约开发。您将
          <span className="font-bold text-blue-400">从基础知识开始</span>
          ，学习如何编写简单实用的 Move
          智能合约，以及通过命令行测试部署和分析。完成本教程后，您能够熟悉 Aptos
          的开发模型，并具备基本的
          <span className="font-bold text-blue-400">
            链上交互以及 Move 模块开发能力
          </span>
          。推荐从 NFT 项目开始，逐步深入，掌握更多高级特性！
        </span>
      </div>
      <div className="flex flex-row items-center gap-4 my-2">
        <TooltipButton
          message="跟随对初学者友好的 NFT 项目，快速学习 Aptos 公链上的 Move 语言智能合约开发，开启您的区块链之旅。"
          onClick={openTrackNFT}
          className="rounded bg-cyan-500 py-2 px-4 text-xl text-white hover:bg-[#84feff] hover:text-black hover:font-bold"
        >
          NFT 项目入门
        </TooltipButton>
        <TooltipButton
          message="练习 Aptos CLI 工具，通过 CLI 进行编译部署和分析"
          onClick={openTrackAptosCLI}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          Aptos 命令行工具
        </TooltipButton>
        <TooltipButton
          message="通过最佳实践，练习完整的 Move语法，了解编码技能"
          onClick={openTrackBasicSyntax}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          Move 基础语法
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
