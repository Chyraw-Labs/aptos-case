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
      <div className="flex justify-center w-full py-2 px-2 rounded-lg bg-opacity-10 backdrop-blur-md block">
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
                      <PopoverPanel
                        transition
                        anchor="bottom"
                        static
                        // className="absolute z-10 mt-2 w-48 p-4 bg-white border rounded shadow-md"
                        className="absolute z-10 mt-1 w-48 p-1 bg-white/5 border rounded shadow-md divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition  ease-in-out  bg-opacity-20 backdrop-blur-md"
                      >
                        <div className="p-3">
                          <a
                            className="px-2 py-2 bg-opacity-30 backdrop-blur-md block rounded-lg transition hover:bg-white/5"
                            href="/project"
                          >
                            <p className="font-semibold text-white">分步教程</p>
                            <p className="text-white/50">创建一个 NFT</p>
                          </a>

                          <a
                            className="px-2 py-2 mt-2 bg-opacity-30 backdrop-blur-md block rounded-lg transition hover:bg-white/5"
                            href="/playground"
                          >
                            <p className="font-semibold text-white ">
                              案例演示
                            </p>
                            <p className="text-white/50">test: playground</p>
                          </a>
                          <a
                            className="px-2 py-2 mt-2 bg-opacity-30 backdrop-blur-md block rounded-lg transition hover:bg-white/5"
                            href="/editor"
                          >
                            <p className="font-semibold text-white ">
                              快速开始
                            </p>
                            <p className="text-white/50">test: editor</p>
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
                        className="absolute z-10 mt-1 w-48 p-1 bg-white border rounded shadow-md divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition  ease-in-out  bg-opacity-20 backdrop-blur-md"
                      >
                        <div className="p-3">
                          <div>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-60 backdrop-blur-xl block rounded-lg transition hover:bg-white/5"
                              href="/resource"
                            >
                              <p className="font-semibold text-white ">
                                Resource
                              </p>
                              <p className="text-white/50">illustration</p>
                              <p className="text-white/50">headless-ui</p>
                              <p className="text-white/50">tailwind-css</p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-60 backdrop-blur-xl block rounded-lg transition hover:bg-white/5"
                              href="https://chyraw.com"
                            >
                              <p className="font-semibold text-white ">Idea</p>
                              <p className="text-white/50">Science</p>
                              <p className="text-white/50">Chyraw Labs</p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-60 backdrop-blur-xl block rounded-lg transition hover:bg-white/5"
                              href="/team"
                            >
                              <p className="font-semibold text-white ">
                                Developer
                              </p>
                              <p className="text-white/50">Simons</p>
                              <p className="text-white/50">Yongbye</p>
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
                        className="absolute z-10 mt-1 w-48 p-1 bg-white border rounded shadow-md divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition  ease-in-out  bg-opacity-20 backdrop-blur-md"
                      >
                        <div className="p-3">
                          <div>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-60 backdrop-blur-xl block rounded-lg transition hover:bg-white/5"
                              href="/playground"
                            >
                              <p className="font-semibold text-white ">
                                在线编译器
                              </p>
                              <p className="text-white/50">Move</p>
                              <p className="text-white/50">TS sdk</p>
                            </a>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-60 backdrop-blur-xl block rounded-lg transition hover:bg-white/5"
                              href="/indexer"
                            >
                              <p className="font-semibold text-white ">
                                Indexer
                              </p>
                              <p className="text-white/50">在线</p>
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
