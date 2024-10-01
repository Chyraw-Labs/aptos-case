# 包

包允许 Move 程序员更容易地重用代码并在项目之间共享。Move 包系统允许程序员轻松执行以下操作：

- 定义包含 Move 代码的包；
- 通过[命名地址](https://aptos.dev/en/build/smart-contracts/book/address)参数化包；
- 在其他 Move 代码中导入并使用包，并实例化命名地址；
- 构建包并从包生成相关的编译产物；
- 使用编译 Move 工件的通用接口。

## 包布局和清单语法

Move 包源目录包含一个`Move.toml`包清单文件以及一组子目录：

```
a_move_package
├── Move.toml
├── sources
│   ├── module.move
│   └── *.move
├── examples (optional, test & dev mode)
├── scripts (optional, can also put in sources)
├── doc_templates (optional)
└── tests (optional, test mode)
```

标记为`required`的目录必须存在，以便目录被视为 Move 包并进行编译。可选目录可以存在，如果存在，将被包含在编译过程中。根据包的构建模式（`test`或`dev`），`tests`和`examples`目录也会被包含。

`sources`目录可以包含 Move 模块和 Move 脚本（包含脚本函数的脚本和模块）。`examples`目录可以保存仅用于开发和/或教学目的的额外代码，这些代码在编译时不会包含在`test`或`dev`模式之外。

支持`scripts`目录，以便将 Move 脚本与模块分开，如果包作者这样希望的话。如果存在，`scripts`目录将始终包含在编译中。文档将使用`doc_templates`目录中存在的任何文档模板构建。

### Move.toml

Move 包清单在`Move.toml`文件中定义，并具有以下语法。可选字段用`*`标记，`+`表示一个或多个元素：

```
[package]
name = <string>                  # 例如, "MoveStdlib"
version = "<uint>.<uint>.<uint>" # 例如, "0.1.1"
license* = <string>              # 例如, "MIT", "GPL", "Apache 2.0"
authors* = [<string>]            # 例如, ["Joe Smith (joesmith@noemail.com)", "Jane Smith (janesmith@noemail.com)"]

[addresses]
# (可选部分) 在此包中声明命名地址并在包图中实例化命名地址
# 以下格式声明命名地址的一行或多行
<addr_name> = "_" | "<hex_address>" # 例如, std = "_" 或 my_addr = "0xC0FFEECAFE"

[dependencies]
# (可选部分) 依赖路径和从每个依赖项实例化或重命名命名地址
# 以下格式声明依赖的一行或多行
<string> = { local = <string>, addr_subst* = { (<string> = (<string> | "<hex_address>"))+ } }
# 本地依赖

<string> = { git = <URL ending in .git>, subdir=<path to dir containing Move.toml inside git repo>, rev=<git commit hash>, addr_subst* = { (<string> = (<string> | "<hex_address>"))+ } }
# git依赖

[dev-addresses]
# (可选部分) 与[addresses]部分相同，但仅在"dev"和"test"模式中包含

[dev-dependencies]
# (可选部分) 与[dependencies]部分相同，但仅在"dev"和"test"模式中包含
```

具有一个本地依赖项和一个 git 依赖项的最小包清单的示例：

```
[package]
name = "AName"
version = "0.0.0"
```

一个更标准的包清单示例，还包括 Move 标准库并使用地址值`0x1`实例化来自它的命名地址`Std`：

```
[package]
name = "AName"
version = "0.0.0"
license = "Apache 2.0"
[addresses]
address_to_be_filled_in = "_"
specified_address = "0xB0B"
[dependencies]
# 本地依赖
LocalDep = {
    local = "projects/move-awesomeness",
    addr_subst = { "std" = "0x1" }
}
# Git依赖
MoveStdlib = {
    git = "https://github.com/diem/diem.git",
    subdir = "language/move-stdlib",
    rev = "56ab033cc403b489e891424a629e76f643d4fb6b"
}
[dev-addresses]
# 用于开发此模块时
address_to_be_filled_in = "0x101010101"
```

包清单中的大多数部分都是不言自明的，但命名地址可能有点难以理解，所以值得更详细地检查一下。

## 编译期间的命名地址

回想一下，Move 有[命名地址](https://aptos.dev/en/build/smart-contracts/book/address)，并且命名地址不能在 Move 中声明。由于这个原因，到目前为止，命名地址及其值需要在命令行上传递给编译器。有了 Move 包系统，这不再需要，你可以在包中声明命名地址，实例化包图中其他命名地址，并在 Move 包系统清单文件中重命名来自其他包的命名地址。让我们分别逐一了解：

### 声明

假设我们在`example_pkg/sources/A.move`中有一个 Move 模块如下：

```plaintext
module named_addr::A {
    public fun x(): address {
        @named_addr
    }
}
```

我们可以在`example_pkg/Move.toml`中以两种不同的方式声明命名地址`named_addr`。第一种：

```
[package]
name = "ExamplePkg"
# ...
[addresses]
named_addr = "_"
```

声明了包`ExamplePkg`中的命名地址`named_addr`，并且*这个地址可以是任何有效的地址值*。因此，导入包可以选择命名地址`named_addr`的任何地址值。直观地说，你可以将这视为通过命名地址`named_addr`参数化包`ExamplePkg`，然后稍后由导入包实例化。

`named_addr`也可以声明为：

```
[package]
name = "ExamplePkg"
# ...
[addresses]
named_addr = "0xCAFE"
```

这表明命名地址`named_addr`正是`0xCAFE`，不能更改。这很有用，以便其他导入包可以在不必担心分配给它的确切值的情况下使用此命名地址。

有了这两种不同的声明方法，命名地址信息可以通过包图以两种方式流动：

- 前者（“未分配的命名地址”）允许命名地址值从导入位置流向声明位置。
- 后者（“已分配的命名地址”）允许命名地址值从声明位置向上流动到包图中的使用位置。

有了这两种在包图中流动命名地址信息的方法，了解作用域和重命名的规则变得很重要。

## 命名地址的作用域和重命名

如果满足以下条件，则包`P`中的命名地址`N`在作用域内：

1. 它声明了命名地址`N`；或者
2. `P`的一个传递依赖项中的包声明了命名地址`N`，并且在`P`和声明包`N`之间有一条包图依赖路径，没有对`N`进行重命名。

此外，包中的每个命名地址都被导出。由于这个原因和上述作用域规则，每个包可以被视为带有一组命名地址，当包被导入时，这些命名地址将被带入作用域，例如，如果导入了`ExamplePkg`包，那么导入将把`named_addr`命名地址带入作用域。由于这个原因，如果`P`导入了两个包`P1`和`P2`，它们都声明了一个命名地址`N`，那么在`P`中就会出现一个问题：在`P`中引用`N`时，哪个“`N`”是意图中的？来自`P1`的还是`P2`的？为了防止围绕哪个包的命名地址来自的歧义，我们强制执行所有依赖项在包中引入的作用域集合是分离的，并在导入将它们引入作用域的包时提供了一种*重命名命名地址*的方法。

在导入时重命名命名地址可以如下在`P`中，`P1`和`P2`的示例中完成：

```
[package]
name = "P"
# ...
[dependencies]
P1 = {
    local = "some_path_to_P1",
    addr_subst = { "P1N" = "N" }
}
P2 = {
    local = "some_path_to_P2"
}
```

通过这个重命名，`N`指代来自`P2`的`N`，`P1N`将指代来自`P1`的`N`：

```plaintext
module N::A {
    public fun x(): address {
        @P1N
    }
}
```

需要注意的是，重命名不是局部的：一旦在包 `P` 中将命名地址 `N` 重命名为 `N2`，所有导入 `P` 的包将看不到 `N` 而只能看到 `N2`，除非从 `P` 外部重新引入 `N`。这就是为什么本节开头的作用域规则中的规则（2）指定了“P 和 N 的声明包之间的包图中的依赖路径，且 N 未被重命名”。

# 实例化

命名地址可以在包图中多次实例化，只要始终具有相同的值。如果在包图中对相同的命名地址（无论是否重命名）以不同的值进行实例化，则是错误的。

只有当所有命名地址都解析为一个值时，Move 包才能被编译。如果包希望公开一个未实例化的命名地址，这就会出现问题。这就是[dev-addresses]部分所解决的问题。此部分可以为命名地址设置值，但不能引入任何命名地址。此外，在开发模式下仅包含根包中的[dev-addresses]。例如，具有以下清单的根包在开发模式之外将无法编译，因为 named_addr 未实例化：

```toml
[package]
name = "ExamplePkg"
#...
[addresses]
named_addr = "_"

[dev-addresses]
named_addr = "0xC0FFEE"
```

## 使用、工件和数据结构

Move 包系统附带了一个命令行选项，作为 Move CLI `move <flags> <command> <command_flags>` 的一部分。除非提供特定路径，否则所有包命令都将在当前工作目录中运行。通过运行 `move --help` 可以找到 Move CLI 的完整命令和标志列表。

## 使用

包可以通过 Move CLI 命令进行编译，也可以作为 Rust 中的库命令通过函数 `compile_package` 进行编译。这将创建一个 `CompiledPackage`，其中包含已编译的字节码以及其他编译组件（源映射、文档、ABIs）在内存中。这个 `CompiledPackage` 可以转换为 `OnDiskPackage`，反之亦然——后者是 `CompiledPackage` 的数据以以下格式在文件系统中布局：

```file
xxx
```

有关这些数据结构以及如何将 Move 包系统用作 Rust 库的更多信息，请参阅 `move-package` 板条箱。

## 将字节码用于依赖项

当本地不可用这些依赖项的 Move 源代码时，可以将 Move 字节码用作依赖项。要使用此功能，您需要将文件并排在同一级别的目录中，然后在相应的 `Move.toml` 文件中指定它们的路径。

## 要求和限制

将本地字节码用作依赖项要求将字节码文件下载到本地，并且必须在 `Move.toml` 中或通过 `--named-addresses` 指定每个命名地址的实际地址。

请注意，目前，`aptos move prove` 和 `aptos move test` 命令都不支持字节码作为依赖项。

## 推荐结构

我们使用一个示例来说明使用此功能的开发流程。假设我们要编译包 A。包布局如下：

```file
xxx
```

`A.move` 定义如下，依赖于模块 `Bar` 和 `Foo`：

`A/AModule.move`

```rust
module A::AModule {
    use B::Bar;
    use C::Foo;
    public fun foo(): u64 {
        Bar::foo() + Foo::bar()
    }
}
```

假设 `Bar` 和 `Foo` 的源代码不可用，但相应的字节码 `Bar.mv` 和 `Foo.mv` 在本地可用。要将它们用作依赖项，我们将：

为 Bar 和 Foo 指定 Move.toml。请注意，命名地址已经在字节码中用实际地址实例化。在我们的示例中，C 的实际地址已经绑定到 0x3。因此，[addresses]必须指定 C 为 0x3，如下所示：

`workspace/C/Move.toml`

```rust
[package]
name = "Foo"
version = "0.0.0"

[addresses]
C = "0x3"
```

将字节码文件和相应的 `Move.toml` 文件放在同一目录中，字节码放在 `build` 子目录中。请注意，需要一个空的 `sources` 目录。例如，文件夹 `B`（对于包 `Bar`）和 `C`（对于包 `Foo`）的布局将类似于：

在目标（第一个）包的 `Move.toml` 中指定`[dependencies]`，其中包含依赖（次要）包的位置。例如，假设所有三个包目录都在同一级别，`A` 的 `Move.toml` 将类似于：

`workspace/A/Move.toml`

```rust
[package]
name = "A"
version = "0.0.0"

[addresses]
A = "0x2"

[dependencies]
Bar = { local = "../B" }
Foo = { local = "../C" }
```

请注意，如果在搜索路径中同时存在同一包的字节码和源代码，编译器将抱怨声明重复。
