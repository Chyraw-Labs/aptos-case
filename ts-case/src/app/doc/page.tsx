import { AptosDoc } from '@/components/cms/AptosDoc'
import Image from 'next/image'
export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden">
        <header className="flex justify-center items-center p-2 bg-black">
          <a href="/" className="flex items-center hover:text-blue-500">
            <Image
              className="flex-shrink-0"
              src="/assets/logo.svg"
              alt="logo"
              width={32}
              height={32}
            />
            <h1 className="ml-2 font-bold text-lg">Aptos Case</h1>
          </a>
        </header>

        <main className="flex-grow flex overflow-hidden">
          <AptosDoc />
        </main>
      </div>
    </>
  )
}
