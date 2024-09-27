'use client'
import React, { useState, useEffect, useRef } from 'react'

interface BackgroundSVG {
  svgPath: string
  svgSize?: { width: number; height: number }
  scrollDirection?: 'up' | 'down' | 'left' | 'right' | 'random' | 'stop'
  backgroundColor?: string
  scrollSpeed?: number
}

const ScrollingSVGBackground: React.FC<BackgroundSVG> = ({
  svgPath,
  svgSize = { width: 32, height: 32 },
  scrollDirection = 'down',
  backgroundColor = '#333',
  scrollSpeed = 1,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updatePosition = () => {
      setPosition((prevPosition) => {
        let newX = prevPosition.x
        let newY = prevPosition.y
        switch (scrollDirection) {
          case 'up':
            newY += scrollSpeed
            if (newY >= svgSize.height) newY = 0
            break
          case 'down':
            newY -= scrollSpeed
            if (newY <= -svgSize.height) newY = 0
            break
          case 'left':
            newX += scrollSpeed
            if (newX >= svgSize.width) newX = 0
            break
          case 'right':
            newX -= scrollSpeed
            if (newX <= -svgSize.width) newX = 0
            break
          case 'random':
            newX += (Math.random() - 0.5) * scrollSpeed * 2
            newY += (Math.random() - 0.5) * scrollSpeed * 2
            newX = (newX + svgSize.width) % svgSize.width
            newY = (newY + svgSize.height) % svgSize.height
            break
          case 'stop':
            break
        }
        return { x: newX, y: newY }
      })
    }

    const animationFrame = requestAnimationFrame(function animate() {
      updatePosition()
      requestAnimationFrame(animate)
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [scrollDirection, scrollSpeed, svgSize])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: backgroundColor,
        zIndex: -1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <defs>
          <pattern
            id="svg-pattern"
            width={svgSize.width}
            height={svgSize.height}
            patternUnits="userSpaceOnUse"
            patternTransform={`translate(${position.x}, ${position.y})`}
          >
            <image
              href={svgPath}
              width={svgSize.width}
              height={svgSize.height}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#svg-pattern)" />
      </svg>
    </div>
  )
}

export default ScrollingSVGBackground
