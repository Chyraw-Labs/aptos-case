针对 Move 的单元测试为 Move 源语言添加了三个新的注解：

- `#[test]` 将一个函数标记为测试函数，
- `#[test_only]` 将一个模块或模块成员（`use`、函数或结构体）标记为仅用于测试的代码
- `#[expected_failure]` 标记一个测试预期会失败

这些注解可以放在具有任何可见性的函数上。每当一个模块或模块成员被注解为 `#[test_only]` 或 `#[test]` 时，除非是为测试而编译，否则它不会被包含在编译的字节码中。

# 1. test 注解：其含义和用法

`#[test]` 和 `#[expected_failure]` 注解都可以带参数或不带参数使用。

不带参数时，`#[test]` 注解只能放在没有参数的函数上。这个注解简单地将此函数标记为要由单元测试工具运行的测试。

```rust
module 0x42::example {
  #[test] // OK
  fun this_is_a_test() { /* ... */ }

  #[test] // Will fail to compile since the test takes an argument
  fun this_is_not_correct(arg: signer) { /* ... */ }
}
```

## 1.2 预期失败

测试也可以被注解为 `#[expected_failure]`。这个注解标记该测试应该会引发错误。

您可以通过注解为 `#[expected_failure(abort_code = <code>)]` 来确保测试会以特定的中止 `<code>` 中止，对应于 `abort` 语句的参数（或失败的 `assert!` 宏）。

除了 `abort_code`，`expected_failure` 还可以指定程序执行错误，例如 `arithmetic_error`、`major_status`、`vector_error` 和 `out_of_gas`。为了更具体，还可以可选地指定 `minor_status`。

如果预期从特定位置出现错误，也可以指定：`#[expected_failure(abort_code = <code>, location = <loc>)]`。如果测试然后以正确的错误但在不同的模块中失败，测试也会失败。请注意，`<loc>` 可以是 `Self`（在当前模块中）或一个限定名称，例如 `vector::std`。

只有具有 `#[test]` 注解的函数也可以被注解为 `#[expected_failure]`。

```rust
module 0x42::example {
  #[test]
  #[expected_failure]
  public fun this_test_will_abort_and_pass() { abort 1 }

  #[test]
  #[expected_failure]
  public fun test_will_error_and_pass() { 1/0; }

  #[test]
  #[expected_failure(abort_code = 0, location = Self)]
  public fun test_will_error_and_fail() { 1/0; }

  #[test, expected_failure] // Can have multiple in one attribute. This test will pass.
  public fun this_other_test_will_abort_and_pass() { abort 1 }

  #[test]
  #[expected_failure(vector_error, minor_status = 1, location = Self)]
  fun borrow_out_of_range() { /* ... */ }
  #[test]
  #[expected_failure(abort_code = 26113, location = extensions::table)]
  fun test_destroy_fails() { /* ... */ }
}
```

## 1.3 测试参数

带参数时，测试注解的形式为 `#[test(<param_name_1> = <address>,..., <param_name_n> = <address>)]`。如果一个函数以这种方式注解，函数的参数必须是 `<param_name_1>,..., <param_name_n>` 的一种排列，即这些参数在函数中出现的顺序和它们在测试注解中的顺序不必相同，但它们必须能够通过名称相互匹配。

只有类型为 `signer` 的参数才支持作为测试参数。如果提供了除 `signer` 以外的参数，测试运行时会出错。

```
module 0x42::example {
  #[test(arg = @0xC0FFEE)] // OK
  fun this_is_correct_now(arg: signer) { /* ... */ }

  #[test(wrong_arg_name = @0xC0FFEE)] // Not correct: arg name doesn't match
  fun this_is_incorrect(arg: signer) { /* ... */ }

  #[test(a = @0xC0FFEE, b = @0xCAFE)] // OK. We support multiple signer arguments, but you must always provide a value for that argument
  fun this_works(a: signer, b: signer) { /* ... */ }

  // somewhere a named address is declared
  #[test_only] // test-only named addresses are supported
  address TEST_NAMED_ADDR = @0x1;
  ...
  #[test(arg = @TEST_NAMED_ADDR)] // Named addresses are supported!
  fun this_is_correct_now(arg: signer) { /* ... */ }
}
```

## 1.4 支持测试的任意代码

一个模块及其任何成员都可以声明为仅用于测试。在这种情况下，只有在以测试模式编译时，该项才会包含在编译的 Move 字节码中。此外，在测试模式之外编译时，对 `#[test_only]` 模块的任何非测试 `use` 都会在编译期间引发错误。

```
#[test_only] // test only attributes can be attached to modules
module 0x42::abc { /*... */ }

module 0x42::other {
  #[test_only] // test only attributes can be attached to named addresses
  address ADDR = @0x1;

  #[test_only] // .. to uses
  use 0x1::some_other_module;

  #[test_only] // .. to structs
  struct SomeStruct { /* ... */ }

  #[test_only] // .. and functions. Can only be called from test code, but not a test
  fun test_only_function(/* ... */) { /* ... */ }
}
```

## 运行单元测试

