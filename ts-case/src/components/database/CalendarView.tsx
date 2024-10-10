'use client'
import { DayPicker } from 'react-day-picker'
import { Item } from './Database'

interface CalendarViewProps {
  data: Item[]
}

export const CalendarView: React.FC<CalendarViewProps> = ({ data }) => {
  const events = (data as unknown as Item[]).reduce((acc, item) => {
    const date = new Date(item.dueDate)
    const dateString = date.toISOString().split('T')[0]
    if (!acc[dateString]) acc[dateString] = []
    acc[dateString].push(item)
    return acc
  }, {} as { [key: string]: Item[] })

  return (
    <div className="overflow-x-auto">
      <DayPicker
        mode="single"
        showOutsideDays
        modifiers={{
          hasEvents: (date) => {
            const dateString = date.toISOString().split('T')[0]
            return !!events[dateString]
          },
        }}
        modifiersStyles={{
          hasEvents: { backgroundColor: '#e6f2ff' },
        }}
        onDayClick={(date) => {
          const dateString = date.toISOString().split('T')[0]
          if (events[dateString]) {
            console.log(events[dateString]) // 这里可以显示当天的事件详情
          }
        }}
      />
      <div className="mt-4">
        {Object.entries(events).map(([date, items]) => (
          <div key={date} className="mb-4">
            <h3 className="font-bold">{date}</h3>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white bg-opacity-10 p-2 rounded shadow mt-2"
              >
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.status}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
