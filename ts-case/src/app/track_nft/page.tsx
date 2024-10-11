'use client'
import TrackNFT from '@/components/track_nft/TrackNFT'
// import TrackNFT from '@/components/TrackNFT'
// import ProjectTrack from '@/components/TrackNFT'
import Image from 'next/image'
import { useState } from 'react'
import { FileStructure } from '@/components/FileStructureTree'
// import { useIdGenerator } from '@/components/Tools'
interface Project {
  id: number
  name: string
  steps: Step[]
}

interface Step {
  id: number
  title: string
  note: string // 注意
  content: string // 内容
  tips: string // 提示
  analyze: string //解析
  answer: string // 正确答案
  fileStructure: FileStructure
  presetCode?: string
}

export default function Home() {
  // const generateId = useIdGenerator()

  const initialFiles: FileStructure = [
    { root: ['README.md', 'Move.toml', { sources: ['main.move'] }] },
  ]

  //   const initialFileContents: [string, string][] = [
  //     [
  //       'root/README.md',
  //       `🚨 注意：
  //   本教程是一个模拟创建 NFT 的教程，
  //   该合约地址可能已经存在风险，
  //   请不要在真实环境中使用本教程中的代码和合约地址。

  //   🔔 提示：
  //   跟随这个教程，您将学会如何在 Aptos 公链完成 NFT 合约的创建、编译和部署。`,
  //     ],
  //     [
  //       'root/.aptos/config.yaml',
  //       `---
  //   profiles:
  //     default:
  //       network: Testnet
  //       private_key: "0xedab30e3e86cc397fe1f97af801fa28e4f706a35442ce50e2eb6582034d51540"
  //       public_key: "0x6f983917c31e22cbcc3026326c8ff04a9fb48836b5535821ba4fc59dcc6dc319"
  //       account: 4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46
  //       rest_url: "https://fullnode.testnet.aptoslabs.com"
  //       faucet_url: "https://faucet.testnet.aptoslabs.com"`,
  //     ],
  //     [
  //       'root/Move.toml',
  //       `[package]
  //   name = "my_nft"
  //   version = "1.0.0"
  //   authors = []

  //   [addresses]

  //   [dev-addresses]

  //   [dependencies.AptosFramework]
  //   git = "https://github.com/aptos-labs/aptos-core.git"
  //   rev = "mainnet"
  //   subdir = "aptos-move/framework/aptos-framework"

  //   [dev-dependencies]`,
  //     ],
  //     [
  //       'root/sources/nft.move',
  //       `// 示例
  //   // https://github.com/caoyang2002/Aptos-Docs/blob/main/AIP/aip-22.md
  //   // https://github.com/caoyang2002/aptos_mvoe-learning/blob/main/NFT/create_one_nft/sources/create_first_nft.move
  //   module MyNFT::first_NFT{

  //       use std::option;
  //       use std::signer;
  //       use std::string;
  //       use aptos_token_objects::collection;
  //       use aptos_token_objects::royalty;
  //       use aptos_token_objects::token;

  //       struct TokenRefsStore has key {
  //           burn_ref: token::BurnRef,
  //       }

  //       // step one: create a collection
  //       public entry fun create_collection(creator: &signer) {
  //           let max_supply = 1000;
  //           let collection_construcor_ref = &collection::create_fixed_collection(
  //               creator,
  //               string::utf8(b"collection_description"),
  //               max_supply,
  //               string::utf8(b"collection_name"),
  //               option::some(royalty::create(1,1,signer::address_of(creator))),
  //               string::utf8(b"collectionURI"),
  //           );
  //       }

  //       // step two: mint NFT
  //       public entry fun mint(creator: &signer){
  //           let token_constructor_ref = &token::create(
  //               creator,
  //               string::utf8(b"collection_name"),
  //               string::utf8(b"token_description"),
  //               string::utf8(b"token_name"),
  //               option::some(royalty::create(1,1,signer::address_of(creator))),
  //               string::utf8(b"token_uri")
  //               );
  //           // Create a reference for burning an NFT
  //           let burn_ref = token::generate_burn_ref(token_constructor_ref);
  //           move_to(
  //               creator,
  //               TokenRefsStore{
  //                   burn_ref,
  //               }
  //           );
  //       }

  //       public entry fun burn(creator:&signer) acquires TokenRefsStore {
  //           let TokenRefsStore{
  //               burn_ref,
  //           } = move_from<TokenRefsStore>(signer::address_of(creator));
  //           token::burn(burn_ref)
  //       }
  //   }`,
  //     ],
  //   ]

  //   const [project] = useState<Project>({
  //     id: 1,
  //     name: '从零创建基础 NFT 项目',
  //     steps: [
  //       // 项目介绍
  //       {
  //         id: 1,
  //         title: '0. 项目介绍',
  //         note: '',
  //         tips: '',
  //         analyze: '',
  //         content: `这是一个从零创建基础 NFT 项目的教程，我们将使用 Move 语言来编写智能合约。
  // 本教程将介绍如何初始化项目、编写智能合约、编译和部署合约等步骤。

  // 🚨 注意：
  // 本教程是一个模拟教程，请不要在真实环境中使用本教程中的代码和合约地址。在下方编辑器中删除已有内容，然后输入 OK ，即表示您已经明白本教程的注意事项。

  // ✅ 使用方法：
  // 1. 当您输入正确的代码后会自动进入下一个步骤。
  // 2. 如果您一直无法进入下一个步骤，可以从下方提示框中复制代码到输入框，以便于你进入下一个步骤（可能需要在旁边的黑色区域滑动）。
  // 3. 点击左侧文件结构中的文件名，可以查看文件内容。
  // 4. 本教程不会跟踪您的操作，意味着您的任何退出，都将重新开始本教程，但是你可以复制提示框中的代码，以快速进入到你希望去的步骤。
  // 5. 如果您执行查看步骤解析，您可以在左侧点击 README.md 文件查看。

  // 💻 输入：
  // OK

  // 💡 解析：
  // 在这里会给出每一个步骤的代码和操作详细解析`,
  //         answer: `OK`,
  //         fileStructure: [{ root: ['README.md'] }],
  //       },
  //       // 初始化 Move 项目
  //       {
  //         id: 1,
  //         title: '1. 初始化 Move 项目',
  //         note: `注意：
  // 本教程是一个模拟教程，请不要在真实环境中使用本教程中的代码和合约地址。在下方编辑器中删除已有内容，然后输入 OK ，即表示您已经明白本教程的注意事项。`,
  //         tips: `使用方法：
  // 1. 当您输入正确的代码后会自动进入下一个步骤。
  // 2. 如果您一直无法进入下一个步骤，可以从下方提示框中复制代码到输入框，以便于你进入下一个步骤（可能需要在旁边的黑色区域滑动）。
  // 3. 点击左侧文件结构中的文件名，可以查看文件内容。
  // 4. 本教程不会跟踪您的操作，意味着您的任何退出，都将重新开始本教程，但是你可以复制提示框中的代码，以快速进入到你希望去的步骤。
  // 5. 如果您执行查看步骤解析，您可以在左侧点击 README.md 文件查看。`,
  //         analyze: `解析：这个命令将会创建一个 aptos 账户到 .aptos/config.toml，其中包含了地址、私钥和公钥，请勿泄漏`,
  //         content: `清空编辑器中的内容后，输入:
  // aptos move init --name my_nft
  // 💡 解析：
  // 这个命令将会创建一个 Move 项目结构`,
  //         answer: `
  // aptos move init --name my_nft`,
  //         fileStructure: [{ root: ['README.md'] }],
  //       },
  //       // 创建 Aptos 的链上账户
  //       {
  //         id: 2,
  //         title: '2. 创建 Aptos 链上账户',
  //         note: `注意：
  //         本教程是一个模拟教程，请不要在真实环境中使用本教程中的代码和合约地址。在下方编辑器中删除已有内容，然后输入 OK ，即表示您已经明白本教程的注意事项。`,
  //         tips: `使用方法：
  //         1. 当您输入正确的代码后会自动进入下一个步骤。
  //         2. 如果您一直无法进入下一个步骤，可以从下方提示框中复制代码到输入框，以便于你进入下一个步骤（可能需要在旁边的黑色区域滑动）。
  //         3. 点击左侧文件结构中的文件名，可以查看文件内容。
  //         4. 本教程不会跟踪您的操作，意味着您的任何退出，都将重新开始本教程，但是你可以复制提示框中的代码，以快速进入到你希望去的步骤。
  //         5. 如果您执行查看步骤解析，您可以在左侧点击 README.md 文件查看。`,
  //         analyze: `解析：这个命令将会创建一个 aptos 账户到 .aptos/config.toml，其中包含了地址、私钥和公钥，请勿泄漏`,
  //         content: `清空编辑器中刚才输入的命令后，输入:
  // aptos init
  // 💡 解析：这个命令将会创建一个 aptos 账户到 .aptos/config.toml，其中包含了地址、私钥和公钥，请勿泄漏`,
  //         answer: `
  // aptos init`,
  //         fileStructure: [{ root: ['Move.toml', { sources: [] }] }],
  //       },
  //     ],
  //   })

  const initialFileContents: [string, string][] = [
    [
      'root/README.md',
      `🚨 注意：
本教程是一个模拟创建 NFT 的教程，
该合约地址可能已经存在风险，
请不要在真实环境中使用本教程中的代码和合约地址。

🔔 提示：
跟随这个教程，您将学会如何在 Aptos 公链完成 NFT 合约的创建、编译和部署。

✅ 使用方法：
1. 当您输入正确的代码后会自动进入下一个步骤。\n
2. 如果您一直无法进入下一个步骤，可以从下方提示框中复制代码到输入框，以便于你进入下一个步骤（可能需要在旁边的黑色区域滑动）。
3. 点击左侧文件结构中的文件名，可以查看文件内容。
4. 本教程不会跟踪您的操作，意味着您的任何退出，都将重新开始本教程，但是你可以复制提示框中的代码，以快速进入到你希望去的步骤。`,
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
        note: `本教程是一个模拟教程，请不要在真实环境中使用本教程中的代码和合约地址。在下方编辑器中删除已有内容，然后输入 OK ，即表示您已经明白本教程的注意事项。点击左侧 README.md 查看详细使用方法。`,
        tips: `OK`,
        analyze: `在这里会给出每一个步骤的代码和操作详细解析`,
        content: `这是一个从零创建基础 NFT 项目的教程，我们将使用 Move 语言来编写智能合约。本教程将介绍如何初始化项目、编写智能合约、编译和部署合约等步骤。`,
        presetCode: '// 请在这里输入您的代码（输入前请删除此行）',
        answer: `OK`,
        fileStructure: [{ root: ['README.md'] }],
      },
      // 初始化 Move 项目
      {
        id: 2,
        title: '1. 初始化 Move 项目',
        note: '请不要更改项目名称',
        tips: 'aptos move init --name my_nft',
        analyze: '这个命令将会创建一个 Move 项目结构',
        content: `清空编辑器中的内容后，输入:`,
        answer: `aptos move init --name my_nft`,
        presetCode: '',
        fileStructure: [{ root: ['README.md'] }],
      },
      // 创建 Aptos 的链上账户
      {
        id: 2,
        title: '2. 创建 Aptos 链上账户',
        note: '请不要更改网络名称',
        tips: `aptos init --network testnet`,
        analyze: `这个命令将会创建一个 aptos 账户到 .aptos/config.toml，其中包含了地址、私钥和公钥，请勿泄漏`,
        content: `创建 Aptos 链上账户`,
        answer: `aptos init --network testnet`,
        presetCode: '',
        fileStructure: [{ root: ['README.md', 'Move.toml', { sources: [] }] }],
      },
      // 编辑 Move.toml 文件，配置地址别名
      {
        id: 3,
        title: '3. 编辑 Move 配置文件 Move.toml，配置地址别名',
        note: 'case 名称不可更改，‘case=’ 后面有双引号 ""',
        tips: `[package]
...

[addresses]
case="你在 config.yaml 中的地址字符串"

...
[dev-dependencies]`,
        analyze: `case 是自定义的地址别名，0x42 是 Aptos 的链上账户地址，它由 64 个十六进制字符组成，你可以使用这个地址接收 NFT 和 Token 等资源`,
        content: `点击左侧 Move.toml 文件，复制内容到下方编辑器，添加地址别名。地址为 config.yaml 文件中 account 后的字符串。`,
        answer: `[package]
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
        presetCode: '',
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 4,
        title: '4. 添加 AptosTokenObjects 依赖',
        note: '继续编辑 Move.toml 文件：AptosTokenObjects 包含了 AptosFramework，在开发实践中并不一定需要将依赖更换为 AptosTokenObjects，在但是在本项目中是必须的，因为会使用到这个依赖中的特定模块',
        tips: `[package]
...

[dependencies.AptosTokenObjects]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "testnet"
subdir = "aptos-move/framework/aptos-token-objects"

...
[dev-dependencies]`,

        analyze: `这个命令将会在 sources 目录下创建 nft.move 文件`,
        content: `删除：[dependencies.AptosFramework] 及其子项，并更改为 [dependencies.AptosTokenObjects] 依赖`,
        answer: `[package]
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
        presetCode: `[package]
name = "my_nft"
version = "1.0.0"
authors = []

[addresses]
case="4d07b90d60c60b8c737fbca7b38e83424755ee24c9d8fe4dfb2481420303ab46"

[dev-addresses]

// 请在这里执行您的操作（操作前请删除此行）
[dependencies.AptosFramework]
git = "https://github.com/aptos-labs/aptos-core.git"
rev = "mainnet"
subdir = "aptos-move/framework/aptos-framework"

[dev-dependencies]`,
        fileStructure: [
          {
            root: [
              'README.md',
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
        note: '在实际操作中，这个命令属于 Linux，在Windows 上需要使用 PowerShell 执行此命令',
        tips: `touch sources/nft.move`,
        analyze:
          '这个命令将会在 sources 下创建 nft.move 文件，在 Move 编码规范中，建议文件名和模块名一致',
        content: `清空编辑器中刚才输入的命令后，使用 touch 命令创建 nft.move文件`,
        answer: `touch sources/nft.move`,
        presetCode: ``,
        fileStructure: [
          {
            root: [
              'README.md',
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
        note: `在其他地方你可能见过 "script {}"，这是脚本的定义方式，请勿在此使用`,
        tips: `module case::nft{

}`,
        analyze: `module 表示这是一个模块，其中 case 是刚才定义的地址别名，nfy 是模块名，之后的代码需要写在大括号 {} 中`,
        content: `定义 NFT 模块`,
        answer: `module case::nft{

}`,
        presetCode: ``,
        fileStructure: [
          {
            root: [
              'README.md',
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
        note: '请不要更改结构体名称，Move 不支持非 ascii 字符，即无法使用中文字符',
        tips: `struct TokenRefsStore has key {
    burn_ref: token::BurnRef,
}`,
        analyze: `struct 表示这是一个结构体，名称为 TokenRefsStore，has 表示这个结构体具备的能力，key 表示作为键的能力，字段为 burn_ref，类型为 token::BurnRef
我们目前使用了 token 模块的 BurnRef 类型，这种类型是由  aptos_token_objects 提供的所以我们需要在下一步引入这个类型`,
        content: `在 module case::nft 的 {} 中输入：
      struct TokenRefsStore has key {
          burn_ref: token::BurnRef,
      }`,
        answer: `module case::nft{
    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
}`,
        presetCode: `module case::nft{
    // 在这里输入您的代码（输入前请删除此行）
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 8,
        title: '8. 引入指定类型',
        content: `使用 use 关键字，从 aptos_token_objects 中引入 token，语法为 "模块名::类型;"`,
        note: '引入模块的语句在可以任意位置，但是为了规范，建议您仅接着 module 后 {} 的起始位置，注意末尾有一个分号“;”',
        tips: 'use aptos_token_objects::token;',
        analyze: `aptos_token_objects 模块可以调用，是因为我们最开始的时候 在 Move.toml 中加入了 [dependencies.AptosTokenObjects] 依赖，所有的关于 token 的操作都在这里面`,
        presetCode: `module case::nft{
    // 在这里写下您的代码（输入前请删除此行）

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
}`,
        answer: `module case::nft{
    use aptos_token_objects::token;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 9,
        title: '9. 创建 create_collection 用于收集所有的 NFT',
        content: `创建 create_collection 函数`,
        note: `请勿更改结构体名称，以及结构体中的字段名称`,
        tips: 'fun create_collection() {}',
        analyze: `aptos_token_objects 模块可以调用，是因为我们最开始的时候 在 Move.toml 中加入了 [dependencies.AptosTokenObjects] 依赖，所有的关于 token 的操作都在这里面，token::BurnRef 是销毁 NFT 的引用`,
        presetCode: `module case::nft{
    // 在这里写下您的代码（输入前请删除此行）

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
}`,
        answer: `module case::nft{
    use aptos_token_objects::token;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },

      {
        id: 10,
        title: '10. 创建 create_collection 函数',
        content: `在 module case::nft 的 {} 中输入：fun create_collection() {}，这实际上是创建了一个 collection 用于收集 NTF`,
        note: '请勿更改函数名称',
        tips: `fun create_collection() {
}`,
        analyze: `fun 是定义函数的关键字，这里的 create_collection 是函数签名，() 是函数参数，目前为空，{} 里放是函数体，目前为空`,
        presetCode: `module case::nft{
    use aptos_token_objects::token; 

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    // 在这里写下您的代码（输入前，请删除此行）
}`,
        answer: `module case::nft{
    use aptos_token_objects::token;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }
    fun create_collection() {
       
    }
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 11,
        title:
          '11. 在函数体内定义 collection 构造器引用 collection_construcor_ref',
        note: '请勿更改变量名称，语句末尾需要加分号 ";"',
        tips: `let collection_construcor_ref = &collection::create_fixed_collection()`,
        analyze:
          'let 是定义变量的关键字，& 表示不可变引用，（可变引用为 &mut）意在使用 create_fixed_collection() 返回的引用，而不实际拥有该对，这一般用于仅仅需要使用而不更改的情况下。在这里，我们使用了 collection 函数，但是并没有引入它，所以下一步我们需要引入它',
        content: `在 fun create_collection() {} 中，使用 let 和 & 关键字，通过 collection 中的 create_fixed_collection() 函数，定义保存 collection 构造器引用的变量，create_fixed_collection() 会创建一个固定供应量的 collection，所以在之后我们还需要设置它的再大供应量。Move 能够进行自动类型推断，所以不用显示标注类型。`,
        presetCode: `module case::nft{
    use aptos_token_objects::token; 

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    fun create_collection() {
        // 在这里写下您的代码 （输入前请删除此行）

    }
}`,
        answer: `module case::nft{
    use aptos_token_objects::token;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    fun create_collection() {
        let collection_construcor_ref = &collection::create_fixed_collection();
    }
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 12,
        title: '12. 导入 collection 函数',
        note: '请勿进行其他操作',
        tips: `use aptos_token_objects::collection;`,
        analyze: `目前我们已经成功学习了定义函数、变量以及导入包`,
        content: `使用 use 关键字 在 aptos_token_objects 依赖下导入 collection 模块`,
        presetCode: `module case::nft{
    use aptos_token_objects::token; 
    // 在这里写下您的代码 （输入前请删除此行）

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    fun create_collection() {
       let collection_construcor_ref = &collection::create_fixed_collection(); 
    }
}`,
        answer: `module case::nft{
    use aptos_token_objects::token;
    use aptos_token_objects::collection;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    fun create_collection() {
        let collection_construcor_ref = &collection::create_fixed_collection();
    }
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 13,
        title: '13. 定义最大供应量为 1000',
        note: '请勿更改变量名称。为了熟悉语法，请为变量添加类型',
        tips: `let max_supply:u64 = 1000;`,
        analyze: `u64 是 Move 的原始类型，Move 仍然能够自动推断，在实际生产环境中可以不用写。最大供应量是 NFT （ERC-721）特有的，旨在提供独一无二的 Token`,
        content: `定义 NFT 的最大供应量为 1000`,
        answer: `module case::nft{
    use aptos_token_objects::collection;
    use aptos_token_objects::token;

    struct TokenRefsStore has key {
        burn_ref: token::BurnRef,
    }

    fun create_collection() {
        let max_supply = 1000;
        let collection_construcor_ref = &collection::create_fixed_collection();
    }
}`,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      {
        id: 14,
        title: '14. 敬请期待',
        note: '敬请期待',
        tips: `ok`,
        analyze: `解析`,
        content: `输入 ok 完成本节`,
        answer: `ok`,
        presetCode: ``,
        fileStructure: [
          {
            root: [
              'README.md',
              'Move.toml',
              { '.aptos': ['config.yaml'] },
              { sources: ['nft.move'] },
            ],
          },
        ],
      },
      // 待编辑
      // {
      //   id: 14,
      //   title:
      //     '14. 在函数体内定义 collection 构造器引用 collection_construcor_ref',
      //   note: '请勿更改变量名称',
      //   tips: `let collection_construcor_ref = &collection::create_fixed_collection()`,
      //   analyze:
      //     'let 是定义变量的关键字，& 表示不可变引用，（可变引用为 &mut）意在使用 create_fixed_collection() 返回的引用，而不实际拥有该对，这一般用于仅仅需要使用而不更改的情况下。',
      //   content: `fun create_collection() {} 中定义保存 collection 构造器引用的变量`,
      //   answer: `
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
      //   fileStructure: [
      //     {
      //       root: [
      //         'README.md',
      //         'Move.toml',
      //         { '.aptos': ['config.yaml'] },
      //         { sources: ['nft.move'] },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: 10,
      //   title: '8. 创建一个销毁 NFT 的函数',
      //   note: '',
      //   tips: '',
      //   analyze: '',
      //   content: `在 module case::nft 的 {} 中输入：
      // public entry fun burn(creator:&signer) acquires TokenRefsStore {
      //     let TokenRefsStore{
      //         burn_ref,
      //     } = move_from<TokenRefsStore>(signer::address_of(creator));
      //     token::burn(burn_ref)
      // }`,
      //   answer: `
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
      //   fileStructure: [
      //     {
      //       root: [
      //         'README.md',
      //         'Move.toml',
      //         { '.aptos': ['config.yaml'] },
      //         { sources: ['nft.move'] },
      //       ],
      //     },
      //   ],
      // },
    ],
  })

  const openHome = () => {
    window.open('/')
  }
  const submit = () => {
    console.log('to submit')
  }
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <header className="flex justify-center items-center h-16 flex-shrink-0">
        <a href="/" className="flex items-center">
          <Image
            className="flex-shrink-0"
            src="/assets/logo.svg"
            alt="logo"
            width={40}
            height={40}
          />
          <h1 className="px-2 font-bold text-md">Aptos Case</h1>
        </a>
      </header>
      <main className="flex-grow overflow-hidden">
        <TrackNFT
          project={project}
          initialFiles={initialFiles}
          initialFileContents={initialFileContents}
          onReturn={openHome}
          onSubmit={submit}
        />
      </main>
    </div>
  )
}