Move 包的单元测试可以使用 `aptos move test` 命令运行。有关更多信息，请参阅[包](https://aptos.dev/en/build/smart-contracts/book/packages)。

运行测试时，每个测试将要么 `PASS`（通过）、`FAIL`（失败）要么 `TIMEOUT`（超时）。如果测试用例失败，如果可能，将报告失败的位置以及导致失败的函数名称。您可以在下面看到一个示例。

如果测试超过了任何单个测试可以执行的最大指令数，测试将被标记为超时。此限制可以使用以下选项更改，其默认值设置为 100000 条指令。此外，虽然测试的结果始终是确定性的，但默认情况下测试是并行运行的，因此除非使用单个线程运行（请参阅“OPTIONS”以下），否则测试运行中测试结果的顺序是非确定性的。

还有许多选项可以传递给单元测试二进制文件，以微调测试并帮助调试失败的测试。这些可以使用帮助标志找到：

```bash
$ aptos move test -h
```

## 示例

以下示例展示了一个使用了一些单元测试功能的简单模块：

首先在一个空目录中创建一个空包：

```bash
$ aptos move init --name TestExample
```

接下来将以下内容添加到 `Move.toml` 中：

```bash
[dependencies]
MoveStdlib = { git = "https://github.com/aptos-labs/aptos-core.git", subdir="aptos-move/framework/move-stdlib", rev = "main", addr_subst = { "std" = "0x1" } }
```

接下来在 `sources` 目录下添加以下模块：

```rust
// filename: sources/my_module.move
module 0x1::my_module {

  struct MyCoin has key { value: u64 }

  public fun make_sure_non_zero_coin(coin: MyCoin): MyCoin {
    assert!(coin.value > 0, 0);
    coin
  }

  public fun has_coin(addr: address): bool {
    exists<MyCoin>(addr)
  }

  #[test]
  fun make_sure_non_zero_coin_passes() {
    let coin = MyCoin { value: 1 };
    let MyCoin { value: _ } = make_sure_non_zero_coin(coin);
  }

  #[test]
  // Or #[expected_failure] if we don't care about the abort code
  #[expected_failure(abort_code = 0, location = Self)]
  fun make_sure_zero_coin_fails() {
    let coin = MyCoin { value: 0 };
    let MyCoin { value: _ } = make_sure_non_zero_coin(coin);
  }

  #[test_only] // test only helper function
  fun publish_coin(account: &signer) {
    move_to(account, MyCoin { value: 1 })
  }

  #[test(a = @0x1, b = @0x2)]
  fun test_has_coin(a: signer, b: signer) {
    publish_coin(&a);
    publish_coin(&b);
    assert!(has_coin(@0x1), 0);
    assert!(has_coin(@0x2), 1);
    assert!(!has_coin(@0x3), 1);
  }
}
```

### 运行测试

然后您可以使用 `aptos move test` 命令运行这些测试：

终端

```bash
$ aptos move test
BUILDING MoveStdlib
BUILDING TestExample
Running Move unit tests
[ PASS    ] 0x1::my_module::make_sure_non_zero_coin_passes
[ PASS    ] 0x1::my_module::make_sure_zero_coin_fails
[ PASS    ] 0x1::my_module::test_has_coin
Test result: OK. Total tests: 3; passed: 3; failed: 0
```

### 使用测试标志

#### `-f <str>` 或 `--filter <str>`

这将仅运行其完全限定名称包含 `<str>` 的测试。例如，如果我们只想运行名称中包含 `"zero_coin"` 的测试：

```bahs
$ aptos move test -f zero_coin
CACHED MoveStdlib
BUILDING TestExample
Running Move unit tests
[ PASS    ] 0x1::my_module::make_sure_non_zero_coin_passes
[ PASS    ] 0x1::my_module::make_sure_zero_coin_fails
Test result: OK. Total tests: 2; passed: 2; failed: 0
```

#### `--coverage`

这将计算被测试用例覆盖的代码并生成覆盖率摘要。

终端

```bash
$ aptos move test --coverage
INCLUDING DEPENDENCY AptosFramework
INCLUDING DEPENDENCY AptosStdlib
INCLUDING DEPENDENCY MoveStdlib
BUILDING TestExample
Running Move unit tests
[ PASS    ] 0x1::my_module::make_sure_non_zero_coin_passes
[ PASS    ] 0x1::my_module::make_sure_zero_coin_fails
[ PASS    ] 0x1::my_module::test_has_coin
Test result: OK. Total tests: 3; passed: 3; failed: 0
+-------------------------+
| Move Coverage Summary   |
+-------------------------+
Module 0000000000000000000000000000000000000000000000000000000000000001::my_module
>>> % Module coverage: 100.00
+-------------------------+
| % Move Coverage: 100.00  |
+-------------------------+
Please use `aptos move coverage -h` for more detailed source or bytecode test coverage of this package
```

然后通过运行 `aptos move coverage`，我们可以获得更详细的覆盖率信息。这些可以使用帮助标志找到：

```bash
$ aptos move coverage -h
```
