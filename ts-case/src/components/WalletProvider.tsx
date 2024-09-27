'use client'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { Network } from '@aptos-labs/ts-sdk'
import { PropsWithChildren } from 'react'

export const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <>
      <AptosWalletAdapterProvider
        plugins={[]}
        autoConnect={true}
        dappConfig={{
          network: Network.TESTNET,
          aptosConnectDappId: 'dapp-id',
        }}
      >
        {children}
      </AptosWalletAdapterProvider>
    </>
  )
}
