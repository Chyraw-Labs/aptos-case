import React, { createContext, useContext, useState, ReactNode } from 'react'

interface PopoverContextType {
  isPopoverOpen: boolean
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultContextValue: PopoverContextType = {
  isPopoverOpen: false,
  setIsPopoverOpen: () => {},
}

const PopoverContext = createContext<PopoverContextType>(defaultContextValue)

interface PopoverProviderProps {
  children: ReactNode
}

export const PopoverProvider: React.FC<PopoverProviderProps> = ({
  children,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <PopoverContext.Provider value={{ isPopoverOpen, setIsPopoverOpen }}>
      {children}
    </PopoverContext.Provider>
  )
}

export const usePopover = () => useContext(PopoverContext)
