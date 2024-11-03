export const TASK_APTOS_MOVE_INIT_NAME_HI_APTOS = `测试通过 ✅，成功创建 Move 项目结构`
export const TASK_APTOS_INIT_NETWORK_TESTNET = `测试通过 ✅，成功在测试网创建 aptos 账户`
export const TASK_APTOS_ACCOUNT_FUND_WITH_FAUCET_ACCOUNT_DEFAULT = `测试通过 ✅，成功在默认的 aptos 账户领取 Token`

export const CLI_APTOS_HELP = `用于开发和与Aptos区块链交互的命令行界面（CLI）

使用: aptos <命令>

命令：
  account     与账户交互的工具
  config      与Aptos CLI工具配置交互的工具
  genesis     设置Aptos链创世交易的工具
  governance  链上治理工具
  info        显示CLI的构建信息
  init        初始化当前目录以用于aptos工具的工具
  key         生成、检查和交互密钥的工具
  move        Move智能合约相关操作的工具
  multisig    与多重签名账户交互的工具
  node        与节点操作相关的工具
  stake       操作质押和质押池的工具
  update      更新CLI或它依赖的其他工具
  help        打印此消息或给定子命令的帮助信息

选项：
  -h, --help     打印帮助信息
  -V, --version  打印版本`

export const CLI_APTOS = CLI_APTOS_HELP

export const CLI_APTOS_MOVE = `与Move智能合约相关操作的工具

这个工具允许你编译、测试和发布Move代码，此外还可以运行任何其他有助于运行、验证或提供有关此代码信息的工具。

使用: aptos move <命令>

命令:
  build-publish-payload          构建一个发布交易的有效载荷，并将其存储在JSON输出文件中
  clean               清理一个包的衍生物
  clear-staging-area  清理账户下用于分块发布操作的'StagingArea'资源
  compile             编译一个包并返回关联的ModuleIds
  compile-script      将Move脚本编译成字节码
  coverage            计算一个包的覆盖率
  create-object-and-publish-package     在Aptos区块链下将Move包中的模块作为对象发布（'deploy-object'的旧版本）
  upgrade-object-package         升级在对象下部署的Move包中的模块（'upgrade-object'的旧版本）
  deploy-object       在Aptos区块链下将Move包中的模块作为对象发布
  upgrade-object      升级在对象下部署的Move包中的模块
  create-resource-account-and-publish-package     在Aptos区块链下将Move包中的模块发布到一个资源账户
  disassemble         将指向文本表示形式的Move字节码进行反汇编
  decompile   将Move字节码反编译成Move源代码
  document    对Move包进行文档化
  download    下载一个包并存储在以包命名的目录中
  init        在给定位置创建一个新的Move包
  lint        运行Lint工具，显示当前包的额外警告，除了Move 2编译器生成的普通警告和/或错误
  list        列出账户链上包和模块的信息
  prove       证明一个Move包
  publish     将Move包中的模块发布到Aptos区块链
  run         运行Move函数
  run-script  运行Move脚本
  test        运行包的Move单元测试
  verify-package      下载一个包并验证字节码
  view        运行视图函数
  replay      使用本地VM重放已提交的交易
  fmt         格式化Move源代码
  help        打印此消息或给定子命令的帮助信息

Options:
  -h, --help     打印帮助信息（更多信息请使用'--help'）
  -V, --version  打印版本`

export const CLI_APTOS_MOVE_HELP = CLI_APTOS_MOVE
export const CLI_APTOS_MOVE_H = CLI_APTOS_MOVE

