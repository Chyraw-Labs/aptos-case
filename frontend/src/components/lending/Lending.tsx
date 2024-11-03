/* eslint-disable react-hooks/exhaustive-deps */
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
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { ToggleRight, ToggleLeft } from 'lucide-react'

interface User {
  id: number
  name: string
  balances: { [key: string]: number }
  borrowed: { [key: string]: number }
  collateral: { [key: string]: number }
}

interface Asset {
  symbol: string
  name: string
  price: number
  depositAPY: number
  borrowAPY: number
  utilizationRate: number
  totalDeposits: number
  totalBorrows: number
}

interface PoolData {
  totalValueLocked: number
  totalBorrows: number
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const LendingVisualization = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: '张三',
      balances: { USDT: 10000, APT: 5 },
      borrowed: { USDT: 0, APT: 0 },
      collateral: { USDT: 0, APT: 0 },
    },
    {
      id: 2,
      name: '李四',
      balances: { USDT: 5000, APT: 2 },
      borrowed: { USDT: 2000, APT: 0 },
      collateral: { USDT: 3000, APT: 1 },
    },
    {
      id: 3,
      name: '王五',
      balances: { USDT: 20000, APT: 10 },
      borrowed: { USDT: 5000, APT: 1 },
      collateral: { USDT: 10000, APT: 3 },
    },
  ])

  const [assets, setAssets] = useState<Asset[]>([
    {
      symbol: 'USDT',
      name: 'Tether USD',
      price: 1,
      depositAPY: 0.05,
      borrowAPY: 0.08,
      utilizationRate: 0.6,
      totalDeposits: 35000,
      totalBorrows: 21000,
    },
    {
      symbol: 'APT',
      name: 'Ethereum',
      price: 2000,
      depositAPY: 0.03,
      borrowAPY: 0.05,
      utilizationRate: 0.4,
      totalDeposits: 17,
      totalBorrows: 6.8,
    },
  ])

  const [activeUser, setActiveUser] = useState(1)
  const [selectedAsset, setSelectedAsset] = useState('USDT')
  const [action, setAction] = useState<
    'deposit' | 'withdraw' | 'borrow' | 'repay'
  >('deposit')
  const [amount, setAmount] = useState('')
  const [pool, setPool] = useState<PoolData>({
    totalValueLocked: 69000,
    totalBorrows: 34600,
  })
  const [historyData, setHistoryData] = useState<
    {
      time: string
      utilizationRate: number
      depositAPY: number
      borrowAPY: number
    }[]
  >([])

  const [isLiveUpdate, setIsLiveUpdate] = useState(true)

  useEffect(() => {
    updatePoolData()
    addHistoryDataPoint()
    let interval: NodeJS.Timeout | null = null

    if (isLiveUpdate) {
      interval = setInterval(() => {
        updateAssetPrices()
        updateAPYs()
        checkLiquidations()
      }, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [users, assets, isLiveUpdate])

  // 添加工具提示功能
  useEffect(() => {
    const tooltip = document.getElementById('tooltip')
    const tooltipText = document.getElementById('tooltipText')

    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement
      if (target.dataset.tooltip) {
        tooltipText!.textContent = target.dataset.tooltip
        tooltip!.style.display = 'block'
        const rect = target.getBoundingClientRect()
        tooltip!.style.left = `${rect.left}px`
        tooltip!.style.top = `${rect.bottom + 5}px`
      }
    })

    document.addEventListener('mouseout', () => {
      tooltip!.style.display = 'none'
    })
  }, [])

  const updatePoolData = () => {
    const totalValueLocked = assets.reduce(
      (sum, asset) => sum + asset.totalDeposits * asset.price,
      0
    )
    const totalBorrows = assets.reduce(
      (sum, asset) => sum + asset.totalBorrows * asset.price,
      0
    )
    setPool({ totalValueLocked, totalBorrows })
  }

  const addHistoryDataPoint = () => {
    const asset = assets.find((a) => a.symbol === selectedAsset)
    if (asset) {
      setHistoryData((prev) =>
        [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            utilizationRate: asset.utilizationRate,
            depositAPY: asset.depositAPY,
            borrowAPY: asset.borrowAPY,
          },
        ].slice(-20)
      )
    }
  }

  const toggleLiveUpdate = () => {
    setIsLiveUpdate((prev) => !prev)
  }

  const updateAssetPrices = () => {
    setAssets((prev) =>
      prev.map((asset) => ({
        ...asset,
        price: asset.price * (1 + (Math.random() - 0.5) * 0.1), // 价格波动范围增加到 ±5%
      }))
    )
  }

  const updateAPYs = () => {
    setAssets((prev) =>
      prev.map((asset) => {
        const newUtilizationRate = asset.totalBorrows / asset.totalDeposits
        const newDepositAPY = 0.01 + newUtilizationRate * 0.1 // 简化的利率模型
        const newBorrowAPY = newDepositAPY * 1.5
        return {
          ...asset,
          utilizationRate: newUtilizationRate,
          depositAPY: newDepositAPY,
          borrowAPY: newBorrowAPY,
        }
      })
    )
  }

  const checkLiquidations = () => {
    setUsers((prev) =>
      prev.map((user) => {
        let totalCollateralValue = 0
        let totalBorrowValue = 0
        assets.forEach((asset) => {
          totalCollateralValue +=
            (user.collateral[asset.symbol] || 0) * asset.price
          totalBorrowValue += (user.borrowed[asset.symbol] || 0) * asset.price
        })
        const healthFactor = totalCollateralValue / totalBorrowValue
        if (healthFactor < 1.2) {
          // 如果健康因子低于1.2，进行清算
          return {
            ...user,
            borrowed: {},
            collateral: {},
            balances: {
              ...user.balances,
              USDT:
                (user.balances.USDT || 0) +
                totalCollateralValue -
                totalBorrowValue,
            },
          }
        }
        return user
      })
    )
  }

  const handleAction = () => {
    const value = parseFloat(amount)
    if (isNaN(value) || value <= 0) return

    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === activeUser) {
          const asset = assets.find((a) => a.symbol === selectedAsset)
          if (!asset) return user

          switch (action) {
            case 'deposit':
              if (user.balances[selectedAsset] >= value) {
                return {
                  ...user,
                  balances: {
                    ...user.balances,
                    [selectedAsset]: user.balances[selectedAsset] - value,
                  },
                  collateral: {
                    ...user.collateral,
                    [selectedAsset]:
                      (user.collateral[selectedAsset] || 0) + value,
                  },
                }
              }
              break
            case 'withdraw':
              if (user.collateral[selectedAsset] >= value) {
                return {
                  ...user,
                  balances: {
                    ...user.balances,
                    [selectedAsset]:
                      (user.balances[selectedAsset] || 0) + value,
                  },
                  collateral: {
                    ...user.collateral,
                    [selectedAsset]: user.collateral[selectedAsset] - value,
                  },
                }
              }
              break
            case 'borrow':
              const totalCollateralValue = Object.entries(
                user.collateral
              ).reduce((sum, [symbol, amount]) => {
                const assetPrice =
                  assets.find((a) => a.symbol === symbol)?.price || 0
                return sum + amount * assetPrice
              }, 0)
              const totalBorrowValue = Object.entries(user.borrowed).reduce(
                (sum, [symbol, amount]) => {
                  const assetPrice =
                    assets.find((a) => a.symbol === symbol)?.price || 0
                  return sum + amount * assetPrice
                },
                0
              )
              if (
                totalCollateralValue * 0.8 >=
                totalBorrowValue + value * asset.price
              ) {
                return {
                  ...user,
                  balances: {
                    ...user.balances,
                    [selectedAsset]:
                      (user.balances[selectedAsset] || 0) + value,
                  },
                  borrowed: {
                    ...user.borrowed,
                    [selectedAsset]:
                      (user.borrowed[selectedAsset] || 0) + value,
                  },
                }
              }
              break
            case 'repay':
              if (
                user.balances[selectedAsset] >= value &&
                user.borrowed[selectedAsset] >= value
              ) {
                return {
                  ...user,
                  balances: {
                    ...user.balances,
                    [selectedAsset]: user.balances[selectedAsset] - value,
                  },
                  borrowed: {
                    ...user.borrowed,
                    [selectedAsset]: user.borrowed[selectedAsset] - value,
                  },
                }
              }
              break
          }
        }
        return user
      })
    )

    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.symbol === selectedAsset) {
          switch (action) {
            case 'deposit':
            case 'withdraw':
              return {
                ...asset,
                totalDeposits:
                  asset.totalDeposits + (action === 'deposit' ? value : -value),
              }
            case 'borrow':
            case 'repay':
              return {
                ...asset,
                totalBorrows:
                  asset.totalBorrows + (action === 'borrow' ? value : -value),
              }
          }
        }
        return asset
      })
    )

    setAmount('')
  }

  const calculateUserTVL = (user: User) => {
    return Object.entries(user.balances).reduce((sum, [symbol, amount]) => {
      const asset = assets.find((a) => a.symbol === symbol)
      return sum + (asset ? amount * asset.price : 0)
    }, 0)
  }

  const calculateUserDebt = (user: User) => {
    return Object.entries(user.borrowed).reduce((sum, [symbol, amount]) => {
      const asset = assets.find((a) => a.symbol === symbol)
      return sum + (asset ? amount * asset.price : 0)
    }, 0)
  }

  const pieChartData = [
    { name: '总存款', value: pool.totalValueLocked - pool.totalBorrows },
    { name: '总借款', value: pool.totalBorrows },
  ]

  return (
    <div className="flex flex-col p-4 space-y-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Lending 可视化</h1>

      <div className="grid grid-cols-3 gap-4">
        {/* 用户操作 */}
        <div className="bg-white bg-opacity-10 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">用户操作</h2>
          <div className="mb-4">
            <label className="block mb-2">选择用户：</label>
            <select
              className="w-full p-2 bg-white bg-opacity-20 rounded"
              value={activeUser}
              onChange={(e) => setActiveUser(parseInt(e.target.value))}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">选择资产：</label>
            <select
              className="w-full p-2 bg-white bg-opacity-20 rounded"
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              {assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">操作：</label>
            <select
              className="w-full p-2 bg-white bg-opacity-20 rounded"
              value={action}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setAction(e.target.value as any)}
            >
              <option value="deposit">存款</option>
              <option value="withdraw">取款</option>
              <option value="borrow">借款</option>
              <option value="repay">还款</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">金额：</label>
            <input
              type="number"
              className="w-full p-2 b bg-white bg-opacity-20 rounded text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            className="w-full p-2 bg-block border rounded hover:bg-white hover:text-black"
            onClick={handleAction}
          >
            执行操作
          </button>
          {/* 添加实时更新开关 */}
          <div className="flex items-center justify-start mt-4 mb-4">
            <span className="mr-2">实时价格更新</span>
            <button
              onClick={toggleLiveUpdate}
              className={`p-2 rounded-full ${
                isLiveUpdate ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isLiveUpdate ? (
                <ToggleRight size={24} />
              ) : (
                <ToggleLeft size={24} />
              )}
            </button>
          </div>
        </div>

        {/* 用户信息 */}
        <div className="bg-white bg-opacity-10  p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-4">用户信息</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className={`mb-4 p-2 rounded ${
                user.id === activeUser
                  ? 'bg-cyan-900'
                  : 'bg-white bg-opacity-20'
              }`}
            >
              <h3 className="font-bold">{user.name}</h3>
              <p>总资产价值: ${calculateUserTVL(user).toFixed(2)}</p>
              <p>总借款: ${calculateUserDebt(user).toFixed(2)}</p>
              <p>
                健康因子:{' '}
                {(
                  calculateUserTVL(user) / (calculateUserDebt(user) || 1)
                ).toFixed(2)}
              </p>
              <div className="mt-2">
                <h4 className="font-semibold">资产明细:</h4>
                {Object.entries(user.balances).map(([symbol, amount]) => (
                  <p key={symbol}>
                    {symbol}: {amount.toFixed(2)}
                  </p>
                ))}
              </div>
              <div className="mt-2">
                <h4 className="font-semibold">借款明细:</h4>
                {Object.entries(user.borrowed).map(([symbol, amount]) => (
                  <p key={symbol}>
                    {symbol}: {amount.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 资产信息 */}
        <div className="bg-white bg-opacity-10 p-4 rounded-lg ">
          <h2 className="text-xl font-bold mb-4">资产信息</h2>
          {assets.map((asset) => (
            <div
              key={asset.symbol}
              className="mb-4 p-2 bg-white bg-opacity-20 rounded"
            >
              <h3 className="font-bold">
                {asset.name} ({asset.symbol})
              </h3>
              <p>价格: ${asset.price.toFixed(2)}</p>
              <p>存款 APY: {(asset.depositAPY * 100).toFixed(2)}%</p>
              <p>借款 APY: {(asset.borrowAPY * 100).toFixed(2)}%</p>
              <p>利用率: {(asset.utilizationRate * 100).toFixed(2)}%</p>
              <p>
                总存款: {asset.totalDeposits.toFixed(2)} {asset.symbol}
              </p>
              <p>
                总借款: {asset.totalBorrows.toFixed(2)} {asset.symbol}
              </p>
            </div>
          ))}
          <h2 className="text-xl font-bold mb-4">市场概览</h2>
          <div className="mb-4 p-2 bg-white bg-opacity-20  rounded">
            {/* <div className="grid grid-cols-2 gap-4"> */}
            <div>
              <p>总锁仓价值 (TVL): ${pool.totalValueLocked.toFixed(2)}</p>
              <p>总借款: ${pool.totalBorrows.toFixed(2)}</p>
              <p>
                平台利用率:{' '}
                {((pool.totalBorrows / pool.totalValueLocked) * 100).toFixed(2)}
                %
              </p>
            </div>
            {/* 市场概况 */}
            <div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* 历史数据图表 */}
      <div className="w-full bg-white bg-opacity-10 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">历史数据 ({selectedAsset})</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="utilizationRate"
              stroke="#8884d8"
              name="利用率"
            />
            <Line
              type="monotone"
              dataKey="depositAPY"
              stroke="#82ca9d"
              name="存款 APY"
            />
            <Line
              type="monotone"
              dataKey="borrowAPY"
              stroke="#ffc658"
              name="借款 APY"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 风险指标 */}
      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">风险指标</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-2 bg-white bg-opacity-20  rounded">
            <h3 className="font-bold">清算阈值</h3>
            <p>当健康因子低于 1.2 时，用户将面临清算风险</p>
          </div>
          <div className="p-2 bg-white bg-opacity-20  rounded">
            <h3 className="font-bold">最大借款率</h3>
            <p>用户可借入其抵押品价值的最高 80%</p>
          </div>
          <div className="p-2 bg-white bg-opacity-20  rounded">
            <h3 className="font-bold">价格波动</h3>
            <p>资产价格每 5 秒更新一次，波动范围为 ±1%</p>
          </div>
        </div>
      </div>

      {/* 操作说明 */}
      <div className="bg-black p-4 bg-opacity-10 rounded-lg">
        <h2 className="text-xl font-bold mb-4">操作说明</h2>
        <ul className="list-disc pl-5">
          <li>存款：将资产存入平台，赚取存款利息</li>
          <li>取款：从平台提取您的资产</li>
          <li>借款：使用抵押品借入其他资产，需要支付借款利息</li>
          <li>还款：偿还您借入的资产</li>
        </ul>
        <p className="mt-2">
          注意：请密切关注您的健康因子，保持在 1.2 以上以避免被清算。
        </p>
      </div>

      {/* 工具提示 */}
      <div
        className="fixed bottom-4 right-4 bg-black p-4 rounded-lg shadow-lg"
        id="tooltip"
        style={{ display: 'none' }}
      >
        <p id="tooltipText"></p>
      </div>
    </div>
  )
}

export default LendingVisualization
