'use client'
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css'
const WalletButton = () => {
  return (
    <>
      <WalletSelector />
    </>
  )
}
export default WalletButton
