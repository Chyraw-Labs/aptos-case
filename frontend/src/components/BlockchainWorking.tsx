'use client'
import React, { useState } from 'react'
import { Server, Shield, Coins } from 'lucide-react'

// 类型定义
interface NFT {
  id: string
  name: string
}

interface Loan {
  id: string
  amount: number
  lender: string
}

interface Account {
  address: string
  balance: number
  nfts: NFT[]
  loans: Loan[]
  stakes: number
}

interface Block {
  index: number
  hash: string
  prevHash: string
  data: string
  gasUsed: number
}

interface Node {
  id: number
  blocks: Block[]
  isProposing: boolean
  isValidating: boolean
  stake: number
  gasPrice: number
}

interface SmartContract {
  name: string
  code: string
  execute: () => void
  estimatedGas: number
}

// 辅助函数：生成随机哈希
const generateHash = () => Math.random().toString(36).substring(2, 15)

// 辅助函数：生成随机地址
const generateAddress = (index: number) =>
  `0x${index.toString(16).padStart(4, '0')}`

// 账户组件
const Account: React.FC<Account> = ({
  address,
  balance,
  nfts,
  loans,
  stakes,
}) => (
  <div className="border p-4 rounded-lg mb-4">
    <h3 className="font-bold mb-2">账户: {address.substring(0, 6)}...</h3>
    <p>余额: {balance} APT</p>
    <p>NFT数量: {nfts.length}</p>
    <p>贷款数量: {loans.length}</p>
    <p>质押数量: {stakes} APT</p>
  </div>
)

// 节点组件
const Node: React.FC<Node> = ({
  id,
  blocks,
  isProposing,
  isValidating,
  stake,
  gasPrice,
}) => (
  <div
    className={`border p-4 rounded-lg ${
      isProposing ? 'bg-yellow-100 text-black' : ''
    } ${isValidating ? 'bg-green-100 text-black' : ''}`}
  >
    <h3 className="font-bold mb-2">节点 {id}</h3>
    <div className="flex items-center mb-2">
      <Server className="mr-2" size={16} />
      <span>{blocks.length} 区块</span>
    </div>
    <div className="flex items-center mb-2">
      <Shield className="mr-2" size={16} />
      <span>质押: {stake} APT</span>
    </div>
    <div className="flex items-center mb-2">
      <Coins className="mr-2" size={16} />
      <span>Gas 价格: {gasPrice} APT</span>
    </div>
    {isProposing && <p className="text-sm text-yellow-700">正在提议...</p>}
    {isValidating && <p className="text-sm text-green-700">正在验证...</p>}
  </div>
)

// 区块组件
const Block: React.FC<Block & { isProcessing: boolean }> = ({
  index,
  hash,
  prevHash,
  data,
  gasUsed,
  isProcessing,
}) => (
  <div
    className={`border p-4 rounded-lg mb-4 ${
      isProcessing ? 'animate-pulse' : ''
    }`}
  >
    <h3 className="font-bold mb-2">区块 {index}</h3>
    <p className="text-sm">
      <strong>哈希值:</strong> {hash.substring(0, 10)}...
    </p>
    <p className="text-sm">
      <strong>前一个区块哈希值:</strong> {prevHash.substring(0, 10)}...
    </p>
    <p className="text-sm">
      <strong>数据:</strong> {data}
    </p>
    <p className="text-sm">
      <strong>Gas 消耗:</strong> {gasUsed} APT
    </p>
  </div>
)

// 智能合约组件
const SmartContract: React.FC<SmartContract> = ({
  name,
  code,
  execute,
  estimatedGas,
}) => (
  <div className="border p-4 rounded-lg mb-4">
    <h3 className="font-bold mb-2">{name}</h3>
    <pre className="bg-white bg-opacity-10 p-2 rounded text-sm mb-2 text-white">
      {code}
    </pre>
    <p className="text-sm mb-2">预计 Gas 消耗: {estimatedGas} APT</p>
    <button
      onClick={execute}
      className="bg-purple-500 text-white px-4 py-2 rounded"
    >
      执行
    </button>
  </div>
)

