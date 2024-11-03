import React from 'react'
import { CheckCircle, Clock, Users, Vote, Cog, ArrowRight } from 'lucide-react'

export const DAOProcessFlow = () => {
  const steps = [
    {
      icon: <Users size={24} />,
      title: '提案创建',
      description: '社区成员提出新想法',
    },
    {
      icon: <Vote size={24} />,
      title: '投票',
      description: '代币持有者参与投票',
    },
    {
      icon: <CheckCircle size={24} />,
      title: '通过',
      description: '达到法定人数并获得多数支持',
    },
    { icon: <Cog size={24} />, title: '实施', description: '执行已通过的提案' },
    {
      icon: <Clock size={24} />,
      title: '监督',
      description: '社区监督实施过程',
    },
  ]

  return (
    <div className="bg-black bg-opacity-10 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-white">DAO 管理流程</h2>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center text-center mb-4 md:mb-0">
              <div className="bg-blue-500 rounded-full p-3 mb-2">
                {step.icon}
              </div>
              <h3 className="text-lg font-medium text-white">{step.title}</h3>
              <p className="text-sm text-gray-300 mt-1">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="hidden md:block text-gray-400 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
