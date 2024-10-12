'use client'
import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { Item } from './Database'

interface CalendarViewProps {
  data: Item[]
}

export const CalendarView: React.FC<CalendarViewProps> = ({ data }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const events = data.reduce((acc, item) => {
    const date = new Date(item.dueDate)
    const dateString = date.toISOString().split('T')[0]
    if (!acc[dateString]) acc[dateString] = []
    acc[dateString].push(item)
    return acc
  }, {} as { [key: string]: Item[] })

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-opacity-10 backdrop-blur rounded-xl shadow-lg">
      <div className="md:w-1/2">
        <div className="backdrop-blur-sm bg-white bg-opacity-10 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            showOutsideDays
            modifiers={{
              hasEvents: (date) => {
                const dateString = date.toISOString().split('T')[0]
                return !!events[dateString]
              },
            }}
            modifiersStyles={{
              hasEvents: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '50%',
                border: '2px solid #3b82f6',
              },
            }}
            className="font-sans"
            classNames={{
              day: 'w-10 h-10 transition-transform duration-200 hover:scale-110',
              selected: 'bg-cyan-500 text-white rounded-full',
            }}
          />
        </div>
      </div>
      <div className="md:w-1/2 overflow-y-auto max-h-[600px]">
        <div className="space-y-4">
          {selectedDate && events[selectedDate.toISOString().split('T')[0]] ? (
            events[selectedDate.toISOString().split('T')[0]].map((item) => (
              <div
                key={item.id}
                className="backdrop-blur-md bg-white bg-opacity-30 p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:bg-opacity-40"
              >
                <h4 className="font-semibold text-lg text-cyan-500">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-200 mt-1">{item.status}</p>
                <p className="text-sm text-white mt-2">{item.description}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              {selectedDate
                ? 'No events for this date'
                : 'Select a date to view events'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
