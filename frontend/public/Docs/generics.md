# 泛型

泛型可以用来定义不同输入数据类型上的函数和结构体。这种语言特性有时被称为**参数多态性**。在 Move 中，我们经常将泛型与类型参数和类型参数互换使用。

泛型通常在库代码中使用，例如在向量中，声明能够在任何可能的实例化上工作的代码（满足指定约束）。在其他框架中，泛型代码有时可以用于以多种不同的方式与全局存储交互，但所有这些方式仍然共享相同的实现。

## 声明类型参数

函数和结构体都可以在它们的签名中使用类型参数列表，用一对尖括号`<...>`包围。

### 泛型函数

函数的类型参数放在函数名称之后和（值）参数列表之前。以下代码定义了一个通用的身份函数，它接受任何类型的值，并返回该值不变。

```rust
module 0x42::example {
    fun id<T>(x: T): T {
        // 这种类型注释不是必要的，但有效
        (x: T)
    }
}
```

一旦定义，类型参数`T`可以在参数类型、返回类型和函数体内部使用。

### 泛型结构体

结构体的类型参数放在结构体名称之后，可以用来命名字段的类型。

```rust
module 0x42::example {
  struct Foo<T> has copy, drop { x: T }

  struct Bar<T1, T2> has copy, drop {
    x: T1,
    y: vector<T2>,
  }
}
```

注意，类型参数不一定要使用。

## 类型参数

### 调用泛型函数

在调用泛型函数时，可以在一对尖括号内指定函数的类型参数列表。

```rust
module 0x42::example {
  fun foo() {
    let x = id<bool>(true);
  }
}
```

