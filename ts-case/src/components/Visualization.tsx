import TooltipButton from './TooltipButton'

export const Visualization = () => {
  const openSwap = () => {
    window.open('/visualization/swap', '_blank')
  }
  const openLending = () => {
    window.open('/visualization/lending', '_blank')
  }
  const openBlockchain = () => {
    window.open('/visualization/blockchain', '_blank')
  }
  return (
    <div className="flex flex-col items-center mx-4 my-4 z-10">
      <p className="font-bold text-7xl mb-4">可视化</p>
      <div className="text-center mx-auto max-w-prose">
        <span className="text-base mb-4 block">
          这是一个区块链模型概念的可视化工具，帮助学习者快速理解区块链的必要性。您将
          <span className="font-bold text-blue-400">通过直观友好的方式</span>
          理解区块链的复杂逻辑。通过这个简单的旅程，您将理解
          <span className="font-bold text-blue-400">
            区块链的运行方式以及各种区块链产品的运行逻辑
          </span>
          。如果您觉得区块链很复杂，不妨从这里开始！
        </span>
      </div>

      <div className="flex flex-row items-center gap-4 my-2">
        <TooltipButton
          message="探索区块链的运行机制，从全局视角理解区块链的运行过程。"
          onClick={openBlockchain}
          className="rounded bg-cyan-500 py-2 px-4 text-xl text-white hover:bg-[#84feff] hover:text-black hover:font-bold"
        >
          Blockchain
        </TooltipButton>
        <TooltipButton
          message="体验去中心化交易的核心功能 Swap。在 Aptos 上轻松兑换不同代币，学习自动做市商（AMM）原理和流动性池的运作机制。"
          onClick={openSwap}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          Swap
        </TooltipButton>
        <TooltipButton
          message="探索 DeFi lending 协议的运作原理。作为借款人或贷款人参与，了解利率模型、抵押品、清算机制等核心概念。"
          onClick={openLending}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          Lending
        </TooltipButton>
      </div>
    </div>
  )
}
