'use client'
import { useEffect, useRef, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface AnalyticsEvent {
  eventType: 'pageview' | 'click' | 'timeSpent'
  data: {
    page: string
    timestamp: string
    timeSpent?: number
    clicks?: number
  }
}

const UserBehaviorAnalytics: React.FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageViewTimeRef = useRef<number>(Date.now())
  const clicksRef = useRef<number>(0)
  const lastPathRef = useRef<string | null>(null)

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
      console.log(`Analytics sent: ${event.eventType}`, event.data)
    } catch (error) {
      console.error('Error sending analytics:', error)
    }
  }, [])

  const recordPageView = useCallback(
    (page: string) => {
      if (page !== lastPathRef.current) {
        sendAnalytics({
          eventType: 'pageview',
          data: {
            page,
            timestamp: new Date().toISOString(),
          },
        })
        lastPathRef.current = page
      }
    },
    [sendAnalytics]
  )

  const recordTimeSpent = useCallback(
    (page: string) => {
      const timeSpent = (Date.now() - pageViewTimeRef.current) / 1000 // 转换为秒
      if (timeSpent > 0) {
        sendAnalytics({
          eventType: 'timeSpent',
          data: {
            page,
            timestamp: new Date().toISOString(),
            timeSpent,
            clicks: clicksRef.current,
          },
        })
      }
      pageViewTimeRef.current = Date.now()
      clicksRef.current = 0
    },
    [sendAnalytics]
  )

  useEffect(() => {
    console.log('Page or search params changed')
    recordTimeSpent(lastPathRef.current || pathname)
    recordPageView(pathname)

    const handleClick = () => {
      clicksRef.current += 1
    }

    window.addEventListener('click', handleClick)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordTimeSpent(pathname)
      } else {
        pageViewTimeRef.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      recordTimeSpent(pathname)
    }
  }, [pathname, searchParams, recordPageView, recordTimeSpent])

  return null
}

export default UserBehaviorAnalytics
