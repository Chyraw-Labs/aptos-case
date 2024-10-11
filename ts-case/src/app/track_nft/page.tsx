'use client'
import TrackNFT from '@/components/track_nft/TrackNFT'
// import TrackNFT from '@/components/TrackNFT'
// import ProjectTrack from '@/components/TrackNFT'
import Image from 'next/image'
import { useState } from 'react'
import { FileStructure } from '@/components/FileStructureTree'

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
}

export default function Home() {
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
        id: 0,
        title: '0. 项目介绍',
        note: `本教程是一个模拟教程，请不要在真实环境中使用本教程中的代码和合约地址。在下方编辑器中删除已有内容，然后输入 OK ，即表示您已经明白本教程的注意事项。点击左侧 README.md 查看详细使用方法。`,
        tips: `OK`,
        analyze: `在这里会给出每一个步骤的代码和操作详细解析`,
        content: `这是一个从零创建基础 NFT 项目的教程，我们将使用 Move 语言来编写智能合约。本教程将介绍如何初始化项目、编写智能合约、编译和部署合约等步骤。`,
        answer: `OK`,
        fileStructure: [{ root: ['README.md'] }],
      },
      // 初始化 Move 项目
      {
        id: 1,
        title: '1. 初始化 Move 项目',
        note: '请不要更改项目名称',
        tips: 'aptos move init --name my_nft',
        analyze: '这个命令将会创建一个 Move 项目结构',
        content: `清空编辑器中的内容后，输入:`,
        answer: `aptos move init --name my_nft`,
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
        fileStructure: [{ root: ['Move.toml', { sources: [] }] }],
      },
      // 编辑 Move.toml 文件，配置地址别名
      {
        id: 3,
        title: '3-1. 编辑 Move 配置文件 Move.toml，配置地址别名',
        note: '请务必检查 README.md',
        tips: '',
        analyze: '：case 是自定义的地址别名，0x42 是区块链中的地址，它由',
        content: `点击 Move.toml 文件，复制内容到下方编辑器，添加地址别名。地址为 config.yaml 文件中 account 后的字符串。输入:
      [addresses]
      case="你在 config.yaml 中的地址字符串"
      💡 解析`,
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
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
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
        content: `清空编辑器中刚才输入的命令后，使用 touch 命令创建文件:
      touch sources/nft.move
      💡 解析：这个命令将会在 sources 下创建 nft.move 文件`,
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
        content: `清空编辑器中刚才输入的命令后，输入:
      module case::nft{

      }
      💡 解析：module 表示这是一个模块，其中 case 是刚才定义的地址别名，`,
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
        content: `在 module case::nft 的 {} 中输入：
      struct TokenRefsStore has key {
          burn_ref: token::BurnRef,
      }`,
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
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
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
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
        answer: `
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
        note: '',
        tips: '',
        analyze: '',
        content: `在 module case::nft 的 {} 中输入：
      public entry fun burn(creator:&signer) acquires TokenRefsStore {
          let TokenRefsStore{
              burn_ref,
          } = move_from<TokenRefsStore>(signer::address_of(creator));
          token::burn(burn_ref)
      }`,
        answer: `
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
        <div className="h-full overflow-auto">
          <TrackNFT
            project={project}
            initialFiles={initialFiles}
            initialFileContents={initialFileContents}
            onReturn={openHome}
            onSubmit={submit}
          />
        </div>
      </main>
    </div>
  )
}
