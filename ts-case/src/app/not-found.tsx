'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])
  return (
    <div className="flex justify-center items-center w-full h-screen flex-col">
      <h2 className="text-2xl font-bold">没有找到</h2>
      <p className="mt-2">
        没有找到请求的内容，请重试或
        <a
          href={`mailto:reggiesimons2cy@gmial.com?subject=[Aptos-Case]页面异常 > '${currentPath}'&body=页面未找到 '${currentPath}'`}
          className="text-blue-600 hover:text-white"
        >
          报告开发者
        </a>
      </p>
      <Link href="/" className="mt-4 text-blue-500 hover:text-white">
        返回主页
      </Link>
    </div>
  )
}
