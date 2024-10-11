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
  const openNft = () => {
    window.open('/visualization/nft', '_blank')
  }
  const openLockup = () => {
    window.open('/visualization/lockup', '_blank')
  }
  const openDao = () => {
    window.open('/visualization/dao', '_blank')
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
        {/* <TooltipButton
          message="了解区块链上的质押机制，以及学习它如何运作。"
          onClick={openLockup}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          Lockup
        </TooltipButton>
        <TooltipButton
          message="探索 NFT 的世界，了解同质化 Token （ERC-20）以及非同质化 Token（NFT / ERC-721），探索 Aptos 的可组合 NFT。"
          onClick={openNft}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          NFT
        </TooltipButton>
        <TooltipButton
          message="DAO 是一种去中心化的自治组织，知名的 DAO 组织有 Uniswap、Aave 和 MakerDAO。这个页面将介绍 DAO 的概念，以及展示 DAO 的运作过程。"
          onClick={openDao}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          DAO
        </TooltipButton> */}
      </div>
    </div>
  )
}
