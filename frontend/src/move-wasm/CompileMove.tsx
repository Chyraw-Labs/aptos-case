import { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { useMoveEditor } from '@/components/MoveEditorProvider'
import init, { check_build_module } from './hello_wasm'
import { vector } from './lib/vector'
import { option } from './lib/option'
import { string } from './lib/string'
import { signer } from './lib/signer'

const useCompileMove = () => {
  const { account } = useWallet()
  // const [code, setCode] = useState('')
  const { exportCode } = useMoveEditor()
  const [result, setResult] = useState(null)

  useEffect(() => {
    init('./move-1.wasm').then(() => {
      console.log('wasm loaded')
    })

    const compile = async () => {
      const exportedCode = exportCode()
      // setCode(exportedCode)

      if (!exportedCode || !account?.address) return

      console.log('[INFO] compile: ', exportedCode)
      try {
        const response = await check_build_module({
          package_name: 'test_package',
          target_symbols: ['source.move'],
          target_source: [`${exportedCode}`],
          target_named_address_symbol: ['case', 'std'],
          target_named_address: [account.address, '0x1'],
          deps_symbols: [
            ['option.move', 'vector.move', 'string.move', 'signer.move'],
          ],
          deps_source: [[option, vector, string, signer]],
        })
        setResult(response)
        console.log(response)
      } catch (error) {
        console.error('Compilation error:', error)
        setResult(null)
      }
    }

    compile()
  }, [account, exportCode])

  return result
}

export default useCompileMove