export const CLI_APTOS_INIT_HELP = `aptos init --help           
用于初始化当前目录以用于aptos工具的工具

配置将被推送到.aptos/config.yaml

Usage: aptos init [选项]

选项:
      --network <NETWORK>
          用于默认设置的网络
          
          如果需要自定义\`rest_url\`和\`faucet_url\`，请使用\`custom\`

      --rest-url <REST_URL>
          网络上全节点的URL

      --faucet-url <FAUCET_URL>
          Faucet端点的URL

      --faucet-auth-token <FAUCET_AUTH_TOKEN>
          认证令牌，如果我们使用faucet。这只在这次使用，我们不会存储它
          
          [环境变量: FAUCET_AUTH_TOKEN=]

      --skip-faucet
          是否跳过非faucet端点的faucet

      --ledger
          是否要从你的ledger账户创建一个配置文件
          
          确保你的Ledger设备已连接并解锁，Aptos应用已安装并打开。你还必须在设备上启用"Blind Signing"以从CLI签名交易。

      --derivation-path <DERIVATION_PATH>
          硬件钱包账户的BIP44派生路径，例如
          \`m/44'/637'/0'/0'/0'\`
          
          注意你可能需要在你的shell中转义单引号，例如
          \`m/44'/637'/0'/0'/0'\`将变成\`m/44\\'/637\\'/0\\'/0\\'/0\\'\`

      --derivation-index <DERIVATION_INDEX>
          硬件钱包账户的BIP44账户索引，例如\`0\`
          
          给定索引\`n\`映射到BIP44派生路径\`m/44'/637'/n'/0'/0\`

      --random-seed <RANDOM_SEED>
          用于密钥生成的种子，应该是一个64字符的十六进制字符串
          仅用于测试
          
          如果使用可预测的随机种子，生成的密钥将是不安全的，容易被复制。除非在随机种子中放入足够的随机性，否则请不要使用。

      --private-key-file <PRIVATE_KEY_FILE>
          签名Ed25519私钥文件路径
          
          使用\`--encoding\`编码类型编码 与\`--private-key\`互斥

      --private-key <PRIVATE_KEY>
          签名Ed25519私钥
          
          使用\`--encoding\`编码类型编码 与\`--private-key-file\`互斥

      --profile <PROFILE>
          从CLI配置中使用的配置文件
          
          这将用于覆盖相关的设置，如REST URL、Faucet URL和私钥参数。
          
          默认为"default"

      --assume-yes
          对所有是/否提示假设为是

      --assume-no
          对所有是/否提示假设为否

      --encoding <ENCODING>
          数据编码类型，可选[base64, bcs, hex]
          
          [默认: hex]

  -h, --help
          打印帮助信息（使用'-h'查看摘要）

  -V, --version
          打印版本`
export const CLI_APTOS_INIT_H = `aptos init -h    
用于初始化当前目录以用于aptos工具的工具

Usage: aptos init [选项]

选项:
      --network <NETWORK>
          用于默认设置的网络
      --rest-url <REST_URL>
          网络上全节点的URL
      --faucet-url <FAUCET_URL>
          Faucet端点的URL
      --faucet-auth-token <FAUCET_AUTH_TOKEN>
          如果使用faucet，这是使用的认证令牌。这只在这次使用，我们不会存储它 [环境变量: FAUCET_AUTH_TOKEN=]
      --skip-faucet
          是否跳过非faucet端点的faucet
      --ledger
          是否要从你的ledger账户创建一个配置文件
      --derivation-path <DERIVATION_PATH>
          硬件钱包账户的BIP44派生路径，例如 \`m/44'/637'/0'/0'/0'\`
      --derivation-index <DERIVATION_INDEX>
          硬件钱包账户的BIP44账户索引，例如 \`0\`
      --random-seed <RANDOM_SEED>
          用于密钥生成的种子，应该是一个64字符的十六进制字符串，并且仅用于测试
      --private-key-file <PRIVATE_KEY_FILE>
          签名Ed25519私钥文件路径
      --private-key <PRIVATE_KEY>
          签名Ed25519私钥
      --profile <PROFILE>
          从CLI配置中使用的配置文件
      --assume-yes
          对所有是/否提示假设为是
      --assume-no
          对所有是/否提示假设为否
      --encoding <ENCODING>
          数据编码类型，可选[base64, bcs, hex] [默认: hex]
  -h, --help
          打印帮助信息（使用'--help'查看更多）
  -V, --version
          打印版本`

export const CLI_APTOS_ACCOUNT_H = `用于与账户交互的工具

Usage: aptos account <命令>

Commands:
  create
          在链上创建一个新账户
  create-resource-account
          在链上创建一个资源账户
  derive-resource-account-address
          推导出资源账户的地址
  fund-with-faucet
          使用水龙头的资金给账户充值
  balance
          显示账户不同币种的余额
  list
          列出某个地址拥有的资源、模块或余额
  lookup-address
          通过链上查找表查询账户地址
  rotate-key
          轮换账户的认证密钥
  transfer
          账户间转账APT
  help
          打印此消息或给定子命令的帮助信息

Options:
  -h, --help     打印帮助信息（使用'-h'查看摘要）
  -V, --version  打印版本`

