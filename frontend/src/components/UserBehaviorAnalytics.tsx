// src/components/UserBehaviorAnalytics.tsx
'use client'

import { useEffect, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'

type EventType = 'pageview' | 'click' | 'timeSpent'

interface AnalyticsEvent {
  eventType: EventType
  data: {
    page: string
    timestamp: string
    timeSpent?: number
    clicks?: number
  }
}

const UserBehaviorAnalytics: React.FC = () => {
  const pathname = usePathname()
  const [pageViewTime, setPageViewTime] = useState<number>(Date.now())

  const sendAnalytics = useCallback(async (event: AnalyticsEvent) => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      if (!response.ok) {
        throw new Error('Failed to send analytics')
      }
    } catch (error) {
      console.error('Error sending analytics:', error)
    }
  }, [])

  useEffect(() => {
    // 记录页面浏览
    sendAnalytics({
      eventType: 'pageview',
      data: {
        page: pathname,
        timestamp: new Date().toISOString(),
      },
    })

    // 重置页面浏览时间
    setPageViewTime(Date.now())

    const handleClick = () => {
      sendAnalytics({
        eventType: 'click',
        data: {
          page: pathname,
          timestamp: new Date().toISOString(),
          clicks: 1,
        },
      })
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)

      // 发送停留时间
      const timeSpent = (Date.now() - pageViewTime) / 1000 // 转换为秒
      sendAnalytics({
        eventType: 'timeSpent',
        data: {
          page: pathname,
          timestamp: new Date().toISOString(),
          timeSpent,
        },
      })
    }
  }, [pathname, sendAnalytics, pageViewTime])

  return null
}

export default UserBehaviorAnalytics
