import React from 'react'

const ProjectHeader = ({ name, progress }) => (
  <>
    <h1 className="text-2xl font-bold mb-4 text-white">{name}</h1>
    <div className="w-full bg-gray-400 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </>
)

export default ProjectHeader
