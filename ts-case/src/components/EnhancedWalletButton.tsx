'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Image from 'next/image'

const EnhancedWalletButton = () => {
  const { connected, account, disconnect, connect, wallets, wallet } =
    useWallet()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showWalletList, setShowWalletList] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleConnectClick = useCallback(() => {
    if (wallets && wallets.length > 0) {
      if (wallets.length === 1) {
        connect(wallets[0].name)
      } else {
        setShowWalletList(true)
      }
    } else {
      console.error('No wallets available')
      // 可以在这里添加一些用户反馈，比如显示一个提示消息
    }
  }, [connect, wallets])

  const handleDisconnectClick = useCallback(() => {
    setShowConfirm(true)
  }, [])

  const handleConfirmDisconnect = useCallback(() => {
    disconnect()
    setShowConfirm(false)
  }, [disconnect])

  const handleCancelDisconnect = useCallback(() => {
    setShowConfirm(false)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowWalletList(false)
        setShowConfirm(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={wrapperRef}>
      {connected ? (
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
          onClick={handleDisconnectClick}
        >
          {wallet && (
            <Image
              src={wallet.icon}
              alt={wallet.name}
              width={24}
              height={24}
              className="mr-2"
            />
          )}
          {account?.address?.slice(0, 6)}...{account?.address?.slice(-4)}
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-blue-500 text-white  hover:bg-white hover:text-black bg-opacity-10 backdrop-blur-sm border rounded-lg"
          onClick={handleConnectClick}
        >
          连接钱包
        </button>
      )}

      {showConfirm && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded shadow-lg z-10">
          <p className="text-gray-800 mb-2">确定要断开连接吗？</p>
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              onClick={handleCancelDisconnect}
            >
              取消
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              onClick={handleConfirmDisconnect}
            >
              确认断开
            </button>
          </div>
        </div>
      )}

      {showWalletList && wallets && wallets.length > 0 && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white rounded shadow-lg z-10 min-w-[260px]">
          <h3 className="text-lg font-bold mb-2 text-black">选择钱包</h3>
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              className="block w-full text-left px-2 py-2 hover:bg-gray-100 flex items-center text-black whitespace-nowrap overflow-hidden"
              onClick={() => {
                connect(wallet.name)
                setShowWalletList(false)
              }}
            >
              <Image
                src={wallet.icon}
                alt={wallet.name}
                width={24}
                height={24}
                className="mr-2 flex-shrink-0"
              />
              <span className="truncate">{wallet.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnhancedWalletButton
