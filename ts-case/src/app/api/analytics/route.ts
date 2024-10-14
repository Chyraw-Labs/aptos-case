import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ServerApiVersion, Db } from 'mongodb'

const uri =
  process.env.MONGODB_URI ||
  'mongodb+srv://case:<db_password>@case.5y7p9.mongodb.net/?retryWrites=true&w=majority&appName=case'

let client: MongoClient | null = null
let db: Db | null = null

async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }
  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
    await client.connect()
    db = client.db('analytics')
    console.log('Connected successfully to MongoDB')
    return db
  } catch (error) {
    console.error('Failed to connect to MongoDB', error)
    throw error
  }
}

async function retry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying operation. Attempts left: ${retries - 1}`)
      return retry(operation, retries - 1)
    }
    throw error
  }
}

interface AnalyticsEvent {
  eventType: 'pageview' | 'click' | 'timeSpent'
  data: {
    page: string
    timestamp: string
    timeSpent?: number
    clicks?: number
  }
}

export async function POST(request: NextRequest) {
  const event: AnalyticsEvent = await request.json()
  console.log('Received event:', event.eventType, 'Data:', event.data)
  try {
    const database = await retry(connectToDatabase)
    const collection = database.collection('events')
    await collection.insertOne(event)
    console.log('Event recorded in MongoDB')
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
    const database = await retry(connectToDatabase)
    const collection = database.collection('events')

    const [pageviews, clicks, timeSpent] = await Promise.all([
      collection
        .aggregate([
          { $match: { eventType: 'pageview' } },
          { $group: { _id: '$data.page', views: { $sum: 1 } } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { eventType: 'click' } },
          { $group: { _id: '$data.page', clicks: { $sum: '$data.clicks' } } },
        ])
        .toArray(),
      collection
        .aggregate([
          { $match: { eventType: 'timeSpent' } },
          {
            $group: {
              _id: '$data.page',
              totalTime: { $sum: '$data.timeSpent' },
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
    ])

    const pageViews = pageviews.map((pv) => {
      const clickData = clicks.find((c) => c._id === pv._id)
      const timeData = timeSpent.find((t) => t._id === pv._id)
      return {
        page: pv._id,
        views: pv.views,
        clicks: clickData ? clickData.clicks : 0,
        avgTimeSpent: timeData ? timeData.totalTime / timeData.count : 0,
      }
    })

    pageViews.sort((a, b) => b.views - a.views)

    console.log('Analytics data fetched successfully')
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
