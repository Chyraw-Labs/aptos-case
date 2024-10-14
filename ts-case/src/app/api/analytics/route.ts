import { writeFile, readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

const DATA_FILE = '/tmp/analytics_data.json'

interface AnalyticsData {
  pageviews: Record<string, number>
  clicks: Record<string, number>
  timeSpent: Record<string, { totalTime: number; count: number }>
}

async function readDataFile(): Promise<AnalyticsData> {
  try {
    const data = await readFile(DATA_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.log('Error reading data file, initializing empty data: ', error)
    return { pageviews: {}, clicks: {}, timeSpent: {} }
  }
}

async function writeDataFile(data: AnalyticsData): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function POST(request: NextRequest) {
  const { eventType, data } = await request.json()
  console.log('Received event:', eventType, 'Data:', data)

  try {
    const analyticsData = await readDataFile()

    switch (eventType) {
      case 'pageview':
        analyticsData.pageviews[data.page] =
          (analyticsData.pageviews[data.page] || 0) + 1
        break
      case 'click':
        analyticsData.clicks[data.page] =
          (analyticsData.clicks[data.page] || 0) + (data.clicks || 0)
        break
      case 'timeSpent':
        if (!analyticsData.timeSpent[data.page]) {
          analyticsData.timeSpent[data.page] = { totalTime: 0, count: 0 }
        }
        analyticsData.timeSpent[data.page].totalTime += data.timeSpent || 0
        analyticsData.timeSpent[data.page].count += 1
        // 更新点击数
        analyticsData.clicks[data.page] =
          (analyticsData.clicks[data.page] || 0) + (data.clicks || 0)
        break
    }

    console.log('Updated analytics data:', analyticsData)
    await writeDataFile(analyticsData)

    return NextResponse.json({ message: 'Analytics data recorded' })
  } catch (error) {
    console.error('Error recording analytics:', error)
    return NextResponse.json(
      { error: 'Failed to record analytics data' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const analyticsData = await readDataFile()

    const pageViews = Object.entries(analyticsData.pageviews).map(
      ([page, views]) => ({
        page,
        views,
        clicks: analyticsData.clicks[page] || 0,
        avgTimeSpent: analyticsData.timeSpent[page]
          ? analyticsData.timeSpent[page].totalTime /
            analyticsData.timeSpent[page].count
          : 0,
      })
    )

    pageViews.sort((a, b) => b.views - a.views)

    return NextResponse.json({
      pageViews: pageViews.slice(0, 10),
      allPages: pageViews,
    })
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
