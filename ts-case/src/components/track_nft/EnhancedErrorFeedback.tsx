import React from 'react'

interface EnhancedErrorFeedbackProps {
  userInput: string
  expectedAnswer: string
  explanation: string
}

const EnhancedErrorFeedback: React.FC<EnhancedErrorFeedbackProps> = ({
  userInput,
  expectedAnswer,
  explanation,
}) => {
  const renderLineComparison = () => {
    const userLines = userInput.trim().split('\n')
    const answerLines = expectedAnswer.trim().split('\n')

    return (
      <div className="mt-4">
        {userLines.map((line, index) => {
          const answerLine = answerLines[index] || ''
          const errorIndex = findFirstDifference(line, answerLine)

          return (
            <div key={index} className="mb-4 font-mono">
              <div className="text-red-400">您的答案: {line}</div>
              <div className="text-green-400">正确答案: {answerLine}</div>
              {errorIndex !== -1 && (
                <div className="text-yellow-400 whitespace-pre">
                  {' '.repeat(8)}
                  {' '.repeat(errorIndex)}^
                </div>
              )}
              {errorIndex !== -1 && (
                <div className="text-yellow-400">
                  从第 {errorIndex + 1} 个字符开始不匹配。
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const findFirstDifference = (str1: string, str2: string): number => {
    const minLength = Math.min(str1.length, str2.length)
    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) {
        return i
      }
    }
    return str1.length !== str2.length ? minLength : -1
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-red-400">错误反馈</h3>
      <p className="text-gray-300 mb-4">{explanation}</p>
      {renderLineComparison()}
    </div>
  )
}

export default EnhancedErrorFeedback
