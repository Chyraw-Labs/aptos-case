'use client'
import ProjectTrack from '@/components/ProjectTrack'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <a href="/" className="flex justify-center items-center">
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

        <ProjectTrack />
      </div>
    </>
  )
}
