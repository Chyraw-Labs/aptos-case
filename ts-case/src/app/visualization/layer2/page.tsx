'use client'
import Layer2 from '@/components/layer2/Layer2'
// import ProjectTrack from '@/components/TrackNFT'

import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        <a href="/" className="flex justify-center items-center my-2 ">
          <Image
            className="flex-shrink-0"
            src="/assets/logo.svg"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className="flex-none justify-start px-2 font-bold text-md">
            Aptos Case
          </h1>
        </a>
        <div className="flex-grow overflow-auto">
          <Layer2 />
        </div>
      </div>
    </>
  )
}
