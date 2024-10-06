// import React from 'react'

// interface TooltipProps {
//   message: string
//   visible: boolean
// }

// const Tooltip: React.FC<TooltipProps> = ({ message, visible }) => {
//   return (
//     <div
//       className={`mt-1 absolute bg-gray-700 text-white text-sm rounded py-1 px-2 transition-opacity duration-200 ${
//         visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
//       }`}
//       style={{ pointerEvents: 'none' }} // 防止 Tooltip 捕获鼠标事件
//     >
//       {message}
//     </div>
//   )
// }

// export default Tooltip

// import { Button } from '@headlessui/react'
// import { ReactNode, useState } from 'react'
// import Tooltip from './Tooltip'

// interface TooltipButtonProps {
//   message: string
//   onClick: () => void
//   children: ReactNode
//   className?: string
// }

// const TooltipButton: React.FC<TooltipButtonProps> = ({
//   message,
//   onClick,
//   children,
//   className,
// }) => {
//   const [tooltipVisible, setTooltipVisible] = useState(false)

//   return (
//     <div className="relative inline-block">
//       <Button
//         className={className}
//         onMouseEnter={() => setTooltipVisible(true)}
//         onMouseLeave={() => setTooltipVisible(false)}
//         onClick={onClick}
//       >
//         {children}
//       </Button>
//       <Tooltip message={message} visible={tooltipVisible} />
//     </div>
//   )
// }

import { Button } from '@headlessui/react'
import { ReactNode, useState } from 'react'

interface TooltipButtonProps {
  message: string
  onClick: () => void
  children: ReactNode
  className?: string
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  message,
  onClick,
  children,
  className,
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <Button
        className={className}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        onClick={onClick}
      >
        {children}
      </Button>
      <div
        role="tooltip"
        className={`mt-1 absolute bg-blue-900 text-white text-sm rounded py-1 px-2 transition-opacity duration-200 ${
          tooltipVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ pointerEvents: 'none' }} // Prevent tooltip from capturing mouse events
      >
        {message}
      </div>
    </div>
  )
}

export default TooltipButton