如果您不指定类型参数，Move 的[类型推断](https://aptos.dev/en/build/smart-contracts/book/generics#type-inference)将为您供应它们。

### 使用泛型结构体

类似地，在构造或解构泛型类型的值时，可以附加结构体的类型参数列表。

```rust
module 0x42::example {
  fun foo() {
    let foo = Foo<bool> { x: true };
    let Foo<bool> { x } = foo;
  }
}
```

如果您不指定类型参数，Move 的[类型推断](https://aptos.dev/en/build/smart-contracts/book/generics#type-inference)将为您供应它们。

### 类型参数不匹配

如果您指定了类型参数，而它们与实际提供的值冲突，将会出现错误：

```rust
module 0x42::example {
    fun foo() {
        let x = id<u64>(true); // 错误！true不是u64
    }
}
```

类似地：

```rust
module 0x42::example {
    fun foo() {
        let foo = Foo<bool> {
            x: 0
        }; // 错误！0不是bool
        let Foo<address> {
            x
        } = foo; // 错误！bool与address不兼容
    }
}
```

## 类型推断

在大多数情况下，Move 编译器能够推断类型参数，所以你不需要显式地写下来。以下是如果我们省略类型参数，上述示例将是什么样子：

```rust
module 0x42::example {
  fun foo() {
    let x = id(true);
    //        ^ <bool> is inferred

    let foo = Foo { x: true };
    //           ^ <bool> is inferred

    let Foo { x } = foo;
    //     ^ <bool> is inferred
  }
}
```

> [!MOTE] 注意
> 当编译器无法推断类型时，您需要手动注释它们。一个常见的场景是在返回位置仅出现类型参数的函数调用。

```rust
module 0x2::m {
  use std::vector;

  fun foo() {
    // let v = vector::new();
    //                    ^ The compiler cannot figure out the element type.

    let v = vector::new<u64>();
    //                 ^~~~~ Must annotate manually.
  }
}
```

然而，如果返回值在该函数中稍后被使用，编译器将能够推断类型：

```rust
module 0x2::m {
  use std::vector;

  fun foo() {
    let v = vector::new();
    //                 ^ <u64> is inferred
    vector::push_back(&mut v, 42);
  }
}
```

## 未使用的类型参数

对于结构体定义，未使用的类型参数是那些没有出现在结构体中定义的任何字段中，但在编译时静态检查。Move 允许未使用的类型参数，因此以下结构体定义是有效的：

```rust
module 0x2::m {
  struct Foo<T> {
    foo: u64
  }
}
```

这在模拟某些概念时可能很有用。这里有一个例子：

```rust
module 0x2::m {
    // 货币指示器
    struct Currency1 {}
    struct Currency2 {}

    // 可以使用货币指示器类型实例化的通用硬币类型。
    //   例如 Coin<Currency1>, Coin<Currency2> 等。
    struct Coin<Currency> has store {
        value: u64
    }

    // 通用编写关于所有货币的代码
    public fun mint_generic<Currency>(value: u64): Coin<Currency> {
        Coin {
            value
        }
    }

    // 针对一种货币具体编写代码
    public fun mint_concrete(value: u64): Coin<Currency1> {
        Coin {
            value
        }
    }
}
```

在这个例子中，`struct Coin<Currency>`是通用的`Currency`类型参数，它指定了硬币的货币，并允许代码可以通用地编写任何货币或具体地编写特定货币。即使`Currency`类型参数没有出现在`Coin`中定义的任何字段中，这种通用性也适用。

### 幻影类型参数

在上面的例子中，尽管`struct Coin`要求具有`store`能力，`Coin<Currency1>`和`Coin<Currency2>`都不会具有`store`能力。这是因为有条件能力和通用类型的规则，以及`Currency1`和`Currency2`没有`store`能力的事实，尽管它们甚至没有在`struct Coin`的主体中使用。这可能会导致一些不愉快的后果。例如，我们无法将`Coin<Currency1>`放入全局存储中的钱包中。

一种可能的解决方案是向`Currency1`和`Currency2`添加虚假的能力注释（即，`struct Currency1 has store {}`）。但是，这可能会导致错误或安全漏洞，因为它用不必要的能力声明削弱了类型。例如，我们永远不会期望全局存储中的资源具有类型`Currency1`的字段，但这将有可能使用虚假的`store`能力。此外，虚假的注释将是传染性的，需要许多通用于未使用类型参数的函数也包括必要的约束。

幻影类型参数解决了这个问题。未使用的类型参数可以被标记为*幻影*类型参数，它们不参与结构体的能力派生。这样，幻影类型参数的参数在派生通用类型的能力时不考虑，从而避免了虚假能力注释的需要。为了使这个放宽的规则合理，Move 的类型系统保证被声明为`phantom`的参数要么在结构体定义中根本没有使用，要么只作为也被声明为`phantom`的类型参数的参数使用。

#### 声明

在结构体定义中，可以通过在其声明之前添加`phantom`关键字来声明类型参数为幻影。如果一个类型参数被声明为幻影，我们说它是一个幻影类型参数。在定义结构体时，Move 的类型检查器确保每个幻影类型参数要么在结构体定义中根本没有使用，要么只作为幻影类型参数的参数使用。

更正式地说，如果一个类型被用作幻影类型参数的参数，我们说这个类型出现在*幻影位置*。有了这个定义，正确使用幻影参数的规则可以如下规定：**幻影类型参数只能出现在幻影位置**。

以下两个示例展示了幻影参数的有效使用。在第一个示例中，参数`T1`根本没有在结构体定义中使用。在第二个示例中，参数`T1`只作为幻影类型参数的参数使用。

```rust
module 0x2::m {
  struct S1<phantom T1, T2> { f: u64 }
  //                ^^
  //                Ok: T1 does not appear inside the struct definition


  struct S2<phantom T1, T2> { f: S1<T1, T2> }
  //                                ^^
  //                                Ok: T1 appears in phantom position
}
```

以下代码展示了违反规则的示例：

```rust
module 0x2::m {
  struct S1<phantom T> { f: T }
  //                        ^
  //                        Error: Not a phantom position

  struct S2<T> { f: T }

  struct S3<phantom T> { f: S2<T> }
  //                           ^
  //                           Error: Not a phantom position
}
```

#### 实例化

在实例化结构体时，当推导结构体能力时，会排除幻影参数的参数。例如，考虑以下代码：

```rust
module 0x2::m {
  struct S<T1, phantom T2> has copy { f: T1 }
  struct NoCopy {}
  struct HasCopy has copy {}
}
```

现在考虑类型`S<HasCopy, NoCopy>`。由于`S`被定义为具有`copy`，并且所有非幻影参数都具有`copy`，那么`S<HasCopy, NoCopy>`也具有`copy`。

#### 带有能力约束的幻影类型参数

能力约束和幻影类型参数是正交特性，因为幻影参数可以带有能力约束声明。当实例化带有能力约束的幻影类型参数时，类型参数必须满足该约束，即使参数是幻影的。例如，以下定义是完全有效的：

```rust
module 0x2::m {
  struct S<phantom T: copy> {}
}
```

通常的限制适用，`T`只能使用具有`copy`的参数进行实例化。

## 约束

在上面的示例中，我们已经展示了如何使用类型参数来定义可以由调用者在以后插入的“未知”类型。然而，这意味着类型系统对类型知之甚少，并且必须以非常保守的方式执行检查。从某种意义上说，类型系统必须为未受约束的泛型假设最坏的情况。简单来说，默认情况下泛型类型参数没有任何能力。

这就是约束发挥作用的地方：它们提供了一种指定这些未知类型具有什么属性的方法，以便类型系统可以允许那些否则不安全的操作。

### 声明约束

可以使用以下语法对类型参数施加约束。

```rust
// T is the name of the type parameter
T: <ability> (+ <ability>)*
```

`<ability>`可以是四种能力中的任何一种，类型参数可以同时受到多种能力的约束。因此，所有以下都将是有效的类型参数声明：

```rust
T: copy
T: copy + drop
T: copy + drop + store + key
```

### 验证约束

约束在调用点进行检查，所以以下代码不会编译。

```rust
module 0x2::m {
  struct Foo<T: key> { x: T }

  struct Bar { x: Foo<u8> }
  //                  ^ error! u8 does not have 'key'

  struct Baz<T> { x: Foo<T> }
  //                     ^ error! T does not have 'key'
}
```

```rust
module 0x2::m {
  struct R {}

  fun unsafe_consume<T>(x: T) {
    // error! x does not have 'drop'
  }

  fun consume<T: drop>(x: T) {
    // valid!
    // x will be dropped automatically
  }

  fun foo() {
    let r = R {};
    consume<R>(r);
    //      ^ error! R does not have 'drop'
  }
}
```

```rust
module 0x2::m {
  struct R {}

  fun unsafe_double<T>(x: T) {
    (copy x, x)
    // error! x does not have 'copy'
  }

  fun double<T: copy>(x: T) {
    (copy x, x) // valid!
  }

  fun foo(): (R, R) {
    let r = R {};
    double<R>(r)
    //     ^ error! R does not have 'copy'
  }
}
```

有关更多信息，请参见有关[有条件能力和通用类型](https://aptos.dev/en/build/smart-contracts/book/abilities#conditional-abilities-and-generic-types)的能力部分。

## 递归限制

### 递归结构体

泛型结构体不能包含同一类型的字段，无论是直接还是间接，即使有不同的类型参数。所有以下结构体定义都是无效的：

```rust
module 0x2::m {
  struct Foo<T> {
    x: Foo<u64> // error! 'Foo' containing 'Foo'
  }

  struct Bar<T> {
    x: Bar<T> // error! 'Bar' containing 'Bar'
  }

  // error! 'A' and 'B' forming a cycle, which is not allowed either.
  struct A<T> {
    x: B<T, u64>
  }

  struct B<T1, T2> {
    x: A<T1>,
    y: A<T2>
  }
}
```

### 高级话题：类型级递归

Move 允许泛型函数被递归调用。然而，当与泛型结构体结合使用时，这可能会在某些情况下创建无限多的类型，允许这种情况意味着给编译器、虚拟机和其他语言组件增加不必要的复杂性。因此，这种递归是禁止的。

允许：

```rust
module 0x2::m {
  struct A<T> {}

  // Finitely many types -- allowed.
  // foo1<T> -> foo1<T> -> foo1<T> -> ... is valid
  fun foo1<T>() {
    foo1<T>();
  }

  // Finitely many types -- allowed.
  // foo2<T> -> foo2<A<u64>> -> foo2<A<u64>> -> ... is valid
  fun foo2<T>() {
    foo2<A<u64>>();
  }
}
```

不允许：

```rust
module 0x2::m {
  struct A<T> {}

  // Infinitely many types -- NOT allowed.
  // error!
  // foo<T> -> foo<A<T>> -> foo<A<A<T>>> -> ...
  fun foo<T>() {
    foo<A<T>>();
  }
}
```

```rust
module 0x2::n {
  struct A<T> {}

  // Infinitely many types -- NOT allowed.
  // error!
  // foo<T1, T2> -> bar<T2, T1> -> foo<T2, A<T1>>
  //   -> bar<A<T1>, T2> -> foo<A<T1>, A<T2>>
  //   -> bar<A<T2>, A<T1>> -> foo<A<T2>, A<A<T1>>>
  //   -> ...
  fun foo<T1, T2>() {
    bar<T2, T1>();
  }

  fun bar<T1, T2>() {
    foo<T1, A<T2>>();
  }
}
```

注意，类型级递归的检查是基于对调用点的保守分析，并不考虑控制流或运行时值。

```rust
module 0x2::m {
  struct A<T> {}

  fun foo<T>(n: u64) {
    if (n > 0) {
      foo<A<T>>(n - 1);
    };
  }
}
```

上面的示例中的函数在技术上将针对任何给定的输入终止，因此只创建有限数量的类型，但它仍然被认为是 Move 类型系统无效的。
