import React, { useState, useEffect } from 'react'
import { Check } from 'lucide-react'

interface TokenFeature {
  name: string
  description: string
  svgElement: JSX.Element
}

const tokenFeatures: TokenFeature[] = [
  {
    name: '可替换性',
    description: '所有token都是同质的，可以互换',
    svgElement: <circle cx="50" cy="50" r="40" fill="#4299E1" />,
  },
  {
    name: '可分割性',
    description: '可以被分割成更小的单位',
    svgElement: <path d="M50 10 L90 90 L10 90 Z" fill="#48BB78" />,
  },
  {
    name: '流动性',
    description: '易于在市场上交易和转移',
    svgElement: (
      <rect x="10" y="10" width="80" height="80" rx="20" fill="#F6AD55" />
    ),
  },
  {
    name: '实用性',
    description: '可用于特定目的或在特定生态系统中使用',
    svgElement: (
      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="#9F7AEA" />
    ),
  },
  {
    name: '治理权',
    description: '赋予持有者参与决策的权利',
    svgElement: <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="#F687B3" />,
  },
  {
    name: '收益权',
    description: '可以产生被动收入或分红',
    svgElement: <path d="M10 40 Q50 10 90 40 Q50 70 10 40" fill="#FC8181" />,
  },
]

const NFTTokenComposable: React.FC = () => {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [uniqueId, setUniqueId] = useState(1)

  useEffect(() => {
    setUniqueId((prev) => prev + 1)
  }, [selectedFeatures])

  const toggleFeature = (featureName: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureName)
        ? prev.filter((f) => f !== featureName)
        : [...prev, featureName]
    )
  }

  const ComposedToken = () => (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {selectedFeatures.map((feature, index) => {
        const featureData = tokenFeatures.find((f) => f.name === feature)
        if (featureData) {
          return React.cloneElement(featureData.svgElement, {
            key: feature,
            opacity: 0.5 + (0.5 / selectedFeatures.length) * (index + 1),
          })
        }
        return null
      })}
      <text
        x="50"
        y="50"
        fontSize="20"
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        #{uniqueId}
      </text>
    </svg>
  )

  return (
    <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">创建你的可组合Token</h2>
      <div className="flex flex-wrap justify-center mb-6">
        {selectedFeatures.length > 0 ? (
          <ComposedToken />
        ) : (
          <p>选择特性来创建你的Token</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tokenFeatures.map((feature) => (
          <div
            key={feature.name}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedFeatures.includes(feature.name)
                ? 'bg-blue-600 bg-opacity-30 border-2 border-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
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
        <h3 className="text-xl font-bold mb-2">你的自定义Token特性</h3>
        {selectedFeatures.length > 0 ? (
          <ul className="list-disc list-inside">
            {selectedFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : (
          <p>还未选择任何特性</p>
        )}
      </div>
    </div>
  )
}

export default NFTTokenComposable
