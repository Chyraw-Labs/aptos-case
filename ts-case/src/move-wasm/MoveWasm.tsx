'use client'
import { useEffect, useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useMoveEditor } from '@/components/MoveEditorProvider'
import init, { check_build_module } from './hello_wasm'
import { vector } from './lib/vector'
import { option } from './lib/option'

// Initialize WASM
init('./move-1.wasm').then(() => {
  console.log('wasm loaded')
})

export function MoveWasm() {
  const { signAndSubmitTransaction, account } = useWallet()
  const [code, setCode] = useState('')
  const { exportCode } = useMoveEditor()
  const [compileResult, setCompileResult] = useState<{
    response: string
    metadata: []
    units: [[]]
  } | null>(null)
  const editorCode = exportCode()
  useEffect(() => {
    if (!editorCode) return

    setCode(editorCode)
    console.log('[INFO] useEffect: ', editorCode)
  }, [exportCode])

  useEffect(() => {
    compileMove()
  }, [code, account])

  // Compile
  async function compileMove() {
    if (!code || !account?.address) return

    console.log('[INFO] compile: ', code)
    try {
      const result = (await check_build_module({
        package_name: 'test_package', // 包名
        target_symbols: ['source.move'], // 目标符号
        target_source: [`${code}`], // 目标源代码
        target_named_address_symbol: ['case', 'std'], // 命名地址符号
        target_named_address: [account.address, '0x1'], // 命名地址
        deps_symbols: [['option.move', 'vector.move']], // 依赖符号
        deps_source: [[option, vector]], // 依赖源
      })) as { response: string; metadata: []; units: [[]] }
      setCompileResult(result)
      console.log(result)
      return result
    } catch (error) {
      console.error('Compilation error:', error)
      setCompileResult(null)
    }
  }

  // Submit transaction
  async function submitTransaction() {
    if (!account?.address || !compileResult) return
    console.log('[INFO] submit transaction: ', code)
    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: '0x1::code::publish_package_txn',
          typeArguments: [],
          functionArguments: [compileResult.metadata, compileResult.units],
        },
      })
      console.log(response)
    } catch (error) {
      console.error('Transaction submission error:', error)
    }
  }

  const handleSubmit = () => {
    submitTransaction()
  }

  const handleCompile = () => {
    compileMove()
  }

  return (
    <>
      <button
        onClick={handleCompile}
        disabled={!account?.address}
        className="hover:text-red-300"
      >
        编译
      </button>
      <button
        onClick={handleSubmit}
        disabled={!account?.address || !compileResult}
      >
        <p className="text-red-100 hover:text-red-300">发布</p>
      </button>
    </>
  )
}

export async function MoveCompile() {
  const { account } = useWallet()
  const [code, setCode] = useState('')
  const { exportCode } = useMoveEditor()
  const [result, setResult] = useState<{
    response: string
    metadata: []
    units: [[]]
  } | null>(null)
  setCode(exportCode())
  if (!code || !account?.address) return

  console.log('[INFO] compile: ', code)
  try {
    const response = (await check_build_module({
      package_name: 'test_package', // 包名
      target_symbols: ['source.move'], // 目标符号
      target_source: [`${code}`], // 目标源代码
      target_named_address_symbol: ['case', 'std'], // 命名地址符号
      target_named_address: [account.address, '0x1'], // 命名地址
      deps_symbols: [['option.move', 'vector.move']], // 依赖符号
      deps_source: [[option, vector]], // 依赖源
    })) as { response: string; metadata: []; units: [[]] }
    setResult(response)
    console.log(response)
  } catch (error) {
    console.error('Compilation error:', error)
    setResult(null)
  }
  console.log(result)
  return result
}
