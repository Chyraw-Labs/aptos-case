import React, { useState, useEffect, Fragment } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import FileStructureTree, { FileStructure } from './FileStructureTree'
import { useMoveEditor } from './MoveEditorProvider'
import MoveEditorWrapper from './MoveEditorWrapper'

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

const ProjectTrack = () => {
  const [code, setCode] = useState('// 请在这里输入你的答案...')
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
    ['root/README.md', `这是一个创建 NFT 的教程`],
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

  const [project] = useState<Project>({
    id: 1,
    name: '从零创建基础 NFT 项目',
    steps: [
      {
        id: 1,
        title: '1. 初始化 Move 项目',
        content: `清空编辑器中的内容后，输入:
aptos move init --name my_nft
💡 解析：这个命令将会创建一个 Move 项目结构`,
        expectedOutput: `
aptos move init --name my_nft`,
        fileStructure: [{ root: ['README.md'] }],
      },
      {
        id: 2,
        title: '2. 创建 Aptos 账户',
        content: `清空编辑器中刚才输入的命令后，输入:
aptos init
💡 解析：这个命令将会创建一个 aptos 账户到 .aptos/config.toml，其中包含了地址、私钥和公钥，请勿泄漏`,
        expectedOutput: `
aptos init`,
        fileStructure: [{ root: ['Move.toml', { sources: [] }] }],
      },

      {
        id: 3,
        title: '3 编辑 Move 配置文件，配置地址别名',
        content: `3.1 点击 Move.toml 文件，复制内容到下方编辑器，添加地址别名。地址为 config.yaml 文件中 account 后的字符串。输入:
[addresses]
case="你在 config.yaml 中的地址字符串"
💡 解析：case 是自定义的地址别名，0x42 是区块链中的地址，它由`,
        expectedOutput: `
[package]
name = "my_nft"
version = "1.0.0"
authors = []

[addresses]
case="4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46"

[dev-addresses]

[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 4,
        title: '4. 继续编辑 Move.toml 文件，添加 AptosTokenObjects 依赖',
        content: `不清空编辑器中的内容，删除：
[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

添加：
[dependencies.AptosTokenObjects]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "testnet"
subdir = "aptos-move/framework/aptos-token-objects"

💡 解析：这个命令将会在 sources 下创建 nft.move 文件`,
        expectedOutput: `
[package]
name = "my_nft"
version = "1.0.0"
authors = []

[addresses]
case="4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46"

[dev-addresses]

[dependencies.AptosTokenObjects]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "testnet"
subdir = "aptos-move/framework/aptos-token-objects"

[dev-dependencies]`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 5,
        title: '5. 创建 Move 合约文件: nft.move',
        content: `清空编辑器中刚才输入的命令后，使用 touch 命令创建文件:
touch sources/nft.move
💡 解析：这个命令将会在 sources 下创建 nft.move 文件`,
        expectedOutput: `
touch sources/nft.move`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 6,
        title: '6. 在 nft.move 中定义 NFT 模块',
        content: `清空编辑器中刚才输入的命令后，输入: 
module case::nft{

}
💡 解析：module 表示这是一个模块，其中 case 是刚才定义的地址别名，`,
        expectedOutput: `
module case::nft{

}`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 7,
        title: '7. 在 NFT 模块中定义 NFT 引用的结构体',
        content: `在 module case::nft 的 {} 中输入：
struct TokenRefsStore has key {
    burn_ref: token::BurnRef,
}`,
        expectedOutput: `
module case::nft{
    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
}`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 8,
        title: '8. 创建一个 collection 用于保存 NTF',
        content: `在 module case::nft 的 {} 中输入：
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
}`,
        expectedOutput: `
module case::nft{
    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
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
}`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 7,
        title: '7. 添加创建 NFT 的函数',
        content: `在 module case::nft 的 {} 中输入：
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
}`,
        expectedOutput: `
module case::nft{
    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
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
}`,
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 8,
        title: '8. 创建一个销毁 NFT 的函数',
        content: `在 module case::nft 的 {} 中输入：
public entry fun burn(creator:&signer) acquires TokenRefsStore {
    let TokenRefsStore{
        burn_ref,
    } = move_from<TokenRefsStore>(signer::address_of(creator));
    token::burn(burn_ref)
}`,
        expectedOutput: `
module case::nft{
    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
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
        fileStructure: [
          {
            root: [
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
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
      console.log('[INFO] ProjectTrack.tsx: 用户的输入与预期输出匹配')

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
      console.log('[INFO](ProjectTrack.tsx) 选择的 item 路径是:', selectedPath)
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

  // 主页面
  return (
    <div className="flex h-full bg-black">
      {/* 左侧：动态增加或删除文件夹 */}
      <div className="w-80 bg-black p-6 overflow-auto">
        <FileStructureTree
          initialFiles={initialFiles}
          initialFileContents={initialFileContents}
          onUpdate={handleUpdateFileStructre}
          allowEdit={false} // or false to disable editing
        />
      </div>
      {/* 中间 */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4 text-white">{project.name}</h1>
        {/* 进度条 */}
        <div className="w-full bg-gray-400 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2 text-white">当前步骤： </h2>
          <h3 className="text-lg font-bold mb-2 text-white">
            {project.steps[currentStepIndex].title}
          </h3>

          <pre className="bg-gray-800 m-1 p-2 text-white rounded whitespace-pre-wrap max-h-96 overflow-auto">
            {project.steps[currentStepIndex].content}
          </pre>
        </div>

        <div style={{ height: '30vh', width: '100%' }}>
          <MoveEditorWrapper initialCode={code} />
        </div>
        {error && (
          <div className="p-4 my-4 mb-4 bg-blue-100 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
              <pre className="text-xs font-medium text-blue-800">{error}</pre>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：步骤列表 */}
      <div className="w-64 bg-black p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-white">步骤预览</h2>
        <ul>
          {project.steps.map((step, index) => (
            <li
              key={step.id}
              className={`mb-2 p-2 rounded  ${
                index === currentStepIndex
                  ? 'bg-blue-500 text-white'
                  : index < currentStepIndex
                  ? 'bg-green-200 text-black'
                  : 'bg-gray-400 text-white'
              }`}
            >
              {step.title}
              {index < currentStepIndex && (
                <CheckCircle2 className="inline w-4 h-4 ml-2 text-green-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectTrack
