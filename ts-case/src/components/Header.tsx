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
  const timeoutRefAbout = useRef<number | null>(null)
  const timeoutRefTips = useRef<number | null>(null)

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
    }
  }, [])

  return (
    <>
      <div className="flex justify-center w-full py-2 px-2 rounded-lg bg-opacity-10 backdrop-blur-sm block">
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
                    <PopoverButton className="block text-lg/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>Tips</span>
                    </PopoverButton>
                    {isOpenTips && (
                      <PopoverPanel
                        transition
                        anchor="bottom"
                        static
                        // className="absolute z-10 mt-2 w-48 p-4 bg-white border rounded shadow-md"
                        className="absolute z-10 mt-1 w-48 p-1 bg-white border rounded shadow-md divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition  ease-in-out  bg-opacity-20 backdrop-blur-sm"
                      >
                        <div className="p-3">
                          <a
                            className="px-2 py-2 bg-opacity-30 backdrop-blur-md block rounded-lg transition hover:bg-white/5"
                            href="/what"
                          >
                            <p className="font-semibold text-white">What</p>
                            <p className="text-white/50">
                              What do the pictures of cats mean respectively?
                            </p>
                          </a>

                          <a
                            className="px-2 py-2 mt-2 bg-opacity-30 backdrop-blur-md block rounded-lg transition hover:bg-white/5"
                            href="/way"
                          >
                            <p className="font-semibold text-white ">Way</p>
                            <p className="text-white/50">Ways to play?</p>
                          </a>
                          <a
                            className="px-2 py-2 mt-2 bg-opacity-30 backdrop-blur-md block rounded-lg transition hover:bg-white/5"
                            href="/how"
                          >
                            <p className="font-semibold text-white ">How</p>
                            <p className="text-white/50">
                              How are the scores calculated?
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
                    onMouseEnter={() => handleMouseEnter('about')}
                    onMouseLeave={() => handleMouseLeave('about')}
                  >
                    <PopoverButton className="block text-lg/6 font-semibold text-white/50 focus:outline-none data-[active]:text-white data-[hover]:text-white data-[focus]:outline-1 data-[focus]:outline-white">
                      <span>About</span>
                    </PopoverButton>
                    {isOpenAbout && (
                      <PopoverPanel
                        transition
                        anchor="bottom"
                        static
                        className="absolute z-10 mt-1 w-48 p-1 bg-white border rounded shadow-md divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition  ease-in-out  bg-opacity-20 backdrop-blur-sm"
                      >
                        <div className="p-3">
                          <div>
                            <a
                              className="px-2 py-2 mt-2 bg-opacity-60 backdrop-blur-xl block rounded-lg transition hover:bg-white/5"
                              href="https://http.cat"
                            >
                              <p className="font-semibold text-white ">
                                Resource
                              </p>
                              <p>http.cat</p>
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
              {/* <div className="flex-1 justify-center">
                <a href="https://x.com/caoyang2002">
                  <Image
                    src="/assets/twitter-x.svg"
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
              </div> */}
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
            {/* //TODO */}
            <WalletMenu />
            {/* <WalletSelector
              isModalOpen={isModalOpen}
              setModalOpen={setIsModalOpen}
            /> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
