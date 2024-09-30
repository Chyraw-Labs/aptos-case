# 错误代码

[Aptos 错误码](https://aptos.dev/en/build/smart-contracts/error-codes)

# Move 编译错误

```error
"Error": "Simulation failed with status: Move abort in 0x1::resource_account: 0x60001"
```

`Greg`： The account calling the function doesn’t have the SignerCapability.

调用该函数的帐户没有 `SignerCapability`。

`Greg`：Basically, you’re calling with an account different from the one that created the resource account.

导致这个问题的原因基本是您**使用的帐户**与**创建资源帐户的帐户**不同。

```error
"Error": "Simulation failed with status: Move abort in 0x1::account: 0x8000f"
```

```error
AptosApiError: Fullnode error:
{
  "message":"Failed to deserialize table item retrieved from DB: expected boolean",
  "error_code":"internal_error",
  "vm_error_code":null
}
```

# 交易中的错误

> 当我执行
>
> ```aptos
> 0xbafd52bc7ba0d78f476270b24ed9b6dcbf998f2ca0c2a7e738e8e6ca20238454::func::refresh
> ```
>
> 时发生错误

```error
Simulation error
Generic error
```

在交易界面，按 `F12` 打开**开发者模式**，看一下请求中的错误内容，例如：

> 请求名：
>
> ```aptos
> https://fullnode.testnet.aptoslabs.com/v1/transactions/simulate?estimate_gas_unit_price=true&estimate_max_gas_amount=true&estimate_prioritized_gas_unit_price=false
> ```
>
> 内容：
>
> ```json
> [
>   {
>     "version": "996856422",
>     "hash": "0x26f5d34e98ac995fbe7bcb54850848b145a0fccf6a508bbe30633db876ae4471",
>     "state_change_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
>     "event_root_hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
>     "state_checkpoint_hash": null,
>     "gas_used": "4",
>     "success": false,
>     "vm_status": "Execution failed in 0xbafd52bc7ba0d78f476270b24ed9b6dcbf998f2ca0c2a7e738e8e6ca20238454::func::refresh at code offset 2\nExecution failed with status: Failed to borrow global resource from 23961d315753c2a810e1dca61ef6ce2e5f0637967a0bbc8c9f4b95aeae082b79",
>     "accumulator_root_hash": "0x0000000000000000000000000000000000000000000000000000000000000000"
>   }
> ]
> ```

- 关键信息

```json
 "vm_status": "Execution failed in 0xbafd52bc7ba0d78f476270b24ed9b6dcbf998f2ca0c2a7e738e8e6ca20238454::func::refresh at code offset 2\nExecution failed with status: Failed to borrow global resource from 23961d315753c2a810e1dca61ef6ce2e5f0637967a0bbc8c9f4b95aeae082b79",
```

> 错误码： `2`
>
> 这个错误码可能是虚拟机定义的，也可能是你自己定义的，需要查看源代码关于这个数字的内容
>
> 失败行为：Failed to borrow global resource from 23961 ...... 2b79
>
> 无法从 23961 ...... 2b79 借用全局资源

如何让错误码显示更直观？

`Greg:` 使用 `///`

```rust
/// No account
const E_NO_ACCOUNT = 1;
```

如果发生 `E_NO_ACCOUNT` 错误，则会显示 `No account`
