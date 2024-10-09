'use client'
import React, { useState } from 'react'
import { Tab } from '@headlessui/react'
import { Coins, FileImage, Shuffle } from 'lucide-react'
import NFTTokenComposable from './NFTTokenComposable'

interface NFTItemProps {
  id: number
}

const NFTItem: React.FC<NFTItemProps> = ({ id }) => (
  <div className="relative w-16 h-16 m-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
    <FileImage className="w-8 h-8" />
    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white bg-opacity-50 rounded-full flex items-center justify-center text-purple-900 text-xs font-bold">
      {id}
    </div>
  </div>
)

interface TokenItemProps {
  amount: number
}

const TokenItem: React.FC<TokenItemProps> = ({ amount }) => (
  <div className="relative w-16 h-16 m-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
    <Coins className="w-8 h-8" />
    <div className="absolute bottom-0 right-0 bg-white bg-opacity-50 text-blue-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
      {amount}
    </div>
  </div>
)

const NFT: React.FC = () => {
  const [nftCount, setNftCount] = useState<number>(1)
  const [tokenCount, setTokenCount] = useState<number>(100)

  return (
    // from-gray-100 to-gray-900
    <div className="p-4 max-w-4xl mx-auto bg-gradient-to-b  rounded-xl shadow-2xl bg-black bg-opacity-10">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        NFT（ERC-721） 和 Token（ERC-20）
      </h1>

      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-blue-600/20 rounded-xl mb-6">
          {['对比', '可组合 Token'].map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                `w-full py-2.5 text-sm font-medium leading-5 text-blue-700 rounded-lg
                focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60
                ${
                  selected
                    ? 'bg-white shadow'
                    : 'text-blue-100 hover:bg-blue-900 bg-opacity-10/[0.12] hover:text-white'
                }`
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-10 bg-opacity-10 p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FileImage className="mr-2" /> NFT (非同质化代币)
                </h2>
                <div className="flex flex-wrap justify-center mb-4">
                  {[...Array(nftCount)].map((_, i) => (
                    <NFTItem key={i} id={i + 1} />
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setNftCount(Math.max(1, nftCount - 1))}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="self-center font-semibold">
                    NFT数量: {nftCount}
                  </span>
                  <button
                    onClick={() => setNftCount(nftCount + 1)}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Coins className="mr-2" /> 普通Token
                </h2>
                <div className="flex flex-wrap justify-center mb-4">
                  <TokenItem amount={tokenCount} />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => setTokenCount(Math.max(0, tokenCount - 10))}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="self-center font-semibold">
                    Token数量: {tokenCount}
                  </span>
                  <button
                    onClick={() => setTokenCount(tokenCount + 10)}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            {/* <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow"> */}
            {/* <h2 className="text-2xl font-bold mb-4">创建你的可组合Token</h2>
              <p className="mb-4">选择以下特性来组合你的自定义Token：</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tokenFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedFeatures.includes(feature.name)
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleFeature(feature.name)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{feature.name}</h3>
                      {selectedFeatures.includes(feature.name) && (
                        <Check className="text-blue-500" size={20} />
                      )}
                    </div>
                    <p className="text-sm mt-2">{feature.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">你的自定义Token</h3>
                {selectedFeatures.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {selectedFeatures.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p>还未选择任何特性</p>
                )}
              </div> */}
            <NFTTokenComposable />
            {/* </div> */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="mt-6 bg-white bg-opacity-10 p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Shuffle className="mr-2" /> NFT vs 可组合Token的关键区别
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg ">
            <h3 className="font-bold mb-2">NFT特性：</h3>
            <ul className="list-disc list-inside">
              <li>每个NFT都是独一无二的</li>
              <li>不可分割</li>
              <li>常用于数字艺术和收藏品</li>
              <li>价值基于稀缺性和独特性</li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg ">
            <h3 className="font-bold mb-2">可组合Token特性：</h3>
            <ul className="list-disc list-inside">
              <li>可以根据需求组合不同特性</li>
              <li>灵活性高，适应不同应用场景</li>
              <li>可以兼具多种功能</li>
              <li>价值基于其组合的特性和实用性</li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg ">
            <h3 className="font-bold mb-2">普通Token特性：</h3>
            <ul className="list-disc list-inside">
              <li>所有token都是同质的，可互换</li>
              <li>可以被分割成更小的单位</li>
              <li>常用作加密货币和实用型token</li>
              <li>价值基于供需关系和实用性</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NFT