export const CLI_APTOS_ACCOUNT_HELP = `用于与账户交互的工具

这个工具用于创建账户，获取账户资源的信息，以及在账户间转账资源。

Usage: aptos account <命令>

Commands:
  create
          在链上创建一个新账户
  create-resource-account
          在链上创建一个资源账户
  derive-resource-account-address
          推导出资源账户的地址
  fund-with-faucet
          使用水龙头的资金给账户充值
  balance
          显示账户不同币种的余额
  list
          列出某个地址拥有的资源、模块或余额
  lookup-address
          通过链上查找表查询账户地址
  rotate-key
          轮换账户的认证密钥
  transfer
          账户间转账APT
  help
          打印此消息或给定子命令的帮助信息

Options:
  -h, --help
          打印帮助信息（使用'-h'查看摘要）

  -V, --version
          打印版本`

export const CLI_APTOS_ACCOUNT = CLI_APTOS_ACCOUNT_HELP

export const CLI_APTOS_MOVE_TEST_H = `运行包的Move单元测试

Usage: aptos move test [选项]

选项:
  -f, --filter <FILTER>
          用于确定运行哪些单元测试的过滤字符串
      --ignore-compile-warnings
          跳过警告的布尔值
      --package-dir <PACKAGE_DIR>
          Move包的路径（包含Move.toml文件的文件夹）。默认为当前目录
      --output-dir <OUTPUT_DIR>
          保存编译后的Move包的路径
      --named-addresses <NAMED_ADDRESSES>
          Move二进制的命名地址 [默认: ]
      --override-std <OVERRIDE_STD>
          通过主网/测试网/开发网覆盖标准库版本
          [可能的值: mainnet, testnet, devnet]
      --skip-fetch-latest-git-deps
          跳过拉取最新的git依赖
      --skip-attribute-checks
          不对Move代码中的未知属性发出警告
      --dev
          启用开发模式，使用所有的开发地址和开发依赖
      --check-test-code
          在测试代码上也应用对Aptos的扩展检查（例如\`#[view]\`属性）。
          注意：此行为将来会成为默认行为。
          详见 <https://github.com/aptos-labs/aptos-core/issues/10335>
          [环境变量: APTOS_CHECK_TEST_CODE=]
      --optimize <OPTIMIZE>
          选择优化级别。选项有"none", "default", 或 "extra"。
          "extra"级别可能会在未来花费更多时间在昂贵的优化上。
          "none"级别不进行优化，可能会导致使用过多的运行时资源。
          "default"级别是推荐级别，如果没有提供则默认使用
      --bytecode-version <BYTECODE_VERSION>
          ...或 --bytecode BYTECODE_VERSION
          指定编译器将发出的字节码版本。
          默认为\`6\`，如果选择了语言版本2（通过\`--move-2\`或\`--language_version=2\`）则默认为\`7\`。
      --compiler-version <COMPILER_VERSION>
          ...或 --compiler COMPILER_VERSION
          指定编译器的版本。
          默认为\`1\`，如果选择了\`--move-2\`则默认为\`2\`。
      --language-version <LANGUAGE_VERSION>
          ...或 --language LANGUAGE_VERSION
          指定要支持的语言版本。
          目前，默认为\`1\`，除非选择了\`--move-2\`。
      --move-2
          选择字节码、语言版本和编译器以支持Move 2：
          等同于\`--bytecode_version=7 --language_version=2.0 --compiler_version=2.0\`
  -i, --instructions <instructions>
          测试可以执行的最大指令数 [默认: 100000]
      --coverage
          收集覆盖率信息，以便以后与各种\`aptos move coverage\`子命令一起使用
      --dump
          在失败时转储存储状态
  -h, --help
          打印帮助信息（使用'--help'查看更多）
  -V, --version
          打印版本`
export const CLI_APTOS_MOVE_TEST = CLI_APTOS_MOVE_TEST_H
export const CLI_APTOS_MOVE_TEST_HELP = CLI_APTOS_MOVE_TEST_H
