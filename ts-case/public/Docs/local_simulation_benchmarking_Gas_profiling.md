# 概述

上一个教程展示了如何使用各种 CLI 命令部署和与 Move 合同进行交互。

默认情况下，这些命令将交易发送到远程全节点进行模拟和执行。您可以覆盖此行为，并通过添加您偏好的以下命令行选项之一在本地模拟交易：

- `--local`：在本地模拟交易，不进行任何进一步的测量或分析。
- `--benchmark`：对交易进行基准测试并报告运行时间。
- `--profile-gas`：对交易进行详细的 Gas 使用分析。

这些附加选项可以与以下 CLI 命令结合使用：

- `aptos move run`
- `aptos move run-script`
- `aptos move publish`

或者，如果您对重放过去的交易感兴趣，请查看[本教程](https://aptos.dev/en/build/cli/replay-past-transactions)。

> [!NOTE] ℹ️
> 本地模拟不会对链上状态产生任何影响。

## 部署示例合同

为了演示目的，我们将继续使用[`hello_blockchain`](https://github.com/aptos-labs/aptos-core/tree/main/aptos-move/move-examples/hello_blockchain)包作为示例。

首先，将包发布到 devnet 或 testnet（如果您尚未这样做）。

进入包目录。

```
cd aptos-move/move-examples/hello_blockchain
```

然后使用以下命令发布包。

```
aptos move publish --named-addresses hello_blockchain=default --assume-yes
```

输出：

```json
{
  "Result": {
    "transaction_hash": "0xe4ae0ec4ea3474b2123838885b04d7f4b046c174d14d7dc1c56916f2eb553bcf",
    "gas_used": 1118,
    "gas_unit_price": 100,
    "sender": "dbcbe741d003a7369d87ec8717afb5df425977106497052f96f4e236372f7dd5",
    "sequence_number": 5,
    "success": true,
    "timestamp_us": 1713914742422749,
    "version": 1033819503,
    "vm_status": "Executed successfully"
  }
}
```

请注意，您确实需要正确设置 CLI 配置文件并正确绑定命名地址。有关更多详细信息，请参考[CLI 配置](https://aptos.dev/en/build/cli/setup-cli)。

> [!NOTE] ℹ️ 注意
> 将包发布到 devnet/testnet 只是为本地模拟设置阶段的一种方式，并不是唯一可能的方式。您也可以使用本地节点，或者模拟不需要首先发布代码的交易，例如脚本甚至包发布交易本身。

# 本地模拟

接下来，使用附加的命令行选项 `--local` 执行入口函数`message::set_message`的本地模拟。这将在本地执行交易，不进行任何进一步的测量或分析。

终端

```
aptos move run --function-id 'default::message::set_message' --args 'tring:abc' --local
```

> [!NOTE] ℹ️
> 本地和远程模拟应产生相同的结果。

## 基准测试

要测量您的交易的运行时间，请使用`--benchmark`选项。

```
aptos move run --function-id 'default::message::set_message' --args 'tring:abc' --benchmark
```

```json
Simulating transaction locally...
{
  "Result": {
    "transaction_hash": "0x5aab20980688185eed2c9a27bab624c84b8b8117241cd4a367ba2a012069f57b",
    "gas_used": 441,
    "gas_unit_price": 100,
    "sender": "dbcbe741d003a7369d87ec8717afb5df425977106497052f96f4e236372f7dd5",
    "success": true,
    "version": 1033887414,
    "vm_status": "status EXECUTED of type Execution"
  }
}
```

值得注意的是，这些运行时间仅作为信息参考，因为它们取决于您本地机器的规格，并可能受到噪声或其他随机因素的影响。

**如果您旨在优化您的合同，您应该根据 Gas 分析结果做出决策。**

> [!NOTE] ℹ️
> 为了最小化测量误差，基准测试工具会多次执行相同的交易。因此，基准测试任务可能需要一段时间才能完成。

### Gas 分析

Aptos Gas 分析器是一个强大的工具，可以帮助您了解 Aptos 交易的 Gas 使用情况。一旦激活，它将使用仪器化的 VM 模拟交易，并生成基于网络的报告。

Gas 分析器也可以作为调试器，因为报告还包括完整的执行跟踪。

## 使用 Gas 分析器

可以通过添加`--profile-gas`选项来调用 Gas 分析器。

```
aptos move run --function-id 'default::message::set_message' --args 'tring:abc' --profile-gas
```

输出：

```json
Benchmarking transaction locally...
Running time (cold code cache): 985.141µs
Running time (warm code cache): 848.159µs
{
  "Result": {
    "transaction_hash": "0xa2fe548d37f12ee79df13e70fdd8212e37074c1b080b89b7d92e82550684ecdb",
    "gas_used": 441,
    "gas_unit_price": 100,
    "sender": "dbcbe741d003a7369d87ec8717afb5df425977106497052f96f4e236372f7dd5",
    "success": true,
    "version": 1033936831,
    "vm_status": "status EXECUTED of type Execution"
  }
}
```

然后，您可以在`gas-profiling`目录中找到生成的 Gas 报告：

```file
hello_blockchain
|-- Move.toml
|-- sources
|  |- index.html
```

`index.html`是报告的主页，可以使用您的网络浏览器查看。[示例报告](https://aptos.dev/gas-profiling/sample-report/index.html)

### 理解 Gas 报告

Gas 报告由三个部分组成，通过不同的视角帮助您了解 Gas 使用情况。

#### 火焰图

第一部分以两种火焰图的形式可视化 Gas 使用情况：一个用于执行和 I/O，另一个用于存储。我们需要两个图的原因是它们以不同的单位测量：一个以 Gas 单位，另一个以 APT 为单位。

可以与图中的各种元素进行交互。如果将光标悬停在一个项目上，它将为您显示精确的成本和百分比。![gas-profiling-flamegraph-0.png](https://aptos.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgas-profiling-flamegraph-0.5585dcd8.png&w=3840&q=75)

如果单击一个项目，可以放大并更清楚地看到子项目。您可以通过单击左上角的“重置缩放”按钮重置视图。![gas-profiling-flamegraph-1.png](https://aptos.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgas-profiling-flamegraph-1.c3df7f0a.png&w=3840&q=75)

右上角还有一个“搜索”按钮，允许匹配某些项目并突出显示它们。![gas-profiling-flamegraph-2.png](https://aptos.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgas-profiling-flamegraph-2.6b34bf98.png&w=3840&q=75)

#### 成本细分

第二部分是所有 Gas 成本的详细细分。此部分中呈现的数据已分类、聚合和排序。如果您知道要查看哪些数字，这可能特别有帮助。

例如，以下表格显示了所有 Move 字节码指令/操作的执行成本。这里的百分比是相对于所属类别（在此情况下为执行 + I/O）的总成本的相对值。

![gas-profiling-cost-break-down-table.png](https://aptos.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgas-profiling-cost-break-down-table.c7f4dc11.png&w=1080&q=75)

#### 完整执行跟踪

Gas 报告的最后一部分是交易的完整执行跟踪，如下所示：

示例执行跟踪

```rust
    intrinsic                                                     2.76        85.12%
    dependencies                                                  0.0607      1.87%
        0xdbcb..::message                                         0.0607      1.87%
    0xdbcb..::message::set_message                                0.32416     10.00%
        create_ty                                                 0.0004      0.01%
        create_ty                                                 0.0004      0.01%
        create_ty                                                 0.0004      0.01%
        create_ty                                                 0.0004      0.01%
        create_ty                                                 0.0008      0.02%
        imm_borrow_loc                                            0.00022     0.01%
        call                                                      0.00441     0.14%
        0x1::signer::address_of                                   0.007534    0.23%
            create_ty                                             0.0008      0.02%
            move_loc                                              0.000441    0.01%
            call                                                  0.004043    0.12%
            0x1::signer::borrow_address                           0.000735    0.02%
            read_ref                                              0.001295    0.04%
            ret                                                   0.00022     0.01%
        st_loc                                                    0.000441    0.01%
        copy_loc                                                  0.000854    0.03%
        load<0xdbcb..::0xdbcb..::message::MessageHolder>          0.302385    9.33%
        exists_generic                                            0.000919    0.03%
        not                                                       0.000588    0.02%
        br_false                                                  0.000441    0.01%
        imm_borrow_loc                                            0.00022     0.01%
        move_loc                                                  0.000441    0.01%
        pack                                                      0.000955    0.03%
        move_to_generic                                           0.001838    0.06%
        branch                                                    0.000294    0.01%
        @28
        ret                                                       0.00022     0.01%
    ledger writes                                                 0.097756    3.01%
        transaction
        events
        state write ops                                           0.097756    3.01%
            create<0xdbcb..::0xdbcb..::message::MessageHolder>    0.097756    3.01%
```

左列列出了正在执行的所有 Move 指令和操作，每个缩进级别表示一个函数调用。

中间列表示与操作相关的 Gas 成本。

还有一个特殊的符号`@number`，表示跳转到字节码中的特定位置。（上述片段中的`@28`）这纯粹是信息性的，有助于理解控制流。
