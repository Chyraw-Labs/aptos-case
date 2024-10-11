import React from 'react'
import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ error }) =>
  error && (
    <div className="p-4 my-4 mb-4 bg-blue-100 rounded-lg">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
        <pre className="text-xs font-medium text-blue-800">{error}</pre>
      </div>
    </div>
  )

export default ErrorMessage
