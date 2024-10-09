import React, { useState } from 'react'
import { Code } from 'lucide-react'

interface AstNode {
  name: string
  children?: AstNode[]
}

const AptosAstGenerator = () => {
  const [code, setCode] = useState('')
  const [ast, setAst] = useState<AstNode | null>(null)

  const generateAst = () => {
    const generatedAst = parseMoveCode(code)
    setAst(generatedAst)
  }

  const parseMoveCode = (code: string): AstNode => {
    const lines = code.split('\n')
    const root: AstNode = { name: 'Root', children: [] }
    const stack: AstNode[] = [root]
    let currentNode = root

    lines.forEach((line) => {
      line = line.trim()
      if (line === '') return

      if (line.startsWith('module')) {
        const moduleName = line.split('::')[1]?.split('{')[0] || 'Unknown'
        const moduleNode: AstNode = {
          name: `Module: ${moduleName}`,
          children: [],
        }
        currentNode.children?.push(moduleNode)
        stack.push(moduleNode)
        currentNode = moduleNode
      } else if (line.startsWith('struct')) {
        const structName = line.split(' ')[1]?.split('{')[0] || 'Unknown'
        const structNode: AstNode = {
          name: `Struct: ${structName}`,
          children: [],
        }
        currentNode.children?.push(structNode)
        stack.push(structNode)
        currentNode = structNode
      } else if (line.startsWith('fun')) {
        const funName = line.split(' ')[1]?.split('(')[0] || 'Unknown'
        const funNode: AstNode = { name: `Function: ${funName}`, children: [] }
        currentNode.children?.push(funNode)
        stack.push(funNode)
        currentNode = funNode
      } else if (line.startsWith('const')) {
        const constName = line.split(':')[0]?.split(' ')[1] || 'Unknown'
        currentNode.children?.push({ name: `Const: ${constName}` })
      } else if (line.startsWith('#[')) {
        const attrName = line.substring(2, line.length - 1)
        currentNode.children?.push({ name: `Attribute: ${attrName}` })
      } else if (line.startsWith('use')) {
        const usePath = line.split(' ')[1]?.split(';')[0] || 'Unknown'
        currentNode.children?.push({ name: `Use: ${usePath}` })
      } else if (line === '}') {
        stack.pop()
        currentNode = stack[stack.length - 1] || root
      } else {
        currentNode.children?.push({ name: `Statement: ${line}` })
      }
    })

    return root
  }

  const renderTree = (node: AstNode): React.ReactNode => {
    return (
      <div className="ml-4">
        <div className="text-sm">{node.name}</div>
        {node.children && (
          <div className="ml-4">
            {node.children.map((child, index) => (
              <div key={index}>{renderTree(child)}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Aptos Move AST Generator</h1>
      <div className="mb-4">
        <label
          htmlFor="code"
          className="block text-sm font-medium text-gray-700"
        >
          Enter Aptos Move Code:
        </label>
        <textarea
          id="code"
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-black"
          value={code}
          placeholder="请输入代码"
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <button
        onClick={generateAst}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Code className="mr-2 h-5 w-5" />
        Generate AST
      </button>
      {ast && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated AST:</h2>
          <div
            className="border rounded-lg p-4 overflow-auto"
            style={{ maxHeight: '600px' }}
          >
            {renderTree(ast)}
          </div>
        </div>
      )}
    </div>
  )
}

export default AptosAstGenerator
