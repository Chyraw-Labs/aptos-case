'use client'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import WalletMenu from './WalletMenu'
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css'
import '@/styles/wallet.css'

function Header() {
  const [isOpenAbout, setIsOpenAbout] = useState(false)
  const [isOpenTips, setIsOpenTips] = useState(false)
  const [isOpenTools, setIsOpenTools] = useState(false)
  const timeoutRefAbout = useRef<number | null>(null)
  const timeoutRefTips = useRef<number | null>(null)
  const timeoutRefTools = useRef<number | null>(null)

  const handleMouseEnter = (popover: string) => {
    if (popover === 'about') {
      if (timeoutRefAbout.current !== null) {
        clearTimeout(timeoutRefAbout.current)
      }
      setIsOpenAbout(true)
    } else if (popover === 'tips') {
      if (timeoutRefTips.current !== null) {
        clearTimeout(timeoutRefTips.current)
      }
      setIsOpenTips(true)
    } else if (popover === 'tools') {
      if (timeoutRefTools.current !== null) {
        clearTimeout(timeoutRefTools.current)
      }
      setIsOpenTools(true)
    }
  }

  const handleMouseLeave = (popover: string) => {
    if (popover === 'about') {
      timeoutRefAbout.current = window.setTimeout(() => {
        setIsOpenAbout(false)
      }, 100)
    } else if (popover === 'tips') {
      timeoutRefTips.current = window.setTimeout(() => {
        setIsOpenTips(false)
      }, 100)
    } else if (popover === 'tools') {
      timeoutRefTools.current = window.setTimeout(() => {
        setIsOpenTools(false)
      }, 100)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRefAbout.current !== null) {
        clearTimeout(timeoutRefAbout.current)
      }
      if (timeoutRefTips.current !== null) {
        clearTimeout(timeoutRefTips.current)
      }
      if (timeoutRefTools.current !== null) {
        clearTimeout(timeoutRefTools.current)
      }
    }
  }, [])

  return (
    <>
      <div className="flex justify-center w-full py-2 px-2 rounded-lg bg-opacity-10 backdrop-blur block">
        <div className="flex justify-between w-full max-w-4xl items-center ">
          {/* LOGO */}
          <div className="flex-none justify-center px-2">
            <a href="/" className="flex justify-between  items-center">
              <Image
                className="flex-1 justify-start"
                src="/assets/logo.svg"
                alt="logo"
                width={40}
                height={40}
              />
              <h1 className="flex-none justify-start px-2 font-bold text-md">
                Aptos Case
              </h1>
            </a>
          </div>
          <div className="flex-none justify-center">
            {/* Popover */}
            <div className="flex items-center justify-center space-x-8">
              <div className="flex-1 justify-center">
                {/* Tips */}
                <Popover className="relative flex-1 justify-center">
                  <div
                    onMouseEnter={() => handleMouseEnter('tips')}
                    onMouseLeave={() => handleMouseLeave('tips')}
                  >
                    <PopoverButton className="block text-lg/12 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>教程</span>
                    </PopoverButton>
                    {isOpenTips && (
                      // 背景
                      <PopoverPanel
                        transition
                        anchor="bottom"
                        static
                        // className="absolute z-10 mt-2 w-48 p-4 bg-white border rounded shadow-md"
                        className="absolute z-10 mt-1 w-48 p-1 bg-black border rounded shadow-md divide-y divide-white/5 rounded-xl  text-sm/6 transition  ease-in-out  bg-opacity-10 backdrop-blur"
                      >
                        <div className="p-3">
                          <a
                            className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                            href="/track_nft"
                          >
                            <p className="font-semibold text-sm text-white">
                              初学者教程
                            </p>
                            <p className="text-white/80 text-xs/4">
                              创建一个简易的 NFT 合约
                            </p>
                          </a>
                          <a
                            className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                            href="/python"
                          >
                            <p className="font-semibold text-sm text-white">
                              合约安全
                            </p>
                            <p className="text-white/80 text-xs/4">
                              通过 Python 学习安全和不安全的合约，以及 Move 实现
                            </p>
                          </a>
                          <a
                            className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                            href="/playground"
                          >
                            <p className="font-semibold text-sm text-white">
                              编辑器
                            </p>
                            <p className="text-white/80 text-xs/4">
                              在 Move 和 Aptos
                              的完备支持下，完成项目的编写和调试
                            </p>
                          </a>
                        </div>
                      </PopoverPanel>
                    )}
                  </div>
                </Popover>
              </div>
              <div className="flex-1 justify-center">
                <Popover className="relative">
                  <div
                    onMouseEnter={() => handleMouseEnter('tools')}
                    onMouseLeave={() => handleMouseLeave('tools')}
                  >
                    <PopoverButton className="block text-lg/12 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>工具</span>
                    </PopoverButton>
                    {isOpenTools && (
                      <PopoverPanel
                        transition
                        anchor="bottom"
                        static
                        className="absolute z-10 mt-1 w-48 p-1 bg-black border rounded shadow-md divide-y divide-white/5 rounded-xl  text-sm/6 transition  ease-in-out  bg-opacity-10 backdrop-blur"
                      >
                        <div className="p-3">
                          <div>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                              href="/playground"
                            >
                              <p className="font-semibold text-sm text-white">
                                在线编译器
                              </p>
                              <p className="text-white/80 text-xs/4">Move</p>
                              <p className="text-white/80 text-xs/4">TS sdk</p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                              href="http://43.138.107.218:3000/"
                            >
                              <p className="font-semibold text-sm text-white">
                                Move IDE
                              </p>
                              <p className="text-white/80 text-xs/4">
                                Move 版的 Remix
                              </p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                              href="/indexer"
                            >
                              <p className="font-semibold text-sm text-white">
                                Indexer
                              </p>
                              <p className="text-white/80 text-xs/4">在线</p>
                            </a>
                          </div>
                        </div>
                      </PopoverPanel>
                    )}
                  </div>
                </Popover>
              </div>
              <div className="flex-1 justify-center">
                <Popover className="relative">
                  <div
                    onMouseEnter={() => handleMouseEnter('about')}
                    onMouseLeave={() => handleMouseLeave('about')}
                  >
                    <PopoverButton className="block text-lg/12 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>关于</span>
                    </PopoverButton>
                    {isOpenAbout && (
                      <PopoverPanel
                        transition
                        anchor="bottom"
                        static
                        className="absolute z-10 mt-1 w-48 p-1 bg-black border rounded shadow-md divide-y divide-white/5 rounded-xl  text-sm/6 transition  ease-in-out  bg-opacity-10 backdrop-blur"
                      >
                        <div className="p-3">
                          <div>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                              href="/resource"
                            >
                              <p className="font-semibold text-sm text-white">
                                Resource
                              </p>
                              <p className="text-white/80 text-xs/4">
                                illustration
                              </p>
                              <p className="text-white/80 text-xs/4">
                                headless-ui
                              </p>
                              <p className="text-white/80 text-xs/4">
                                tailwind-css
                              </p>
                              <p className="text-white/80 text-xs/4">pyodide</p>
                              <p className="text-white/80 text-xs/4">
                                move-aptos-wasm
                              </p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                              href="https://chyraw.com"
                            >
                              <p className="font-semibold text-sm text-white">
                                Idea
                              </p>
                              <p className="text-white/80 text-xs/4">Simons</p>
                              <p className="text-white/80 text-xs/4">
                                Chyraw Labs
                              </p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-50 backdrop-blur-md block rounded-lg transition hover:bg-black hover:bg-opacity-30 hover:border hover:rounded-xl"
                              href="/team"
                            >
                              <p className="font-semibold text-sm text-white">
                                Developer
                              </p>
                              <p className="text-white/80 text-xs/4">Simons</p>
                            </a>
                          </div>
                        </div>
                      </PopoverPanel>
                    )}
                  </div>
                </Popover>
              </div>

              <div className="flex-1 justify-center">
                <a href="https://github.com/caoyang2002">
                  <Image
                    src="/assets/github-mark-white.svg"
                    alt="logo"
                    width={32}
                    height={32}
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'contain',
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="flex-none justify-end">
            <WalletMenu />
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
