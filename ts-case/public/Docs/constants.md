常量是在`module`或`script`内部给共享的静态值命名的一种方式。

常量的值必须在编译时已知。常量的值存储在编译后的模块或脚本中。每次使用常量时，都会创建该值的一个新副本。

## 1. 声明

常量声明以`const`关键字开始，后跟名称、类型和值。它们可以存在于脚本或模块中：

```rust
const <name>: <type> = <expression>;
```

例如：

```rust
script {
  const MY_ERROR_CODE: u64 = 0;
  fun main(input: u64) {
    assert!(input > 0, MY_ERROR_CODE);
  }
}
module 0x42::example {
  const MY_ADDRESS: address = @0x42;
  public fun permissioned(s: &signer) {
    assert!(std::signer::address_of(s) == MY_ADDRESS, 0);
  }
}
```

# 2. 命名

常量必须以大写字母`A`到`Z`开始。在第一个字母之后，常量名称可以包含下划线`_`、小写字母`a`到`z`、大写字母`A`到`Z`或数字`0`到`9`。

```rust
script {
  const FLAG: bool = false;
  const MY_ERROR_CODE: u64 = 0;
  const ADDRESS_42: address = @0x42;
}
```

尽管你可以在常量中使用小写字母`a`到`z`，但[通用风格指南](https://aptos.dev/en/build/smart-contracts/book/coding-conventions)建议只使用大写字母`A`到`Z`，并在每个词之间使用下划线`_`。

以`A`到`Z`开始的命名限制是为了给未来的语言特性留出空间。这个限制以后可能会被移除。

# 3. 可见性

目前不支持`public`常量。`const`值**只能在声明它的模块中使用**。

## 3.1 有效表达式

目前，常量限于原始类型`bool`、`u8`、`u16`、`u32`、`u64`、`u128`、`u256`、`address`和`vector<u8>`。未来将支持其他`vector`值（除了“字符串”字面量）。

## 3.2 值

通常，`const`被赋予它们类型的一个简单值或字面量。例如：

```rust
script {
  const MY_BOOL: bool = false;
  const MY_ADDRESS: address = @0x70DD;
  const BYTES: vector<u8> = b"hello world";
  const HEX_BYTES: vector<u8> = x"DEADBEEF";
}
```

## 3.3 复杂表达式

除了字面量，常量还可以包括更复杂的表达式，只要编译器能够在编译时将表达式简化为一个值。

目前，可以使用方法包括等式操作、所有布尔操作、所有位操作和所有算术操作。

```rust
script {
  const RULE: bool = true && false;
  const CAP: u64 = 10 * 100 + 1;
  const SHIFTY: u8 = {
    (1 << 1) * (1 << 2) * (1 << 3) * (1 << 4)
  };
  const HALF_MAX: u128 = 340282366920938463463374607431768211455 / 2;
  const REM: u256 = 57896044618658097711785492504343953926634992332820282019728792003956564819968 % 654321;
  const EQUAL: bool = 1 == 1;
}
```

如果操作导致运行时异常，编译器将给出一个错误，表示它无法生成常量的值。

```rust
script {
  const DIV_BY_ZERO: u64 = 1 / 0; // error!
  const SHIFT_BY_A_LOT: u64 = 1 << 100; // error!
  const NEGATIVE_U64: u64 = 0 - 1; // error!
}
```

> [!NOTE] 注意
> 常量目前不能引用其他常量。这个特性以及对其他表达式的支持将在未来添加。
