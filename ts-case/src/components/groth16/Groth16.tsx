'use client'
import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
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
import { Lock, Unlock, Key, Shield, Cpu, Database } from 'lucide-react'

const Groth16 = () => {
  const [step, setStep] = useState(0)
  const [proofGenerated, setProofGenerated] = useState(false)
  const [verified, setVerified] = useState(false)

  const complexityData = [
    { name: 'Setup', prover: 10, verifier: 5 },
    { name: 'Prove', prover: 8, verifier: 2 },
    { name: 'Verify', prover: 2, verifier: 3 },
  ]

  const steps = [
    { name: 'Setup', icon: <Key className="w-6 h-6" /> },
    { name: 'Prove', icon: <Shield className="w-6 h-6" /> },
    { name: 'Verify', icon: <Cpu className="w-6 h-6" /> },
  ]

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1)
    } else if (step === 2 && !proofGenerated) {
      setProofGenerated(true)
    } else if (proofGenerated && !verified) {
      setVerified(true)
    }
  }

  const resetDemo = () => {
    setStep(0)
    setProofGenerated(false)
    setVerified(false)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Groth16 零知识证明系统可视化
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">计算复杂度对比</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={complexityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="prover"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="verifier" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-700 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">交互式演示</h2>
        <div className="flex justify-between mb-6">
          {steps.map((s, index) => (
            <div
              key={s.name}
              className={`flex flex-col items-center ${
                index <= step ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              {s.icon}
              <span className="mt-2">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center mb-4">
          {step === 0 && (
            <div>
              <Key className="w-16 h-16 text-yellow-400 animate-pulse" />
              <h1>生成密钥</h1>
            </div>
          )}
          {step === 1 && (
            <div className="">
              <Shield className="w-16 h-16 text-green-400 animate-pulse" />
              <h1>test</h1>
            </div>
          )}
          {step === 2 && (
            <div>
              <Cpu className="w-16 h-16 text-blue-400 animate-pulse" />
              <h1>计算</h1>
            </div>
          )}
          {proofGenerated && !verified && (
            <div>
              <Lock className="w-16 h-16 text-red-400 animate-pulse" />
              <h1>解密</h1>
            </div>
          )}
          {verified && (
            <div>
              <Unlock className="w-16 h-16 text-green-400 animate-pulse" />
              <h1>解锁</h1>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            if (verified) {
              resetDemo()
            } else {
              handleNextStep()
            }
          }}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {verified ? '重置演示' : '下一步'}
        </button>
      </div>

      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl mb-6">
          {['设置', '证明生成', '验证'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 rounded-lg
                focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                ${
                  selected
                    ? 'bg-blue-700 shadow'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">设置阶段</h3>
              <div className="flex items-center justify-center space-x-4">
                <Database className="w-12 h-12 text-purple-400" />
                <Arrow />
                <Key className="w-12 h-12 text-yellow-400" />
              </div>
              <p className="mt-4 text-center">生成公共参数和证明密钥</p>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">证明生成阶段</h3>
              <div className="flex items-center justify-center space-x-4">
                <Shield className="w-12 h-12 text-green-400" />
                <Arrow />
                <Lock className="w-12 h-12 text-red-400" />
              </div>
              <p className="mt-4 text-center">使用证明密钥生成零知识证明</p>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">验证阶段</h3>
              <div className="flex items-center justify-center space-x-4">
                <Cpu className="w-12 h-12 text-blue-400" />
                <Arrow />
                <Unlock className="w-12 h-12 text-green-400" />
              </div>
              <p className="mt-4 text-center">验证者使用公共参数验证证明</p>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

const Arrow = () => (
  <svg
    className="w-8 h-8 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
)

export default Groth16
