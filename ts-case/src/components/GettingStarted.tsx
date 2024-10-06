import TooltipButton from './TooltipButton' // Ensure you import the merged component

export const GettingStarted = () => {
  const openTrackNFT = () => {
    window.open('https://www.tracknft.io/', '_blank')
  }

  return (
    <div className="flex flex-col items-center mx-4 my-4">
      <p className="font-bold text-7xl mb-4">快速开始</p>
      <p className="font-bold text-xs mb-4">
        这是一门速成课程，包含 4
        个不同的模块，可帮助学习者从初学者到中级水平。您将从基础知识开始，学习如何编写更复杂的
        Move 代码，并熟悉 Aptos 对象。完成本课程后，您可以编写大多数复杂的 Move
        模块。
      </p>
      <div className="flex flex-row items-center gap-4 my-2">
        <TooltipButton
          message="跟随项目，快速学习 Move 语言"
          onClick={openTrackNFT}
          className="rounded bg-cyan-500 py-2 px-4 text-xl text-white hover:bg-[#84feff] hover:text-black hover:font-bold"
        >
          项目练习
        </TooltipButton>
        <TooltipButton
          message="练习语法，强化编码技能"
          onClick={() => console.log('rtet')}
          className="rounded bg-opacity-80 backdrop-blur-sm py-2 px-4 text-sm text-white border hover:rounded hover:font-bold hover:bg-white hover:text-black"
        >
          语法基础
        </TooltipButton>
      </div>
    </div>
  )
}
