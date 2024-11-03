'use client'
// app/analytics/page.js
import AutoHidingHeader from '@/components/AutoHidingHeader'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <AutoHidingHeader />
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">访问分析面板</h1>
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
