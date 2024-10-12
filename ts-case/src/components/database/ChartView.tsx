import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'

interface ChartViewProps {
  data: Array<{ name: string; progress: number }>
}

const ChartView: React.FC<ChartViewProps> = ({ data }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  return (
    <div className="w-full p-6 backdrop-blur-xl bg-white bg-opacity-20 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl border border-white border-opacity-20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Progress Chart
      </h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            className="text-gray-600"
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis
              dataKey="name"
              tick={{
                fill: '#fff', // Tailwind's gray-600
                fontSize: 16,
                fontWeight: 500,
              }}
              axisLine={{ stroke: '#9CA3AF' }} // Tailwind's gray-400
              tickLine={{ stroke: '#9CA3AF' }} // Tailwind's gray-400
              dy={10} // Adjust the distance of labels from the axis
              className="text-sm font-medium"
            />
            <YAxis
              tick={{
                fill: '#fff', // Tailwind's gray-600
                fontSize: 16,
                fontWeight: 500,
              }}
              axisLine={{ stroke: '#9CA3AF' }} // Tailwind's gray-400
              tickLine={{ stroke: '#9CA3AF' }} // Tailwind's gray-400
              dx={-10} // Adjust the distance of labels from the axis
              className="text-sm font-medium"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              labelStyle={{ color: '#1F2937', fontWeight: 'bold' }}
              itemStyle={{ color: '#4B5563' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
              }}
            />
            <Bar
              dataKey="progress"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartView
