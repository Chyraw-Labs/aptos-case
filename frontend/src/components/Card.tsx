'use client'
import Image from 'next/image'

interface CardProps {
  imagePath: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  description?: string
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  imagePath,
  className,
  description,
  children,
}) => {
  return (
    <>
      <div className={className}>
        <div className="w-64 h-96 bg-white bg-opacity-10 backdrop-blur-xl outline-white rounded-md">
          <div className="relative h-3/4">
            <Image
              src={imagePath}
              alt="case"
              fill
              style={{ objectFit: 'cover' }} // 使用 style 来设置 objectFit
              className="rounded-t-md"
            />
          </div>
          <div className="h-1/4 p-2">
            <div>{description}</div>
            <div>{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}
