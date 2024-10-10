'use client'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Timeline, TimelineItem } from 'vertical-timeline-component-for-react'
import { Item } from './Database'

interface TimelineProps {
  data: Item[]
}

export const TimelineView: React.FC<TimelineProps> = ({ data }) => (
  <Timeline lineColor={'#ddd'}>
    {data.map((item) => (
      <TimelineItem
        key={item.id}
        dateText={item.dueDate}
        style={{ color: '#e86971' }}
      >
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </TimelineItem>
    ))}
  </Timeline>
)
