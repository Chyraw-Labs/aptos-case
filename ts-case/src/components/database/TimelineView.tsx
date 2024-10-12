'use client'
import React, { useState } from 'react'
import { Item } from './Database'

interface TimelineProps {
  data: Item[]
}

const TimelineItem: React.FC<{ item: Item; isLast: boolean }> = ({
  item,
  isLast,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center w-full max-w-3xl">
        <div className="w-1/4 text-right pr-4">
          <time className="text-sm font-normal text-gray-400">
            {item.dueDate}
          </time>
        </div>
        <div className="relative flex items-center justify-center w-6 h-6">
          <div
            className={`absolute w-6 h-6 bg-blue-100 rounded-full transition-all duration-300 ease-in-out
                        ${isHovered ? 'scale-110 bg-blue-500' : ''}`}
          ></div>
          <svg
            className={`w-2.5 h-2.5 z-10 transition-colors duration-300 ease-in-out ${
              isHovered ? 'text-white' : 'text-blue-800'
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        {/* 卡片 */}
        <div className="w-3/4 pl-4">
          <div
            className={`p-4 bg-white bg-opacity-10 backdrop-blur rounded-lg shadow-md 
                        transition-all duration-300 ease-in-out
                        ${isHovered ? 'scale-105 shadow-lg' : ''}
                        hover:bg-gray-50`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h3 className="text-lg font-semibold text-cyan-500 mb-1">
              {item.name}
            </h3>
            <p className="text-base font-normal text-gray-400 ">
              {item.description}
            </p>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="w-0.5 h-8 bg-gray-200 mt-2">
          <div
            className="w-full h-full bg-blue-300 transform scale-y-0 origin-top transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? 'scaleY(1)' : 'scaleY(0)' }}
          ></div>
        </div>
      )}
    </div>
  )
}

export const TimelineView: React.FC<TimelineProps> = ({ data }) => {
  return (
    <div className="flex justify-center w-full overflow-hidden">
      <div className="w-full max-w-4xl">
        {data.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            isLast={index === data.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
