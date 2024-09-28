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
              layout="fill"
              objectFit="cover"
              className="rounded-t-md"
            />
          </div>
          <div className="h-1/4 p-2">
            <p>{description}</p>
            <p>{children}</p>
          </div>
        </div>
      </div>
    </>
  )
}
