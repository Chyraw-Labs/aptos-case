'use client'
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'

interface BackgroundSVG {
  svgPath: string
  svgSize?: { width: number; height: number }
  scrollDirection?: 'up' | 'down' | 'left' | 'right' | 'random' | 'stop'
  backgroundColor?: string
  scrollSpeed?: number
}

const ScrollingSVGBackground: React.FC<BackgroundSVG> = React.memo(
  ({
    svgPath,
    svgSize = { width: 32, height: 32 },
    scrollDirection = 'down',
    backgroundColor = '#333',
    scrollSpeed = 1,
  }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const lastUpdateTime = useRef(performance.now())

    const updatePosition = useCallback(() => {
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastUpdateTime.current) / 16.67 // Normalize to 60 FPS

      setPosition((prevPosition) => {
        let newX = prevPosition.x
        let newY = prevPosition.y
        const movement = scrollSpeed * deltaTime

        switch (scrollDirection) {
          case 'up':
            newY += movement
            if (newY >= svgSize.height) newY = 0
            break
          case 'down':
            newY -= movement
            if (newY <= -svgSize.height) newY = 0
            break
          case 'left':
            newX += movement
            if (newX >= svgSize.width) newX = 0
            break
          case 'right':
            newX -= movement
            if (newX <= -svgSize.width) newX = 0
            break
          case 'random':
            newX += (Math.random() - 0.5) * movement * 2
            newY += (Math.random() - 0.5) * movement * 2
            newX = (newX + svgSize.width) % svgSize.width
            newY = (newY + svgSize.height) % svgSize.height
            break
          case 'stop':
            break
        }
        return { x: newX, y: newY }
      })

      lastUpdateTime.current = currentTime
    }, [scrollDirection, scrollSpeed, svgSize])

    useEffect(() => {
      let animationFrameId: number

      const animate = () => {
        updatePosition()
        animationFrameId = requestAnimationFrame(animate)
      }

      animationFrameId = requestAnimationFrame(animate)

      return () => cancelAnimationFrame(animationFrameId)
    }, [updatePosition])

    const patternTransform = useMemo(
      () => `translate(${position.x}, ${position.y})`,
      [position]
    )

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
              patternTransform={patternTransform}
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
)

ScrollingSVGBackground.displayName = 'ScrollingSVGBackground'

export default ScrollingSVGBackground