// 主组件
const BlockchainWorking = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 1,
      blocks: [] as Block[], // 显式指定类型
      isProposing: false,
      isValidating: false,
      stake: 100,
      gasPrice: 0.1,
    },
    {
      id: 2,
      blocks: [] as Block[], // 显式指定类型
      isProposing: false,
      isValidating: false,
      stake: 150,
      gasPrice: 0.12,
    },
    {
      id: 3,
      blocks: [] as Block[], // 显式指定类型
      isProposing: false,
      isValidating: false,
      stake: 200,
      gasPrice: 0.11,
    },
  ])
  const [accounts, setAccounts] = useState<Account[]>([
    {
      address: generateAddress(1),
      balance: 1000,
      nfts: [] as NFT[], // 显式指定类型
      loans: [] as Loan[], // 显式指定类型
      stakes: 50,
    },
    {
      address: generateAddress(2),
      balance: 1500,
      nfts: [] as NFT[], // 显式指定类型
      loans: [] as Loan[], // 显式指定类型
      stakes: 75,
    },
  ])
  const [transactionData, setTransactionData] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [consensusRound, setConsensusRound] = useState(0)
  const [stakingPool, setStakingPool] = useState(0)
  const [smartContracts] = useState([
    {
      name: '简单转账',
      code: 'public entry fun transfer(from: &signer, to: address, amount: u64) {\n  aptos_framework::coin::transfer<AptosCoin>(from, to, amount);\n}',
      execute: () => addBlock('执行简单转账', 5),
      estimatedGas: 5,
    },
    {
      name: '创建NFT',
      code: 'public entry fun create_nft(creator: &signer, name: string, description: string, uri: string) {\n  aptos_framework::nft::create(creator, name, description, uri);\n}',
      execute: () => createNFT(),
      estimatedGas: 10,
    },
    {
      name: '贷款',
      code: 'public entry fun lend(lender: &signer, borrower: address, amount: u64) {\n  // 贷款逻辑\n}',
      execute: () => createLoan(),
      estimatedGas: 8,
    },
    {
      name: '质押',
      code: 'public entry fun stake(staker: &signer, amount: u64) {\n  // 质押逻辑\n}',
      execute: () => stake(),
      estimatedGas: 7,
    },
  ])

  const selectProposer = () => {
    const totalStake = nodes.reduce((sum, node) => sum + node.stake, 0)
    let random = Math.random() * totalStake
    for (let i = 0; i < nodes.length; i++) {
      if (random < nodes[i].stake) {
        return i
      }
      random -= nodes[i].stake
    }
    return nodes.length - 1
  }

  const addBlock = (data: string = '', gasUsed: number = 0) => {
    setIsProcessing(true)
    setConsensusRound((prevRound) => prevRound + 1)
    const proposerIndex = selectProposer()

    setNodes((prevNodes) =>
      prevNodes.map((node, index) => ({
        ...node,
        isProposing: index === proposerIndex,
      }))
    )

    setTimeout(() => {
      const newBlock: Block = {
        index: nodes[proposerIndex].blocks.length,
        hash: generateHash(),
        prevHash:
          nodes[proposerIndex].blocks.length > 0
            ? nodes[proposerIndex].blocks[
                nodes[proposerIndex].blocks.length - 1
              ].hash
            : '0',
        data:
          data ||
          transactionData ||
          `交易 ${nodes[proposerIndex].blocks.length + 1}`,
        gasUsed: gasUsed || Math.floor(Math.random() * 10) + 1,
      }

      setNodes((prevNodes) =>
        prevNodes.map((node, index) => ({
          ...node,
          blocks:
            index === proposerIndex ? [...node.blocks, newBlock] : node.blocks,
          isProposing: false,
          isValidating: index !== proposerIndex,
        }))
      )

      setTimeout(() => {
        setNodes((prevNodes) =>
          prevNodes.map((node) => ({
            ...node,
            blocks: [...node.blocks, newBlock],
            isValidating: false,
            stake: node.isProposing
              ? node.stake + newBlock.gasUsed
              : node.stake,
          }))
        )
        setIsProcessing(false)
        setTransactionData('')
        setConsensusRound(0)

        // 更新账户余额
        setAccounts((prevAccounts) =>
          prevAccounts.map((account, index) => ({
            ...account,
            balance:
              index === 0
                ? account.balance - newBlock.gasUsed
                : account.balance,
          }))
        )
      }, 2000)
    }, 3000)
  }

  const createNFT = () => {
    const accountIndex = Math.floor(Math.random() * accounts.length)
    setAccounts((prevAccounts) =>
      prevAccounts.map((account, index) => ({
        ...account,
        nfts:
          index === accountIndex
            ? [
                ...account.nfts,
                { id: generateHash(), name: `NFT ${account.nfts.length + 1}` },
              ]
            : account.nfts,
      }))
    )
    addBlock('创建 NFT', 10)
  }

  const createLoan = () => {
    const lenderIndex = Math.floor(Math.random() * accounts.length)
    const borrowerIndex = (lenderIndex + 1) % accounts.length
    const amount = Math.floor(Math.random() * 100) + 1
    setAccounts((prevAccounts) =>
      prevAccounts.map((account, index) => ({
        ...account,
        balance:
          index === lenderIndex
            ? account.balance - amount
            : index === borrowerIndex
            ? account.balance + amount
            : account.balance,
        loans:
          index === borrowerIndex
            ? [
                ...account.loans,
                {
                  id: generateHash(),
                  amount,
                  lender: prevAccounts[lenderIndex].address,
                },
              ]
            : account.loans,
      }))
    )
    addBlock(`创建贷款: ${amount} APT`, 8)
  }

  const stake = () => {
    const accountIndex = Math.floor(Math.random() * accounts.length)
    const amount = Math.floor(Math.random() * 50) + 1
    setAccounts((prevAccounts) =>
      prevAccounts.map((account, index) => ({
        ...account,
        balance:
          index === accountIndex ? account.balance - amount : account.balance,
        stakes:
          index === accountIndex ? account.stakes + amount : account.stakes,
      }))
    )
    setStakingPool((prevPool) => prevPool + amount)
    addBlock(`质押: ${amount} APT`, 7)
  }

  const unstake = () => {
    const accountIndex = Math.floor(Math.random() * accounts.length)
    const account = accounts[accountIndex]
    if (account.stakes > 0) {
      const amount = Math.floor(Math.random() * account.stakes) + 1
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc, index) => ({
          ...acc,
          balance: index === accountIndex ? acc.balance + amount : acc.balance,
          stakes: index === accountIndex ? acc.stakes - amount : acc.stakes,
        }))
      )
      setStakingPool((prevPool) => prevPool - amount)
      addBlock(`取消质押: ${amount} APT`, 5)
    }
  }

  const distributeRewards = () => {
    const rewardAmount = Math.floor(Math.random() * 50) + 10
    setStakingPool((prevPool) => prevPool + rewardAmount)
    setAccounts((prevAccounts) =>
      prevAccounts.map((account) => ({
        ...account,
        balance:
          account.balance + (account.stakes / stakingPool) * rewardAmount,
      }))
    )
    addBlock(`分发奖励: ${rewardAmount} APT`, 3)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">区块链工作过程演示</h1>
      {/* 交易输入框 */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={transactionData}
          onChange={(e) => setTransactionData(e.target.value)}
          placeholder="输入交易数据"
          className="border rounded  p-2 mr-2 flex-grow text-white bg-white bg-opacity-10"
        />
        <button
          onClick={() => addBlock(transactionData, 0)}
          disabled={isProcessing}
          className={`px-4 py-2 rounded ${
            isProcessing ? 'bg-gray-300' : 'bg-blue-500 text-white'
          }`}
        >
          {isProcessing ? '处理中...' : '添加交易'}
        </button>
      </div>
      {/* 共识状态 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">共识状态</h2>
        <p>当前轮次: {consensusRound}</p>
        <p>
          状态:{' '}
          {isProcessing
            ? consensusRound === 1
              ? '提议'
              : consensusRound === 2
              ? '投票'
              : '提交'
            : '空闲'}
        </p>
      </div>
      {/* 质押池 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">质押池</h2>
        <p>总质押量: {stakingPool} APT</p>
      </div>
      {/* 节点 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {nodes.map((node) => (
          <Node key={node.id} {...node} />
        ))}
      </div>
      {/* 所有账户 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">所有账户</h2>
        {accounts.map((account) => (
          <Account key={account.address} {...account} />
        ))}
      </div>
      {/* 所有智能合约 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">所有智能合约</h2>
        {smartContracts.map((contract, index) => (
          <SmartContract key={index} {...contract} />
        ))}
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">所有操作</h2>
        <button
          onClick={createNFT}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2 mb-2"
        >
          创建 NFT
        </button>
        <button
          onClick={createLoan}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 mb-2"
        >
          创建贷款
        </button>
        <button
          onClick={stake}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2 mb-2"
        >
          质押
        </button>
        <button
          onClick={unstake}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2 mb-2"
        >
          取消质押
        </button>
        <button
          onClick={distributeRewards}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
        >
          分发奖励
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {nodes.map((node) => (
          <div key={node.id}>
            <h3 className="font-bold mb-2">节点 {node.id} 区块</h3>
            {node.blocks.map((block) => (
              <Block
                key={block.index}
                {...block}
                isProcessing={
                  node.isProposing && block.index === node.blocks.length - 1
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlockchainWorking
