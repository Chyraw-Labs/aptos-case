// NFT 创建教程
import React, { useState, useEffect, Fragment } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import FileStructureTree, { FileStructure } from './FileStructureTree'
import { useMoveEditor } from './MoveEditorProvider'
import MoveEditorWrapper from './EditorWrapper'

interface Step {
  id: number
  title: string
  content: string
  expectedOutput: string
  fileStructure: FileStructure
}

interface Project {
  id: number
  name: string
  steps: Step[]
}

const TrackBasicSyntax = () => {
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

  const initialFileContents: [string, string][] = [
    [
      'root/README.md',
      `这是一个基础语法的教程，
您将学习到：
1. Move 开发思想；
2. 编写符合 Move 规范的合约；
3. 命令行工具的基本使用。`,
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
name = "hi_aptos"
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

  const [project] = useState<Project>({
    id: 1,
    name: 'Move 合约基础开发教程',
    steps: [
      {
        id: 1,
        title: '1. 定义模块',
        content: `敬请期待`,
        expectedOutput: `aptos`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 引入包
      {
        id: 2,
        title: '2. 引入包',
        content: `敬请期待`,
        expectedOutput: `aptos`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 原始类型
      {
        id: 3,
        title: '3. 原始类型',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 局部变量和作用域
      {
        id: 4,
        title: '4. 局部变量和作用域',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 终止和断言
      {
        id: 5,
        title: '5. 终止和断言',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 条件语句
      {
        id: 6,
        title: '6. 条件语句',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 循环语句
      {
        id: 7,
        title: '7. 循环语句',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 函数
      {
        id: 8,
        title: '8. 函数',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 结构体和资源
      {
        id: 9,
        title: '9. 结构体和资源',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 常量
      {
        id: 10,
        title: '10. 常量',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 泛型
      {
        id: 11,
        title: '11. 泛型',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 能力
      {
        id: 12,
        title: '12. 能力',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 别名
      {
        id: 13,
        title: '13. 别名',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 友元
      {
        id: 19,
        title: '19. 友元',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 包
      {
        id: 20,
        title: '20. 包',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 单元测试
      {
        id: 21,
        title: '21. 单元测试',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // Move 证明器
      {
        id: 22,
        title: '22. Move 证明器',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 事件
      {
        id: 23,
        title: '23. 事件',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // 初始化模块
      {
        id: 24,
        title: '24. 初始化模块',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
      // Move 安全指南
      {
        id: 25,
        title: '25. Move 安全指南',
        content: `在 module case::nft 的 {} 中输入：`,
        expectedOutput: `none`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['hi_aptos.move'] },
            ],
          },
        ],
      },
    ],
  })

  useEffect(() => {
    // 更新 code 状态
    setCode(editorCode)
    console.log('[INFO]: ', editorCode)

    // 设定错误提示
    setError('请输入: ' + project.steps[currentStepIndex].expectedOutput)

    const isEqual = (inputValue: string, expectedOutput: string) => {
      const cleanInput = inputValue.replace(/\s+/g, '').trim() // 删除空格和换行符
      const cleanExpected = expectedOutput.replace(/\s+/g, '').trim() // 删除空格和换行符

      return cleanInput === cleanExpected
    }
    // 检查用户输入
    if (isEqual(code, project.steps[currentStepIndex].expectedOutput)) {
      console.log('[INFO] TrackBasicSyntax.tsx: 用户的输入与预期输出匹配')

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
      console.log(
        '[INFO](TrackBasicSyntax.tsx) 选择的 item 路径是:',
        selectedPath
      )
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // 完成项目
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="w-full max-w-4xl p-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl">
          <h2 className="text-4xl font-bold mb-8 text-white text-center">
            🎉 恭喜完成项目! 🎉
          </h2>
          <div className="flex flex-col items-center mb-10">
            <CheckCircle2 className="w-24 h-24 text-green-400 mb-8" />
            <h3 className="text-2xl mb-6 text-white">项目里程碑</h3>
            <div className="space-y-4 w-full max-w-md">
              {project.steps.map((step) => (
                <div
                  key={step.id}
                  className="flex items-center bg-white bg-opacity-20 rounded-lg p-4 transition-all duration-300 hover:bg-opacity-30"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" />
                  <span className="text-lg text-white">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-6">
            <button
              onClick={handleConfirm}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              确认
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
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
                {/* <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" /> */}
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

  // 主页面
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white overflow-hidden">
      {/* 左侧：动态增加或删除文件夹 */}
      <Transition
        show={isSidebarOpen}
        enter="transition-all duration-300"
        enterFrom="-ml-80"
        enterTo="ml-0"
        leave="transition-all duration-300"
        leaveFrom="ml-0"
        leaveTo="-ml-80"
      >
        <div className="w-80 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 overflow-auto border-r border-gray-700">
          <FileStructureTree
            initialFiles={initialFiles}
            initialFileContents={initialFileContents}
            onUpdate={handleUpdateFileStructre}
            allowEdit={false}
          />
        </div>
      </Transition>

      {/* 切换侧边栏按钮 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-r-lg focus:outline-none hover:bg-opacity-75 transition-all duration-300"
      >
        {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* 中间 */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          {project.name}
        </h1>
        {/* 进度条 */}
        <div className="w-full bg-gray-700 rounded-full h-4 mb-8 overflow-hidden">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-opacity-50 bg-stripes animate-move-stripes"></div>
          </div>
        </div>
        <div className="mb-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-4">当前步骤： </h2>
          <h3 className="text-2xl font-bold mb-4 text-blue-400">
            {project.steps[currentStepIndex].title}
          </h3>

          <pre className="bg-gray-800 bg-opacity-50 p-6 rounded-lg whitespace-pre-wrap max-h-96 overflow-auto text-gray-300 shadow-inner">
            {project.steps[currentStepIndex].content}
          </pre>
        </div>

        <div className="h-96 w-full mb-8 bg-black bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-xl overflow-hidden p-4 m-4 shadow-lg">
          <MoveEditorWrapper initialCode={code} />
        </div>

        {error && (
          <div className="p-6 mb-8 bg-red-900 bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" />
              <pre className="text-sm font-medium text-red-300">{error}</pre>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：步骤列表 */}
      <div className="w-80 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 overflow-auto border-l border-gray-700">
        <h2 className="text-2xl font-bold mb-6">步骤预览</h2>
        <ul className="space-y-3">
          {project.steps.map((step, index) => (
            <li
              key={step.id}
              className={`p-4 rounded-xl transition-all duration-300 ${
                index === currentStepIndex
                  ? 'bg-blue-600 bg-opacity-70 shadow-lg transform scale-105'
                  : index < currentStepIndex
                  ? 'bg-green-600 bg-opacity-50'
                  : 'bg-gray-700 bg-opacity-50'
              }`}
            >
              <div className="flex items-center">
                <span className="flex-grow">{step.title}</span>
                {index < currentStepIndex && (
                  <CheckCircle2 className="w-5 h-5 text-green-300 ml-2" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TrackBasicSyntax
