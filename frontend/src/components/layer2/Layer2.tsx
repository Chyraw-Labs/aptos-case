import React, { useState, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  RefreshCcw,
  Layers,
  GitBranch,
  Zap,
  Lock,
  LucideIcon,
} from 'lucide-react'

interface Transaction {
  from: string
  to: string
  amount: string
}

interface Solution {
  id: string
  name: string
  icon: LucideIcon
}

const Layer2: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('stateChannels')
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [step, setStep] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    from: '',
    to: '',
    amount: '',
  })

  const solutions: Solution[] = [
    { id: 'stateChannels', name: '状态通道', icon: GitBranch },
    { id: 'sidechains', name: '侧链', icon: Layers },
    { id: 'plasma', name: 'Plasma', icon: Zap },
    { id: 'rollups', name: 'Rollups', icon: Lock },
  ]

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isAnimating) {
      intervalId = setInterval(() => {
        setStep((prevStep) => (prevStep + 1) % 5)
      }, 1000)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isAnimating])

  // 添加交易
  const addTransaction = useCallback(() => {
    if (newTransaction.from && newTransaction.to && newTransaction.amount) {
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ])
      setNewTransaction({ from: '', to: '', amount: '' })
    }
  }, [newTransaction])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewTransaction((prev) => ({ ...prev, [name]: value }))
  }

  const renderTransactions = (transactions: Transaction[]) =>
    transactions.map((tx, index) => (
      <div
        key={index}
        className="w-60 h-8 bg-blue-200 rounded-full flex items-center justify-center my-1 text-black "
      >
        {tx.from} -&gt; {tx.to}: {tx.amount} ETH
      </div>
    ))

  const renderStateChannels = () => (
    <div className="flex flex-col items-center">
      <div className="flex space-x-20 mb-8">
        <div className="w-20 h-20 border-2 border-blue-500 rounded-full flex items-center justify-center">
          Alice
        </div>
        <div className="w-20 h-20 border-2 border-green-500 rounded-full flex items-center justify-center">
          Bob
        </div>
      </div>
      {step > 0 && (
        <div className="w-60 h-12 bg-gray-200 rounded-full flex text-black  items-center justify-center mb-4">
          通道开启: 100 ETH
        </div>
      )}
      {step > 1 && renderTransactions(transactions)}
      {step > 3 && (
        <div className="w-60 h-12 bg-gray-200 rounded-full flex text-black  items-center justify-center mt-4">
          通道关闭: 结算余额
        </div>
      )}
    </div>
  )

  const renderSidechains = () => (
    <div className="flex flex-col items-center">
      <div className="flex space-x-20 mb-8">
        <div className="w-40 h-20 border-2 border-blue-500 rounded flex items-center justify-center">
          主链
        </div>
        <div className="w-40 h-20 border-2 border-green-500 rounded flex items-center justify-center">
          侧链
        </div>
      </div>
      {step > 0 && (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-60 h-8 bg-blue-200 rounded-full flex items-center text-black  justify-center">
            锁定资产到侧链
          </div>
          {renderTransactions(transactions)}
          <div className="w-60 h-8 bg-blue-200 rounded-full flex items-center text-black justify-center">
            将结果提交到主链
          </div>
        </div>
      )}
    </div>
  )

  const renderPlasma = () => (
    <div className="flex flex-col items-center">
      <div className="flex space-x-20 mb-8">
        <div className="w-40 h-20 border-2 border-blue-500 rounded flex items-center justify-center">
          主链
        </div>
        <div className="w-40 h-20 border-2 border-green-500 rounded flex items-center justify-center">
          Plasma链
        </div>
      </div>
      {step > 0 && (
        <div className="flex flex-col items-center space-y-2">
          {renderTransactions(transactions)}
          <div className="w-60 h-8 bg-blue-200 rounded-full flex text-black  items-center justify-center">
            提交Merkle根到主链
          </div>
          <div className="w-60 h-8 bg-yellow-200 rounded-full flex  text-black items-center justify-center">
            挑战期
          </div>
          <div className="w-60 h-8 bg-blue-200 rounded-full flex text-black  items-center justify-center">
            确认并退出
          </div>
        </div>
      )}
    </div>
  )

  const renderRollups = () => (
    <div className="flex flex-col items-center">
      <div className="flex space-x-20 mb-8">
        <div className="w-40 h-20 border-2 border-blue-500 rounded flex items-center justify-center">
          主链
        </div>
        <div className="w-40 h-20 border-2 border-green-500 rounded flex items-center justify-center">
          Rollup链
        </div>
      </div>
      {step > 0 && (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-60 h-8 bg-green-200 rounded-full flex text-black  items-center justify-center">
            批量处理交易
          </div>
          {renderTransactions(transactions)}
          <div className="w-60 h-8 bg-yellow-200 rounded-full flex text-black  items-center justify-center">
            生成并提交证明到主链
          </div>
          <div className="w-60 h-8 bg-blue-200 rounded-full flex text-black items-center justify-center">
            主链验证并确认
          </div>
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'stateChannels':
        return renderStateChannels()
      case 'sidechains':
        return renderSidechains()
      case 'plasma':
        return renderPlasma()
      case 'rollups':
        return renderRollups()
      default:
        return null
    }
  }

  return (
    <div className="p-6 bg-black rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Layer 2扩容解决方案可视化
      </h2>
      <div className="flex justify-center space-x-4 mb-8 text-blue-500">
        {solutions.map((solution) => (
          <button
            key={solution.id}
            className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
              activeTab === solution.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab(solution.id)}
          >
            <solution.icon size={20} />
            <span>{solution.name}</span>
          </button>
        ))}
      </div>
      <div className="h-64 mb-8 ">{renderContent()}</div>
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className={`p-2 rounded-full ${
            isAnimating ? 'bg-red-500' : 'bg-green-500'
          } text-white`}
          onClick={() => setIsAnimating(!isAnimating)}
        >
          {isAnimating ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          className="p-2 rounded-full bg-blue-500 text-white"
          onClick={() => {
            setStep(0)
            setIsAnimating(false)
            setTransactions([])
          }}
        >
          <RefreshCcw size={24} />
        </button>
      </div>
      <div className="flex justify-center space-x-2 mb-4">
        <input
          type="text"
          name="from"
          placeholder="From"
          value={newTransaction.from}
          onChange={handleInputChange}
          className="border rounded px-2 py-1 text-black "
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          value={newTransaction.to}
          onChange={handleInputChange}
          className="border rounded px-2 py-1 text-black "
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={handleInputChange}
          className="border rounded px-2 py-1 text-black "
        />
        <button
          onClick={addTransaction}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          添加交易
        </button>
      </div>
    </div>
  )
}

export default Layer2
