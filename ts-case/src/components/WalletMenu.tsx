import React, { useCallback, useEffect, useState, useRef } from 'react'
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design'
import {
  Popover,
  Transition,
  PopoverButton,
  PopoverPanel,
  DialogTitle,
  DialogPanel,
} from '@headlessui/react'
import {
  InputTransactionData,
  useWallet,
} from '@aptos-labs/wallet-adapter-react'
import { Fragment } from 'react'
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk'
import BigNumber from 'bignumber.js'
import { Dialog } from '@headlessui/react'
import { AptosFaucetClient, FundRequest } from '@aptos-labs/aptos-faucet-client'

interface ResponseBalanceType {
  current_fungible_asset_balances: Array<{ amount: number; asset_type: string }>
}
//

const useOutsideClick = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

const WalletMenu = () => {
  const [isOpenHistory, setIsOpenHistory] = useState(false)
  const [isOpenRanking, setIsOpenRanking] = useState(false)
  const [isOpenFetchBalance, setIsOpenFetchBalance] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [balance, setBalance] = useState('0')
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { connected, disconnect, account, signAndSubmitTransaction } =
    useWallet()

  useOutsideClick(popoverRef, () => {
    if (isOpen) setIsOpen(false)
  })

  // 获取余额
  const fetchBalance = useCallback(async () => {
    const config = new AptosConfig({ network: Network.TESTNET })
    const aptos = new Aptos(config)
    // console.log('获取余额: ', account?.address)
    if (!account?.address) return
    const variablesObj = {
      address: account.address,
      offset: 0,
    }

    const query_syntax = `query GetFungibleAssetBalances($address: String, $offset: Int) {
    current_fungible_asset_balances(
      where: {owner_address: {_eq: $address}},
      offset: $offset,
      limit: 100,
      order_by: {amount: desc}
    ) {
      asset_type
      amount
      __typename
    }
  }`

    try {
      const response = await aptos.queryIndexer({
        query: {
          query: query_syntax,
          variables: variablesObj,
        },
      })
      const amountOriginal = (response as ResponseBalanceType)
        .current_fungible_asset_balances[0].amount
      const amount = new BigNumber(amountOriginal)
      // console.log('the response is ', amount)
      const factor = new BigNumber(10).pow(8)
      setBalance(amount.dividedBy(factor).toString())
    } catch (error) {
      console.error('fetchBalance error', error)
    }
  }, [account])

  // 领取 faucet
  async function callFaucet(
    amount: number,
    address: string
  ): Promise<string[]> {
    const faucetClient = new AptosFaucetClient({
      BASE: 'https://faucet.testnet.aptoslabs.com',
    })

    const request: FundRequest = {
      amount,
      address,
    }

    try {
      const response = await faucetClient.fund.fund({ requestBody: request })
      console.log(response)
      if ('txn_hashes' in response) {
        return response.txn_hashes
      } else {
        throw new Error('Funding failed: ' + response)
      }
    } catch (error) {
      console.error('Error funding account:', error)
      throw error
    }
  }

  // 领 fuacet
  async function fetchFaucentBalance() {
    if (!account?.address) return
    try {
      // const result =
      await callFaucet(100000000, account?.address)
      fetchBalance()
      // console.log('faucet: ', result)
    } catch (error) {
      console.log('Error: ', error)
    }
  }
  const [cooldown, setCooldown] = useState(0)
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    } else {
      setIsOpenFetchBalance(false)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleClick = () => {
    if (!isOpenFetchBalance) {
      setIsOpenFetchBalance(true)
      setCooldown(3)
      fetchBalance()
      fetchFaucentBalance()
    }
  }
  // 获取余额
  useEffect(() => {
    fetchBalance()
  }, [account, balance, fetchBalance]) // 当 account 更改时重新执行

  // 获取历史记录
  const getHistory = async () => {
    const config = new AptosConfig({ network: Network.TESTNET })
    const aptos = new Aptos(config)

    if (!account) return // 如果没有账户，返回

    try {
      // 一个交易的数据信息
      const transaction: InputTransactionData = {
        data: {
          function: `${process.env.NEXT_PUBLIC_NFT_MODULE_ADDESSR}::play::set_score`,
          functionArguments: [42, [1, 2, 3]],
        },
      }

      // 提交交易并等待交易完成
      const response = await signAndSubmitTransaction(transaction)
      await aptos.waitForTransaction({ transactionHash: response.hash })
      console.log('Transaction response:', response)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // ui
  if (!connected) {
    return (
      <WalletSelector isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
    )
  }

  return (
    <Popover className="relative" ref={popoverRef}>
      {({ open }) => (
        <>
          <PopoverButton
            className={`
            ${
              open
                ? 'text-white bg-white/10 bg-opacity-20 outline outline-1'
                : 'text-white bg-opacity-100 outline outline-1'
            }
            
            inline-flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-white hover:text-black text-white focus-visible:text-gray-700 focus-visible:bg-gray-100`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="font-bold">
              {account?.address && account.address.length > 8
                ? `${account.address.slice(0, 6)}...${account.address.slice(
                    -4
                  )}`
                : account?.address || ''}
            </span>

            <svg
              className={`${
                isOpen ? 'transform rotate-180' : ''
              } ml-2 h-5 w-5 transition-transform`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </PopoverButton>
          <Transition
            show={isOpen}
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <PopoverPanel
              transition
              anchor="bottom"
              static
              className="absolute z-10 mt-1 w-48 p-1 bg-white border rounded shadow-md divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 transition ease-in-out bg-opacity-20 backdrop-blur-sm"
            >
              <div className="divide-y divide-gray-100">
                <div className="px-1 py-1">
                  <button
                    className={`group flex rounded-md items-center w-full px-2 py-2 text-sm text-white ${
                      isOpenFetchBalance
                        ? 'bg-opacity-20 bg-gray-300 cursor-not-allowed'
                        : 'hover:bg-opacity-20 hover:backdrop-blur-sm hover:text-white hover:bg-white/10'
                    }`}
                    onClick={handleClick}
                    disabled={isOpenFetchBalance}
                  >
                    <div className="flex items-center justify-between w-full">
                      <p>余额</p>

                      <div className="flex items-center">
                        <p className="text-gray-100 mr-2">{balance}</p>
                        {isOpenFetchBalance && (
                          <p className="text-gray-300 text-xs">{cooldown}s</p>
                        )}
                      </div>
                    </div>
                  </button>
                  <div className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-white hover:bg-opacity-20 hover:backdrop-blur-sm hover:text-white hover:bg-white/10">
                    <button
                      className="w-full h-full text-left" // Changed to text-left
                      onClick={() => {
                        setIsOpenHistory(true)
                        getHistory()
                      }}
                    >
                      历史记录
                    </button>

                    <Dialog
                      open={isOpenHistory}
                      onClose={() => setIsOpenHistory(false)}
                      className="relative z-50"
                    >
                      {/* The backdrop, rendered as a fixed sibling to the panel container */}
                      <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        aria-hidden="true"
                      />

                      {/* Full-screen container to center the panel */}
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        {/* The actual dialog panel  */}
                        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
                          <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                            历史记录
                          </DialogTitle>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              well be adding this soon.
                            </p>
                          </div>

                          <button
                            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => setIsOpenHistory(false)}
                          >
                            关闭
                          </button>
                        </DialogPanel>
                      </div>
                    </Dialog>
                  </div>
                  <div className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-white hover:bg-opacity-20 hover:backdrop-blur-sm hover:text-white hover:bg-white/10">
                    <button
                      className="w-full h-full text-left" // Changed to text-left
                      onClick={() => setIsOpenRanking(true)}
                    >
                      排名
                    </button>

                    <Dialog
                      open={isOpenRanking}
                      onClose={() => setIsOpenRanking(false)}
                      className="relative z-50"
                    >
                      {/* The backdrop, rendered as a fixed sibling to the panel container */}
                      <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        aria-hidden="true"
                      />

                      {/* Full-screen container to center the panel */}
                      <div className="fixed inset-0 flex items-center justify-center p-4">
                        {/* The actual dialog panel  */}
                        <DialogPanel className="mx-auto max-w-sm rounded bg-white p-6">
                          <DialogTitle className="text-lg font-medium leading-6 text-gray-900">
                            排名
                          </DialogTitle>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              will be added soon
                            </p>
                          </div>

                          <button
                            className="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                            onClick={() => setIsOpenRanking(false)}
                          >
                            Close
                          </button>
                        </DialogPanel>
                      </div>
                    </Dialog>
                  </div>
                </div>
                <div className="px-1 py-1">
                  <button
                    className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-200 hover:bg-opacity-20 hover:backdrop-blur-sm hover:text-red-600 hover:bg-white/10"
                    onClick={disconnect}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default WalletMenu
