/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, {
  useState,
  useEffect,
  ReactNode,
  Component,
  ErrorInfo,
} from 'react'

import {
  Users,
  Vote,
  Coins,
  UserPlus,
  UserMinus,
  UserX,
  Plus,
  Minus,
  Play,
  Pause,
  BookOpen,
  // BarChart,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { DAOProcessFlow } from './DAOProcessFlow'

type Proposal = {
  id: number
  title: string
  votes: number
  totalVotes: number
  status: string
  type: string
  quorum: number
}

const DAOGovernanceDashboard = () => {
  const [members, setMembers] = useState(1234)
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: 1,
      title: '增加质押奖励',
      votes: 7500,
      totalVotes: 10000,
      status: '进行中',
      type: '财务',
      quorum: 6000,
    },
    {
      id: 2,
      title: '更新治理规则',
      votes: 6000,
      totalVotes: 10000,
      status: '进行中',
      type: '治理',
      quorum: 7000,
    },
    {
      id: 3,
      title: '启动新的DeFi项目',
      votes: 8000,
      totalVotes: 10000,
      status: '已通过',
      type: '项目',
      quorum: 5000,
    },
  ])
  const [treasury, setTreasury] = useState(500000)
  const [tokenPrice, setTokenPrice] = useState(3.5)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenSupply, setTokenSupply] = useState(10000000)
  const [isSimulationOn, setIsSimulationOn] = useState(false)
  const [newProposalTitle, setNewProposalTitle] = useState('')
  const [historicalData, setHistoricalData] = useState([
    { name: '1天前', members: 1200, treasury: 495000, tokenPrice: 3.4 },
    { name: '现在', members: 1234, treasury: 500000, tokenPrice: 3.5 },
  ])

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  )
  const [tokenDistribution, setTokenDistribution] = useState([
    { name: '流通', value: 6000000 },
    { name: '质押', value: 3000000 },
    { name: '锁定', value: 1000000 },
  ])
  const [memberRoles, setMemberRoles] = useState([
    { role: '普通成员', count: 1000 },
    { role: '核心贡献者', count: 200 },
    { role: '理事会成员', count: 30 },
    { role: '管理员', count: 4 },
  ])

  const [fundAllocation, setFundAllocation] = useState([
    { category: '研发', current: 200000, planned: 250000 },
    { category: '市场营销', current: 150000, planned: 180000 },
    { category: '运营', current: 100000, planned: 120000 },
    { category: '社区激励', current: 50000, planned: 70000 },
  ])

  // 模拟资金分配变化
  const simulateFundAllocationChange = () => {
    setFundAllocation((prev) =>
      prev.map((item) => ({
        ...item,
        current: Math.min(
          item.current + Math.floor(Math.random() * 10000),
          item.planned
        ),
      }))
    )
  }

  class ErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
  > {
    constructor(props: { children: ReactNode }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(_: Error) {
      return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.log('Uncaught error:', error, errorInfo)
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>
      }

      return this.props.children
    }
  }

  let interval: NodeJS.Timeout | null = null

  useEffect(() => {
    if (isSimulationOn) {
      interval = setInterval(() => {
        simulateDAOActivities()
      }, 5000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSimulationOn])

  // useEffect(() => {
  //   let interval
  //   if (isSimulationOn) {
  //     interval = setInterval(() => {
  //       simulateDAOActivities()
  //     }, 5000)
  //   }
  //   return () => clearInterval(interval)
  // }, [isSimulationOn])

  const simulateDAOActivities = () => {
    // 模拟成员变动
    setMembers((prev) => {
      const change = Math.floor(Math.random() * 21) - 10
      return Math.max(0, prev + change)
    })

    // 模拟提案投票
    setProposals((prev) =>
      prev.map((proposal) => {
        if (proposal.status === '进行中') {
          const newVotes = Math.min(
            proposal.totalVotes,
            proposal.votes + Math.floor(Math.random() * 100)
          )
          return {
            ...proposal,
            votes: newVotes,
            status: newVotes >= proposal.quorum ? '已通过' : '进行中',
          }
        }
        return proposal
      })
    )

    // 模拟金库余额变化
    setTreasury((prev) =>
      Math.max(0, prev + Math.floor(Math.random() * 10000) - 5000)
    )

    // 模拟代币价格波动
    setTokenPrice((prev) => Math.max(0, prev + (Math.random() - 0.5) * 0.2))

    // 更新历史数据
    setHistoricalData((prev) => {
      const newData = [
        ...prev,
        {
          name: new Date().toLocaleTimeString(),
          members,
          treasury,
          tokenPrice,
        },
      ]
      return newData.slice(-10)
    })

    // 模拟代币分配变化
    setTokenDistribution((prev) => {
      const change = Math.floor(Math.random() * 100000)
      return prev.map((item, index) => ({
        ...item,
        value: index === 0 ? item.value - change : item.value + change,
      }))
    })

    // 模拟成员角色变化
    setMemberRoles((prev) => {
      const roleChange = Math.floor(Math.random() * 10) - 5
      return prev.map((item, index) => ({
        ...item,
        count: index === 0 ? item.count + roleChange : item.count,
      }))
    })
  }

  const handleAddMember = () => setMembers((prev) => prev + 1)
  const handleRemoveMember = () => setMembers((prev) => Math.max(0, prev - 1))
  const handleKickMember = () =>
    setMembers((prev) => Math.max(0, prev - Math.floor(Math.random() * 5)))

  const handleAddProposal = () => {
    if (newProposalTitle.trim()) {
      const newProposal: Proposal = {
        id: Date.now(),
        title: newProposalTitle,
        votes: 0,
        totalVotes: 10000,
        status: '进行中',
        type: ['财务', '治理', '项目'][Math.floor(Math.random() * 3)],
        quorum: 5000 + Math.floor(Math.random() * 2000),
      }
      setProposals((prev) => [...prev, newProposal])
      setNewProposalTitle('')
    }
  }

  const handleRemoveProposal = (id: number) => {
    setProposals((prev) => prev.filter((proposal) => proposal.id !== id))
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  const [showProposalModal, setShowProposalModal] = useState(false)
  const renderProposalModal = () => {
    if (!selectedProposal) return null
    return (
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
        onClick={() => setShowProposalModal(false)}
      >
        <div
          className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white bg-opacity-10 "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-black">
              {selectedProposal.title}
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-sm text-gray-500">
                类型: {selectedProposal.type}
                <br />
                状态: {selectedProposal.status}
                <br />
                当前票数: {selectedProposal.votes}
                <br />
                所需票数: {selectedProposal.quorum}
                <br />
                总票数: {selectedProposal.totalVotes}
              </p>
            </div>
            <div className="items-center px-4 py-3">
              <button
                onClick={() => setShowProposalModal(false)}
                className="px-4 py-2 bg-blue-500 text-black text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">DAO治理仪表板</h1>

      <div className="bg-white bg-opacity-10  rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-whtie">模拟控制</h2>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSimulationOn}
              onChange={() => setIsSimulationOn(!isSimulationOn)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-black peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white bg-opacity-10  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-white dark:text-white">
              启用自动模拟
            </span>
          </label>
          <button
            onClick={() => setIsSimulationOn(!isSimulationOn)}
            className="p-2 bg-blue-500 text-black rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {isSimulationOn ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      <div className="mb-6">
        <DAOProcessFlow />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white bg-opacity-10  rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">总成员数</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold mb-4">{members}</p>
          <div className="flex space-x-2">
            <button
              onClick={handleAddMember}
              className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              <UserPlus className="h-4 w-4" />
            </button>
            <button
              onClick={handleRemoveMember}
              className="p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              <UserMinus className="h-4 w-4" />
            </button>
            <button
              onClick={handleKickMember}
              className="p-2 bg-red-500 text-black rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              <UserX className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="bg-white bg-opacity-10  rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">活跃提案</h2>
            <Vote className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">{proposals.length}</p>
        </div>
        <div className="bg-white bg-opacity-10  rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">金库余额</h2>
            <Coins className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold">{treasury.toLocaleString()} ETH</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ErrorBoundary>
          <div className="bg-white bg-opacity-10 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              成员角色分布
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={memberRoles}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <div className="bg-white bg-opacity-10 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              DAO 资金分配
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundAllocation}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="current"
                    stackId="a"
                    fill="#8884d8"
                    name="当前资金"
                  />
                  <Bar
                    dataKey="planned"
                    stackId="a"
                    fill="#82ca9d"
                    name="计划资金"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ErrorBoundary>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white bg-opacity-10  bg-opacity-10 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">历史趋势</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="members"
                  stroke="#8884d8"
                  name="成员数"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="treasury"
                  stroke="#82ca9d"
                  name="金库余额"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="tokenPrice"
                  stroke="#ffc658"
                  name="代币价格"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white bg-opacity-10  rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">代币分配</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tokenDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tokenDistribution.map((entry, index) => (
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
          </div>
        </div>
      </div>

      <div className="bg-white bg-opacity-10  rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-whtie">热门提案</h2>
        <div className="space-y-4 mb-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">{proposal.title}</p>
                <div className="w-full bg-black rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{
                      width: `${(proposal.votes / proposal.totalVotes) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="ml-4 text-sm text-gray-500">
                {((proposal.votes / proposal.totalVotes) * 100).toFixed(1)}%
              </p>
              <span
                className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  proposal.status === '已通过'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {proposal.status}
              </span>
              <button
                onClick={() => setSelectedProposal(proposal)}
                className="ml-2 p-1 text-blue-500 hover:text-blue-700 focus:outline-none"
              >
                <BookOpen className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleRemoveProposal(proposal.id)}
                className="ml-2 p-1 text-gray-500 hover:text-red-500 focus:outline-none"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="新提案标题"
            value={newProposalTitle}
            onChange={(e) => setNewProposalTitle(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-black"
          />
          <button
            onClick={handleAddProposal}
            className="px-4 py-2 bg-blue-500 text-black rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white bg-opacity-10  rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">代币经济</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">代币总供应量</p>
              <p className="text-2xl font-bold">
                {tokenSupply.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">当前代币价格</p>
              <p className="text-2xl font-bold">${tokenPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">市值</p>
              <p className="text-2xl font-bold">
                ${(tokenSupply * tokenPrice).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white bg-opacity-10  rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">DAO教育</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">什么是DAO？</h3>
              <p className="text-sm text-gray-600">
                DAO（去中心化自治组织）是一种基于区块链技术的组织形式，通过智能合约实现自动化治理。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">为什么需要代币？</h3>
              <p className="text-sm text-gray-600">
                代币在DAO中扮演着重要角色，它不仅是一种价值尺度，还是参与治理的凭证。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium">如何参与DAO治理？</h3>
              <p className="text-sm text-gray-600">
                成员可以通过提出提案、参与投票等方式参与DAO的治理过程，共同决定组织的发展方向。
              </p>
            </div>
          </div>
        </div>
      </div>

      {showProposalModal && renderProposalModal()}
    </div>
  )
}

export default DAOGovernanceDashboard
