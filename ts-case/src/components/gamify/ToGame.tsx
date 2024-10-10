import TooltipButton from '@/components/TooltipButton'

export const ToGame = () => {
  const openGame = () => {
    window.open('/game', '_blank')
  }

  return (
    <div className="flex flex-col items-center mx-4 my-4 z-10">
      <p className="font-bold text-7xl mb-4">游戏中的 Move</p>
      <div className="text-center mx-auto max-w-prose">
        <span className="text-base mb-4 block">
          这是一个特别的游戏，你可以在这个游戏里面学习到 Move
          语法，并且在这个游戏过程中，你会了解到
          <span className="font-bold text-blue-400">区块链的运行过程</span>
          。就像游戏中的人物一样，你将会在区块链的世界中穿梭，体验区块链的方方面面。这是一个
          <span className="font-bold text-blue-400">有趣的学习方式</span>
          ，此外，
          <span className="font-bold text-blue-400">
            游戏中的 Move 语法将会在后续的编程任务中用到。
          </span>
          希望你能在这个游戏中找到乐趣，并且学习到新的知识！
        </span>
      </div>

      <div className="flex flex-row items-center gap-4 my-2">
        <TooltipButton
          message="探索区块链的运行机制，从全局视角理解区块链的运行过程。"
          onClick={openGame}
          className="rounded bg-cyan-500 py-2 px-4 text-xl text-white hover:bg-[#84feff] hover:text-black hover:font-bold"
        >
          开始游戏
        </TooltipButton>
      </div>
    </div>
  )
}
