'use client'
import React, { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Lock, Unlock, TrendingUp } from 'lucide-react'
import BigNumber from 'bignumber.js'

interface CardProps {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
    {children}
  </div>
)

interface ChartDataPoint {
  day: number
  locked: number
  released: number
}

const LockupContractDashboard: React.FC = () => {
  const [lockedAmount] = useState<BigNumber>(new BigNumber(1000000))
  const [releasedAmount, setReleasedAmount] = useState<BigNumber>(
    new BigNumber(0)
  )
  const [lockupPeriod] = useState<number>(365) // days
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + 1
        if (newTime > lockupPeriod) {
          clearInterval(timer)
        }
        return newTime
      })
    }, 1000) // Update every second for demo purposes
    return () => clearInterval(timer)
  }, [lockupPeriod])

  useEffect(() => {
    const releaseRate = lockedAmount.dividedBy(lockupPeriod)
    const newReleasedAmount = BigNumber.minimum(
      releaseRate.multipliedBy(currentTime),
      lockedAmount
    )
    setReleasedAmount(newReleasedAmount)
    setChartData((prevData) => [
      ...prevData,
      {
        day: currentTime,
        locked: lockedAmount.minus(newReleasedAmount).toNumber(),
        released: newReleasedAmount.toNumber(),
      },
    ])
  }, [currentTime, lockedAmount, lockupPeriod])

  const formatAmount = (amount: BigNumber): string => {
    return amount.toFormat(0)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-black">
      <h1 className="text-2xl font-bold mb-4">锁仓合约仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-black bg-opacity-10">
          <div className=" flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">锁定的数量</h2>
            <Lock className="text-blue-500" />
          </div>
          <p className="text-3xl font-bold">
            {formatAmount(lockedAmount.minus(releasedAmount))}
          </p>
        </Card>
        <Card className="bg-black bg-opacity-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">发布的数量</h2>
            <Unlock className="text-green-500" />
          </div>
          <p className="text-3xl font-bold">{formatAmount(releasedAmount)}</p>
        </Card>
        <Card className="bg-black bg-opacity-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">进程</h2>
            <TrendingUp className="text-purple-500" />
          </div>
          <p className="text-3xl font-bold">
            {Math.min(
              100,
              ((currentTime / lockupPeriod) * 100).toFixed(
                2
              ) as unknown as number
            )}
            %
          </p>
        </Card>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">随着时间推移发行的 Token</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="locked"
              stroke="#3b82f6"
              name="锁定的 Token"
            />
            <Line
              type="monotone"
              dataKey="released"
              stroke="#10b981"
              name="发行的 Tokens"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default LockupContractDashboard
