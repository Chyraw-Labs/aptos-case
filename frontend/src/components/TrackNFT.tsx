// NFT 创建教程
import React, { useState, useEffect, Fragment } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Folder,
  ChevronRight,
  Code,
  Menu,
} from 'lucide-react'

import { Dialog, Transition } from '@headlessui/react'
import FileStructureTree, { FileStructure } from './FileStructureTree'
import { useMoveEditor } from './MoveEditorProvider'
import MoveEditorWrapper from './EditorWrapper'

interface Step {
  id: number
  title: string
  note: string // 注意
  content: string // 内容
  tips: string // 提示
  analyze: string //解析
  answer: string // 正确答案
  fileStructure: FileStructure
}

interface Project {
  id: number
  name: string
  steps: Step[]
}

const TrackNFT = () => {
  const [code, setCode] = useState(
    '// 请在这里输入你的答案...（输入前请删除此行）'
  )
  const { exportCode } = useMoveEditor()
  const editorCode = exportCode()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  // const [userInput, setUserInput] = useState('')
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [initialFiles, setInitialFiles] = useState<FileStructure>([
    { root: ['README.md'] },
  ])
  const [activeTab, setActiveTab] = useState('editor')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  // 项目文件结构
  const initialFileContents: [string, string][] = [
    [
      'root/README.md',
      `🚨 注意：
本教程是一个模拟创建 NFT 的教程，
该合约地址可能已经存在风险，
请不要在真实环境中使用本教程中的代码和合约地址。

🔔 提示：
跟随这个教程，您将学会如何在 Aptos 公链完成 NFT 合约的创建、编译和部署。`,
    ],
    [
      'root/.aptos/config.yaml',
      `---
profiles:
  default:
    network: Testnet
    private_key: "0xedab30e3e86cc397fe1f97af801fa28e4f706a35442ce50e2eb6582034d51540"
    public_key: "0x6f983917c31e22cbcc3026326c8ff04a9fb48836b5535821ba4fc59dcc6dc319"
    account: 4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46
    rest_url: "https://fullnode.testnet.aptoslabs.com"
    faucet_url: "https://faucet.testnet.aptoslabs.com"`,
    ],
    [
      'root/Move.toml',
      `[package]
name = "my_nft"
version = "1.0.0"
authors = []

[addresses]

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]`,
    ],
    [
      'root/sources/nft.move',
      `// 示例
// https://github.com/caoyang2002/Aptos-Docs/blob/main/AIP/aip-22.md
// https://github.com/caoyang2002/aptos_mvoe-learning/blob/main/NFT/create_one_nft/sources/create_first_nft.move
module MyNFT::first_NFT{
   
    use std::option;
    use std::signer;
    use std::string;
    use aptos_token_objects::collection;
    use aptos_token_objects::royalty;
    use aptos_token_objects::token;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    // step one: create a collection
    public entry fun create_collection(creator: &signer) {
        let max_supply = 1000;
        let collection_construcor_ref = &collection::create_fixed_collection(
            creator,
            string::utf8(b"collection_description"),
            max_supply,
            string::utf8(b"collection_name"),
            option::some(royalty::create(1,1,signer::address_of(creator))),
            string::utf8(b"collectionURI"),
        );
    }

    // step two: mint NFT
    public entry fun mint(creator: &signer){
        let token_constructor_ref = &token::create(
            creator,
            string::utf8(b"collection_name"),
            string::utf8(b"token_description"),
            string::utf8(b"token_name"),
            option::some(royalty::create(1,1,signer::address_of(creator))),
            string::utf8(b"token_uri")
            );
        // Create a reference for burning an NFT
        let burn_ref = token::generate_burn_ref(token_constructor_ref);
        move_to(
            creator,
            TokenRefsStore{
                burn_ref,
            }
        );
    }

    public entry fun burn(creator:&signer) acquires TokenRefsStore {
        let TokenRefsStore{
            burn_ref,
        } = move_from<TokenRefsStore>(signer::address_of(creator));
        token::burn(burn_ref)
    }
}`,
    ],
  ]
  // 项目 track
  const [project] = useState<Project>({
    id: 1,
    name: '从零创建基础 NFT 项目',
    steps: [
      // 项目介绍
      {
        id: 1,
        title: '0. 项目介绍',
        note: '',
        tips: '',
        analyze: '',
        content: `这是一个从零创建基础 NFT 项目的教程，我们将使用 Move 语言来编写智能合约。
本教程将介绍如何初始化项目、编写智能合约、编译和部署合约等步骤。

🚨 注意：
本教程是一个模拟教程，请不要在真实环境中使用本教程中的代码和合约地址。在下方编辑器中删除已有内容，然后输入 OK ，即表示您已经明白本教程的注意事项。

✅ 使用方法：
1. 当您输入正确的代码后会自动进入下一个步骤。
2. 如果您一直无法进入下一个步骤，可以从下方提示框中复制代码到输入框，以便于你进入下一个步骤（可能需要在旁边的黑色区域滑动）。
3. 点击左侧文件结构中的文件名，可以查看文件内容。
4. 本教程不会跟踪您的操作，意味着您的任何退出，都将重新开始本教程，但是你可以复制提示框中的代码，以快速进入到你希望去的步骤。
5. 如果您执行查看步骤解析，您可以在左侧点击 README.md 文件查看。

💻 输入：
OK

💡 解析：
在这里会给出每一个步骤的代码和操作详细解析`,
        answer: `OK`,
        fileStructure: [{ root: ['README.md'] }],
      },
      // 初始化 Move 项目
      {
        id: 1,
        title: '1. 初始化 Move 项目',
        note: '',
        tips: '',
        analyze: '',
        content: `清空编辑器中的内容后，输入:
aptos move init --name my_nft
💡 解析：
这个命令将会创建一个 Move 项目结构`,
        answer: `
aptos move init --name my_nft`,
        fileStructure: [{ root: ['README.md'] }],
      },
      // 创建 Aptos 的链上账户
      {
        id: 2,
        title: '2. 创建 Aptos 链上账户',
        note: '',
        tips: '',
        analyze: '',
        content: `清空编辑器中刚才输入的命令后，输入:
aptos init
💡 解析：这个命令将会创建一个 aptos 账户到 .aptos/config.toml，其中包含了地址、私钥和公钥，请勿泄漏`,
        answer: `
aptos init`,
        fileStructure: [{ root: ['Move.toml', { sources: [] }] }],
      },
      // 编辑 Move.toml 文件，配置地址别名
      //       {
      //         id: 3,
      //         title: '3-1. 编辑 Move 配置文件 Move.toml，配置地址别名',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `点击 Move.toml 文件，复制内容到下方编辑器，添加地址别名。地址为 config.yaml 文件中 account 后的字符串。输入:
      // [addresses]
      // case="你在 config.yaml 中的地址字符串"
      // 💡 解析：case 是自定义的地址别名，0x42 是区块链中的地址，它由`,
      //         answer: `
      // [package]
      // name = "my_nft"
      // version = "1.0.0"
      // authors = []

      // [addresses]
      // case="4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46"

      // [dev-addresses]

      // [dependencies.AptosFramework]
      // git = "https://github.com/aptos-labs/aptos-core.git"
      // rev = "mainnet"
      // subdir = "aptos-move/framework/aptos-framework"

      // [dev-dependencies]`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 4,
      //         title: '4. 继续编辑 Move.toml 文件，添加 AptosTokenObjects 依赖',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `不清空编辑器中的内容，删除：
      // [dependencies.AptosFramework]
      // git = "https://github.com/aptos-labs/aptos-core.git"
      // rev = "mainnet"
      // subdir = "aptos-move/framework/aptos-framework"

      // 添加：
      // [dependencies.AptosTokenObjects]
      // git = "https://github.com/aptos-labs/aptos-core.git"
      // rev = "testnet"
      // subdir = "aptos-move/framework/aptos-token-objects"

      // 💡 解析：这个命令将会在 sources 下创建 nft.move 文件`,
      //         answer: `
      // [package]
      // name = "my_nft"
      // version = "1.0.0"
      // authors = []

      // [addresses]
      // case="4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46"

      // [dev-addresses]

      // [dependencies.AptosTokenObjects]
      // git = "https://github.com/aptos-labs/aptos-core.git"
      // rev = "testnet"
      // subdir = "aptos-move/framework/aptos-token-objects"

      // [dev-dependencies]`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 5,
      //         title: '5. 创建 Move 合约文件: nft.move',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `清空编辑器中刚才输入的命令后，使用 touch 命令创建文件:
      // touch sources/nft.move
      // 💡 解析：这个命令将会在 sources 下创建 nft.move 文件`,
      //         answer: `
      // touch sources/nft.move`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 6,
      //         title: '6. 在 nft.move 中定义 NFT 模块',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `清空编辑器中刚才输入的命令后，输入:
      // module case::nft{

      // }
      // 💡 解析：module 表示这是一个模块，其中 case 是刚才定义的地址别名，`,
      //         answer: `
      // module case::nft{

      // }`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 7,
      //         title: '7. 在 NFT 模块中定义 NFT 引用的结构体',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `在 module case::nft 的 {} 中输入：
      // struct TokenRefsStore has key {
      //     burn_ref: token::BurnRef,
      // }`,
      //         answer: `
      // module case::nft{
      //     struct TokenRefsStore has key {
      //         burn_ref: token::BurnRef,
      //     }
      // }`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 8,
      //         title: '8. 创建一个 collection 用于保存 NTF',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `在 module case::nft 的 {} 中输入：
      // public entry fun create_collection(creator: &signer) {
      //     let max_supply = 1000;
      //     let collection_construcor_ref = &collection::create_fixed_collection(
      //         creator,
      //         string::utf8(b"collection_description"),
      //         max_supply,
      //         string::utf8(b"collection_name"),
      //         option::some(royalty::create(1,1,signer::address_of(creator))),
      //         string::utf8(b"collectionURI"),
      //     );
      // }`,
      //         answer: `
      // module case::nft{
      //     struct TokenRefsStore has key {
      //         burn_ref: token::BurnRef,
      //     }
      //     public entry fun create_collection(creator: &signer) {
      //         let max_supply = 1000;
      //         let collection_construcor_ref = &collection::create_fixed_collection(
      //             creator,
      //             string::utf8(b"collection_description"),
      //             max_supply,
      //             string::utf8(b"collection_name"),
      //             option::some(royalty::create(1,1,signer::address_of(creator))),
      //             string::utf8(b"collectionURI"),
      //         );
      //     }
      // }`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 7,
      //         title: '7. 添加创建 NFT 的函数',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `在 module case::nft 的 {} 中输入：
      // public entry fun mint(creator: &signer){
      //     let token_constructor_ref = &token::create(
      //         creator,
      //         string::utf8(b"collection_name"),
      //         string::utf8(b"token_description"),
      //         string::utf8(b"token_name"),
      //         option::some(royalty::create(1,1,signer::address_of(creator))),
      //         string::utf8(b"token_uri")
      //         );
      //     // Create a reference for burning an NFT
      //     let burn_ref = token::generate_burn_ref(token_constructor_ref);
      //     move_to(
      //         creator,
      //         TokenRefsStore{
      //             burn_ref,
      //         }
      //     );
      // }`,
      //         answer: `
      // module case::nft{
      //     struct TokenRefsStore has key {
      //         burn_ref: token::BurnRef,
      //     }
      //     public entry fun create_collection(creator: &signer) {
      //         let max_supply = 1000;
      //         let collection_construcor_ref = &collection::create_fixed_collection(
      //             creator,
      //             string::utf8(b"collection_description"),
      //             max_supply,
      //             string::utf8(b"collection_name"),
      //             option::some(royalty::create(1,1,signer::address_of(creator))),
      //             string::utf8(b"collectionURI"),
      //         );
      //     }
      //     public entry fun mint(creator: &signer){
      //         let token_constructor_ref = &token::create(
      //             creator,
      //             string::utf8(b"collection_name"),
      //             string::utf8(b"token_description"),
      //             string::utf8(b"token_name"),
      //             option::some(royalty::create(1,1,signer::address_of(creator))),
      //             string::utf8(b"token_uri")
      //             );
      //         // Create a reference for burning an NFT
      //         let burn_ref = token::generate_burn_ref(token_constructor_ref);
      //         move_to(
      //             creator,
      //             TokenRefsStore{
      //                 burn_ref,
      //             }
      //         );
      //     }
      // }`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
      //       {
      //         id: 8,
      //         title: '8. 创建一个销毁 NFT 的函数',
      //         note: '',
      //         tips: '',
      //         analyze: '',
      //         content: `在 module case::nft 的 {} 中输入：
      // public entry fun burn(creator:&signer) acquires TokenRefsStore {
      //     let TokenRefsStore{
      //         burn_ref,
      //     } = move_from<TokenRefsStore>(signer::address_of(creator));
      //     token::burn(burn_ref)
      // }`,
      //         answer: `
      // module case::nft{
      //     struct TokenRefsStore has key {
      //         burn_ref: token::BurnRef,
      //     }
      //     public entry fun create_collection(creator: &signer) {
      //         let max_supply = 1000;
      //         let collection_construcor_ref = &collection::create_fixed_collection(
      //             creator,
      //             string::utf8(b"collection_description"),
      //             max_supply,
      //             string::utf8(b"collection_name"),
      //             option::some(royalty::create(1,1,signer::address_of(creator))),
      //             string::utf8(b"collectionURI"),
      //         );
      //     }
      //     public entry fun mint(creator: &signer){
      //         let token_constructor_ref = &token::create(
      //             creator,
      //             string::utf8(b"collection_name"),
      //             string::utf8(b"token_description"),
      //             string::utf8(b"token_name"),
      //             option::some(royalty::create(1,1,signer::address_of(creator))),
      //             string::utf8(b"token_uri")
      //             );
      //         // Create a reference for burning an NFT
      //         let burn_ref = token::generate_burn_ref(token_constructor_ref);
      //         move_to(
      //             creator,
      //             TokenRefsStore{
      //                 burn_ref,
      //             }
      //         );
      //     }
      //     public entry fun burn(creator:&signer) acquires TokenRefsStore {
      //         let TokenRefsStore{
      //             burn_ref,
      //         } = move_from<TokenRefsStore>(signer::address_of(creator));
      //         token::burn(burn_ref)
      //     }
      // }`,
      //         fileStructure: [
      //           {
      //             root: [
      //               'Move.toml',
      //               { '.aptos': ['config.yaml'] },
      //               { sources: ['nft.move'] },
      //             ],
      //           },
      //         ],
      //       },
    ],
  })
  useEffect(() => {
    // Check if all steps are completed
    setIsCompleted(currentStepIndex >= project.steps.length - 1)
  }, [currentStepIndex, project.steps.length])

  useEffect(() => {
    // 更新 code 状态
    setCode(editorCode)
    console.log('[INFO]: ', editorCode)

    // 设定错误提示
    setError('请输入: ' + project.steps[currentStepIndex].answer)

    const isEqual = (inputValue: string, answer: string) => {
      const cleanInput = inputValue.replace(/\s+/g, '').trim() // 删除空格和换行符
      const cleanExpected = answer.replace(/\s+/g, '').trim() // 删除空格和换行符

      return cleanInput === cleanExpected
    }
    // 检查用户输入
    if (isEqual(code, project.steps[currentStepIndex].answer)) {
      console.log('[INFO] TrackNFT.tsx: 用户的输入与预期输出匹配')

      // 清空代码和错误
      setCode('')
      setError('')

      // 更新步骤索引
      if (currentStepIndex < project.steps.length - 1) {
        setCurrentStepIndex((prevIndex) => prevIndex + 1)
        // setUserInput('')
      } else {
        setCompleted(true)
      }
    }
  }, [code, currentStepIndex, project.steps, editorCode])

  const progress = Math.round((currentStepIndex / project.steps.length) * 100)

  //  自定义文件结构
  const handleUpdateFileStructre = (
    updatedFiles: FileStructure,
    selectedPath?: string[]
  ) => {
    console.log(updatedFiles)
    if (selectedPath) {
      console.log('[INFO](TrackNFT.tsx) 选择的 item 路径是:', selectedPath)
    }
  }

  // 确认
  const handleConfirm = () => {
    setCompleted(false)
    setCurrentStepIndex(0)
    // setUserInput('')
    setCode('')
  }

  // 提交
  const handleSubmit = () => {
    setIsSubmitDialogOpen(true)
  }

  useEffect(() => {
    localStorage.setItem(
      'projectProgress',
      JSON.stringify({ projectId: project.id, stepIndex: currentStepIndex })
    )
    // changeFileStructure(step.fileStructure)
    setInitialFiles(project.steps[currentStepIndex].fileStructure)
  }, [currentStepIndex, project.id, project.steps])

  // 完成项目
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-full max-w-4xl p-6 bg-black rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white flex justify-center items-center">
            恭喜完成项目!
          </h2>
          <div className="flex flex-col items-center mb-6">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl mb-2 text-white">项目里程碑</h3>
            {project.steps.map((step) => (
              <div key={step.id} className="flex items-center mb-2 text-white">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                <span>{step.title}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              确认
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              提交
            </button>
          </div>
        </div>

        <Transition appear show={isSubmitDialogOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={() => setIsSubmitDialogOpen(false)}
          >
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    项目已提交
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      您的项目已成功提交。感谢您的完成！
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={() => {
                        setIsSubmitDialogOpen(false)
                        handleConfirm()
                      }}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </div>
    )
  }

  const renderContent = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              All steps completed!
            </h2>
            <p className="text-gray-400">
              Congratulations on finishing the project.
            </p>
          </div>
        </div>
      )
    }

    return (
      <>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 flex items-center text-blue-300">
            <FileText className="mr-2" size={20} />
            进程
          </h2>
          <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-400">{progress}% Complete</p>
        </div>

        <div className="mb-8 bg-gray-800 bg-opacity-50 rounded-lg p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-300">
            <ChevronRight className="mr-2" size={20} />
            当前步骤 {project.steps[currentStepIndex].title}
          </h2>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg max-h-64 overflow-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {project.steps[currentStepIndex].content}
            </pre>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="flex border-b border-gray-700">
            <button
              className={`py-3 px-6 font-medium transition-colors duration-200 ${
                activeTab === 'editor'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('editor')}
            >
              <Code className="inline mr-2" size={18} />
              编辑器
            </button>
            <button
              className={`py-3 px-6 font-medium transition-colors duration-200 ${
                activeTab === 'error'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('error')}
            >
              <AlertCircle className="inline mr-2" size={18} />
              答案
            </button>
          </div>
          <div className="p-4">
            {activeTab === 'editor' && (
              <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg">
                <div className="h-64 w-full">
                  <MoveEditorWrapper initialCode={code} />
                </div>
              </div>
            )}
            {activeTab === 'error' && error && (
              <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                  <pre className="text-xs font-medium text-green-300 overflow-x-auto">
                    {error}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="flex h-full bg-black">
      <div className="flex h-screen bg-gray-900 text-gray-100  overflow-auto">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 ease-in-out overflow-hidden`}
        >
          <div className="h-full bg-gradient-to-b from-gray-800 to-gray-900 p-4 overflow-auto">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
              <Folder className="mr-2" size={20} />
              项目文件
            </h2>
            <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg shadow-lg backdrop-blur-sm">
              <FileStructureTree
                initialFiles={initialFiles}
                initialFileContents={initialFileContents}
                onUpdate={handleUpdateFileStructre}
                allowEdit={false}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-blue-400">{project.name}</h1>
            <div className="w-24"></div> {/* Placeholder for balance */}
          </header>

          <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {renderContent()}
          </main>
        </div>

        {/* Step Preview */}
        <div className="w-72 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-4 overflow-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
            <FileText className="mr-2" size={20} />
            步骤预览
          </h2>
          <ul className="space-y-2">
            {project.steps.map((step, index) => (
              <li
                key={step.id}
                className={`p-3 rounded-md flex items-center justify-between transition-all duration-200 ${
                  index === currentStepIndex
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : index < currentStepIndex
                    ? 'bg-green-700 bg-opacity-50 text-white'
                    : 'bg-gray-700 bg-opacity-50 text-gray-300'
                }`}
              >
                <span className="text-sm">{step.title}</span>
                {index < currentStepIndex && (
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TrackNFT
