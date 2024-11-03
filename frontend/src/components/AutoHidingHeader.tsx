import React from 'react'
import { usePopover } from './PopoverProvider'
import Header from './Header'

const AutoHidingHeader = () => {
  const { isPopoverOpen } = usePopover()

  return (
    <div
      className={`
        fixed top-0 left-0 w-full h-20 z-30
        transition-transform duration-300
        ${isPopoverOpen ? '-translate-y-full' : 'translate-y-0'}
      `}
    >
      <Header />
    </div>
  )
}

export default AutoHidingHeader
