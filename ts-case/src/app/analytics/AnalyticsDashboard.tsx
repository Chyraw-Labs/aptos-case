'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface PageAnalytics {
  page: string
  views: number
  clicks: number
  avgTimeSpent: number
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<PageAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics')
        if (!response.ok) {
          throw new Error('获取分析数据失败')
        }
        const data: { pageViews: PageAnalytics[] } = await response.json()
        console.log('Fetched analytics data:', data)
        setAnalyticsData(data.pageViews)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching analytics data:', err)
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">页面分析</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={analyticsData}>
          <XAxis dataKey="page" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="views" fill="#8884d8" name="浏览量" />
          <Bar yAxisId="left" dataKey="clicks" fill="#82ca9d" name="点击数" />
          <Bar
            yAxisId="right"
            dataKey="avgTimeSpent"
            fill="#ffc658"
            name="平均停留时间（秒）"
          />
        </BarChart>
      </ResponsiveContainer>

      <h3 className="text-lg font-semibold mt-8 mb-4">详细数据</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-lg">
          <thead className="bg-whtie bg-opacity-10 backdrop-blur-lg rounded-lg">
            <tr>
              <th className="px-4 py-2 text-left">页面</th>
              <th className="px-4 py-2 text-left">浏览量</th>
              <th className="px-4 py-2 text-left">点击数</th>
              <th className="px-4 py-2 text-left">平均停留时间（秒）</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map((page, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? 'bg-white bg-opacity-10 backdrop-blur-lg rounded-lg'
                    : 'bg-white bg-opacity-20 backdrop-blur-lg rounded-lg'
                }
              >
                <td className="px-4 py-2">{page.page}</td>
                <td className="px-4 py-2">{page.views}</td>
                <td className="px-4 py-2">{page.clicks}</td>
                <td className="px-4 py-2">{page.avgTimeSpent.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
