'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  ArrowRightLeft,
  UserCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
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

interface User {
  id: number
  name: string
  apt: number
  btc: number
}

interface ChartDataPoint {
  time: string
  poolAPT: number
  poolBTC: number
  [key: string]: number | string
}

interface Transaction {
  user: string
  fromCoin: string
  toCoin: string
  fromAmount: number
  toAmount: number
  timestamp: Date
}

interface MarketData {
  aptPrice: number
  btcPrice: number
  volumeAPT24h: number
  volumeBTC24h: number
  priceChange24h: number
}

const SwapDebug = () => {
  const [pool, setPool] = useState({ apt: 1000, btc: 1200 })
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Alice', apt: 350, btc: 100 },
    { id: 2, name: 'Bob', apt: 200, btc: 250 },
    { id: 3, name: 'Tom', apt: 150, btc: 300 },
  ])
  const [activeUser, setActiveUser] = useState(1)
  const [input, setInput] = useState({ amount: '', direction: 'aptToBTC' })
  const [output, setOutput] = useState({ amount: 0 })
  const [expectedOutput, setExpectedOutput] = useState(0)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  )
  const [marketData, setMarketData] = useState<MarketData>({
    aptPrice: 1,
    btcPrice: 2,
    volumeAPT24h: 0,
    volumeBTC24h: 0,
    priceChange24h: 2.5,
  })

  const updateChartData = useCallback(() => {
    const newDataPoint = {
      time: new Date().toLocaleTimeString(),
      poolAPT: pool.apt,
      poolBTC: pool.btc,
      ...users.reduce(
        (acc, user) => ({
          ...acc,
          [`${user.name}APT`]: user.apt,
          [`${user.name}BTC`]: user.btc,
        }),
        {}
      ),
    }
    setChartData((prevData) => [...prevData.slice(-19), newDataPoint])
  }, [pool, users])

  const calculateExpectedOutput = useCallback(() => {
    const inAmount = parseFloat(input.amount)
    if (isNaN(inAmount) || inAmount <= 0) {
      setExpectedOutput(0)
      return
    }
    const isAPT = input.direction === 'aptToBTC'
    const inPool = isAPT ? pool.apt : pool.btc
    const outPool = isAPT ? pool.btc : pool.apt
    const expected = Math.floor((inAmount * outPool) / (inPool + inAmount))
    setExpectedOutput(expected)
  }, [input, pool])

  useEffect(() => {
    updateChartData()
  }, [updateChartData])

  useEffect(() => {
    calculateExpectedOutput()
  }, [calculateExpectedOutput])

  useEffect(() => {
    const interval = setInterval(() => {
      updateRecentTransactions()
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const updateRecentTransactions = () => {
    setRecentTransactions((prev) =>
      prev.filter(
        (t) =>
          new Date().getTime() - t.timestamp.getTime() <= 24 * 60 * 60 * 1000
      )
    )
  }

  const calculateVolume24h = () => {
    const volumeAPT = recentTransactions.reduce(
      (sum, t) =>
        sum +
        (t.fromCoin === 'APT'
          ? t.fromAmount
          : t.toCoin === 'APT'
          ? t.toAmount
          : 0),
      0
    )
    const volumeBTC = recentTransactions.reduce(
      (sum, t) =>
        sum +
        (t.fromCoin === 'BTC'
          ? t.fromAmount
          : t.toCoin === 'BTC'
          ? t.toAmount
          : 0),
      0
    )
    return { volumeAPT, volumeBTC }
  }

  const handleSwap = () => {
    const inAmount = parseInt(input.amount)
    const isAPT = input.direction === 'aptToBTC'
    const inPool = isAPT ? pool.apt : pool.btc
    const outPool = isAPT ? pool.btc : pool.apt

    const outAmount = Math.floor((inAmount * outPool) / (inPool + inAmount))
    setOutput({ amount: outAmount })

    setPool((prev) => ({
      apt: isAPT ? prev.apt + inAmount : prev.apt - outAmount,
      btc: isAPT ? prev.btc - outAmount : prev.btc + inAmount,
    }))

    const activeUserObj = users.find((user) => user.id === activeUser)
    if (activeUserObj) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === activeUser
            ? {
                ...user,
                apt: isAPT ? user.apt - inAmount : user.apt + outAmount,
                btc: isAPT ? user.btc + outAmount : user.btc - inAmount,
              }
            : user
        )
      )

      const newTransaction = {
        user: activeUserObj.name,
        fromCoin: isAPT ? 'APT' : 'BTC',
        toCoin: isAPT ? 'BTC' : 'APT',
        fromAmount: inAmount,
        toAmount: outAmount,
        timestamp: new Date(),
      }

      setTransactions((prev) => [...prev, newTransaction])
      setRecentTransactions((prev) => [...prev, newTransaction])

      // Update market data
      const newAptPrice = pool.btc / pool.apt
      const priceChange =
        ((newAptPrice - marketData.aptPrice) / marketData.aptPrice) * 100
      const { volumeAPT, volumeBTC } = calculateVolume24h()
      setMarketData((prev) => ({
        ...prev,
        aptPrice: newAptPrice,
        btcPrice: 1 / newAptPrice,
        volumeAPT24h: volumeAPT,
        volumeBTC24h: volumeBTC,
        priceChange24h: priceChange,
      }))
    }
  }

  const generateSummary = () => {
    if (transactions.length === 0) {
      return '当前没有发生交易.'
    }

    const latestTransaction = transactions[transactions.length - 1]
    const { volumeAPT, volumeBTC } = calculateVolume24h()

    return (
      <div>
        <h3 className="font-bold mb-2">最新的交易</h3>
        <p>{`${latestTransaction.user} swapped ${latestTransaction.fromAmount} ${latestTransaction.fromCoin} for ${latestTransaction.toAmount} ${latestTransaction.toCoin}`}</p>
        <h3 className="font-bold mt-4 mb-2">市场概览</h3>
        <p>{`当前 APT 价格: ${marketData.aptPrice.toFixed(4)} BTC`}</p>
        <p>{`当前 BTC 价格: ${marketData.btcPrice.toFixed(4)} APT`}</p>
        <p>{`24小时 APT 交易量: ${volumeAPT.toFixed(2)} APT`}</p>
        <p>{`24小时 BTC 交易量: ${volumeBTC.toFixed(2)} BTC`}</p>
        <p className="flex items-center">
          24小时价格变化:
          {marketData.priceChange24h > 0 ? (
            <TrendingUp className="ml-1 text-green-500" />
          ) : (
            <TrendingDown className="ml-1 text-red-500" />
          )}
          {`${Math.abs(marketData.priceChange24h).toFixed(2)}%`}
        </p>
        <h3 className="font-bold mt-4 mb-2">Pool Status（质押池状态）</h3>
        <p>{`APT in pool: ${pool.apt}`}</p>
        <p>{`BTC in pool: ${pool.btc}`}</p>
        <h3 className="font-bold mt-4 mb-2">最近交易（近24小时）</h3>
        <ul className="text-sm">
          {recentTransactions
            .slice(-5)
            .reverse()
            .map((t, index) => (
              <li
                key={index}
              >{`${t.user}: ${t.fromAmount} ${t.fromCoin} → ${t.toAmount} ${t.toCoin}`}</li>
            ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="flex space-x-4">
        {/* 左上方的 swap */}
        <div className="w-1/2 bg-white bg-opacity-10 p-4 rounded-lg shadow">
          <h1 className="text-xl font-bold mb-4 text-white">Swap 可视化</h1>
          <div className="flex justify-between mb-4 text-white">
            <div>
              <h2 className="text-lg font-bold">Pool（质押池）</h2>
              <h3 className="text-sm font-bold">数量</h3>
              <p>APT: {pool.apt} 个</p>
              <p>BTC: {pool.btc} 个</p>
              <h3 className="text-sm font-bold">价格</h3>
              <p>APT: {marketData.aptPrice} $</p>
              <p>BTC: {marketData.btcPrice} $</p>
            </div>

            <div>
              <h3 className="font-bold">Users（用户）</h3>
              {users.map((user) => (
                <div key={user.id} className="flex items-center mb-2">
                  <button
                    className={`flex items-center mr-2 px-2 py-1 rounded ${
                      activeUser === user.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                    onClick={() => setActiveUser(user.id)}
                  >
                    <UserCircle className="mr-1 h-4 w-4" />
                    {user.name}
                  </button>
                  <span className="text-sm">
                    APT: {user.apt}, BTC: {user.btc}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-bold text-white">Swap</h3>
            <input
              type="number"
              value={input.amount}
              onChange={(e) => setInput({ ...input, amount: e.target.value })}
              placeholder="Amount"
              className="w-full p-2 border rounded mb-2 text-black"
            />
            <p className="text-sm text-gray-300 mb-2">
              预期输出: {expectedOutput}{' '}
              {input.direction === 'aptToBTC' ? 'BTC' : 'APT'}
            </p>
            <button
              onClick={() =>
                setInput((prev) => ({
                  ...prev,
                  direction:
                    prev.direction === 'aptToBTC' ? 'btcToAPT' : 'aptToBTC',
                }))
              }
              className="flex items-center justify-center w-full p-2 bg-gray-600 rounded mb-2 text-white"
            >
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              {input.direction === 'aptToBTC' ? 'APT to BTC' : 'BTC to APT'}
            </button>
            <button
              onClick={handleSwap}
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Swap
            </button>
          </div>
          <div className="text-white">
            <h3 className="font-bold">输出</h3>
            <p>数量: {output.amount}</p>
          </div>
        </div>
        {/* 右上方的交易摘要 */}
        <div className="w-1/2  bg-white bg-opacity-10 p-4 rounded-lg shadow text-white">
          <h2 className="text-xl font-bold mb-4">交易概述</h2>
          <div className="text-sm">{generateSummary()}</div>
        </div>
      </div>
      {/* 下方的曲线 */}
      <div className="w-full bg-white bg-opacity-10 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-white">
          Real-time State Chart
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="poolAPT"
              stroke="#8884d8"
              name="Pool APT"
            />
            <Line
              type="monotone"
              dataKey="poolBTC"
              stroke="#82ca9d"
              name="Pool BTC"
            />
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <Line
                  type="monotone"
                  dataKey={`${user.name}APT`}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                  name={`${user.name} APT`}
                />
                <Line
                  type="monotone"
                  dataKey={`${user.name}BTC`}
                  stroke={`#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`}
                  name={`${user.name} BTC`}
                />
              </React.Fragment>
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SwapDebug
