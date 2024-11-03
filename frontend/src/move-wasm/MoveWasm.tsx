'use client'
import { useEffect, useState, useCallback } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useMoveEditor } from '@/components/MoveEditorProvider'
import init, { check_build_module } from './hello_wasm'
import { vector } from './lib/vector'
import { option } from './lib/option'
import { string } from './lib/string'
import { signer } from './lib/signer'

// import dynamic from 'next/dynamic'

// Initialize WASM
// init('/move-1.wasm').then(() => {
//   console.log('wasm loaded')
// })

export function MoveWasm() {
  const { signAndSubmitTransaction, account } = useWallet()
  const [code, setCode] = useState('')
  const { exportCode } = useMoveEditor()
  const [compileResult, setCompileResult] = useState<{
    response: string
    metadata: []
    units: [[]]
  } | null>(null)
  const [wasmLoaded, setWasmLoaded] = useState(false)

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // 使用相对路径或绝对路径，取决于你的项目结构
        await init(new URL('./move-1.wasm', import.meta.url))
        console.log('WASM loaded successfully')
        setWasmLoaded(true)
      } catch (error) {
        console.error('Failed to load WASM:', error)
      }
    }

    loadWasm()
    console.log(wasmLoaded)
  }, [wasmLoaded])

  useEffect(() => {
    const editorCode = exportCode()
    setCode(editorCode)
    console.log(editorCode)
  }, [exportCode])

  const compileMove = useCallback(async () => {
    if (!code || !account?.address || !wasmLoaded) return

    console.log('[INFO] compile: ', code)
    try {
      const result = (await check_build_module({
        package_name: 'test_package',
        target_symbols: ['source.move'],
        target_source: [`${code}`],
        target_named_address_symbol: ['test_module', 'std'],
        target_named_address: [account.address, '0x1'],
        deps_symbols: [
          ['option.move', 'vector.move', 'string.move', 'signer.move'],
        ],
        deps_source: [[option, vector, string, signer]],
      })) as { response: string; metadata: []; units: [[]] }
      setCompileResult(result)
      console.log(result)
      return result
    } catch (error) {
      console.error('Compilation error:', error)
      setCompileResult(null)
    }
  }, [code, account?.address, wasmLoaded])

  useEffect(() => {
    if (wasmLoaded && code && account?.address) {
      compileMove()
    }
  }, [compileMove, wasmLoaded, code, account?.address])

  // Submit transaction
  const submitTransaction = useCallback(async () => {
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
  }, [account?.address, compileResult, code, signAndSubmitTransaction])

  return (
    <>
      <button onClick={compileMove} disabled={!account?.address}>
        编译
      </button>
      <button
        onClick={submitTransaction}
        disabled={!account?.address || !compileResult}
      >
        提交
      </button>
    </>
  )
}
