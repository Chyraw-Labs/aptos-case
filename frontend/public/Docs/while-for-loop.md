Move 提供了三种循环结构：while、for 和 loop。

# 1. `while` 循环

`while` 结构会重复执行主体（一个类型为 `unit` 的表达式），直到条件（一个类型为 `bool` 的表达式）的计算结果为 `false` 。 以下是一个计算从 `1` 到 `n` 的数字总和的简单 `while` 循环的示例：

```rust
script {
  fun sum(n: u64): u64 {
    let sum = 0;
    let i = 1;
    while (i <= n) {
      sum = sum + i;
      i = i + 1
    };
    sum
  }
}
```

无限循环是允许的：

```rust
script {
  fun foo() {
    while (true) { }
  }
}
```

# 2. `break`

`break` 表达式可用于在条件计算结果为 `false` 之前退出循环。例如，此循环使用 `break` 来查找大于 `1` 的 `n` 的最小因子：

```rust
script {
  fun smallest_factor(n: u64): u64 {
    // assuming the input is not 0 or 1
    let i = 2;
    while (i <= n) {
      if (n % i == 0) break;
      i = i + 1
    };
    i
  }
}
```

`break` 表达式不能在循环之外使用。

# 3. `continue`

`continue` 表达式跳过循环的剩余部分并继续到下一次迭代。此循环使用 `continue` 来计算 `1`、`2`、...、`n` 的总和，但当数字可被 `10` 整除时除外：

```rust
script {
  fun sum_intermediate(n: u64): u64 {
    let sum = 0;
    let i = 0;
    while (i < n) {
      i = i + 1;
      if (i % 10 == 0) continue;
      sum = sum + i;
    };
    sum
  }
}
```

continue 表达式不能在循环之外使用。

# `break` 和 `continue` 的类型

break 和 continue，很像 return 和 abort，可以是任何类型。以下示例说明了这种灵活的类型在哪些地方会有帮助：

```rust
script {
  fun pop_smallest_while_not_equal(
    v1: vector<u64>,
    v2: vector<u64>,
  ): vector<u64> {
    let result = vector::empty();
    while (!vector::is_empty(&v1) && !vector::is_empty(&v2)) {
      let u1 = *vector::borrow(&v1, vector::length(&v1) - 1);
      let u2 = *vector::borrow(&v2, vector::length(&v2) - 1);
      let popped =
        if (u1 < u2) vector::pop_back(&mut v1)
        else if (u2 < u1) vector::pop_back(&mut v2)
        else break; // Here, `break` has type `u64`
      vector::push_back(&mut result, popped);
    };

    result
  }
}
```

```rust
script {
  fun pick(
    indexes: vector<u64>,
    v1: &vector<address>,
    v2: &vector<address>
  ): vector<address> {
    let len1 = vector::length(v1);
    let len2 = vector::length(v2);
    let result = vector::empty();
    while (!vector::is_empty(&indexes)) {
      let index = vector::pop_back(&mut indexes);
      let chosen_vector =
        if (index < len1) v1
        else if (index < len2) v2
        else continue; // Here, `continue` has type `&vector<address>`
      vector::push_back(&mut result, *vector::borrow(chosen_vector, index))
    };
    result
  }
}
```

# `for` 表达式

for 表达式在使用整数类型的下限（包含）和上限（不包含）表达式定义的范围内进行迭代，为该范围的每个元素执行其循环体。for 是为循环的迭代次数由特定范围确定的场景而设计的。

以下是一个 `for` 循环的示例，该循环计算从 `0` 到 `n - 1` 范围内元素的总和：

```rust
script {
  fun sum(n: u64): u64 {
    let sum = 0;
    for (i in 0..n) {
      sum = sum + i;
    };
    sum
  }
}
```

循环迭代器变量（上述示例中的 i）当前必须是数字类型（从边界推断），并且此处的边界 `0` 和 `n` 可以被任意数字表达式替换。每个在循环开始时仅计算一次。迭代器变量 `i` 被赋值为下限（在本例中为 `0`），并在每次循环迭代后递增；当迭代器 `i` 达到或超过上限（在本例中为 `n`）时，循环退出。

# `for` 循环中的 `break` 和 `continue`

与 `while` 循环类似，`break` 表达式可用于 `for` 循环中提前退出。`continue` 表达式可用于跳过当前迭代并移动到下一个。这里有一个示例演示了 `break` 和 `continue` 的使用。该循环将遍历从 `0` 到 `n - 1` 的数字，将它们相加。它将跳过能被 `3` 整除的数字（使用 `continue`），并在遇到大于 `10` 的数字时停止（使用 `break`）：

```rust
script {
  fun sum_conditional(n: u64): u64 {
    let sum = 0;
    for (iter in 0..n) {
      if (iter > 10) {
        break; // Exit the loop if the number is greater than 10
      };
      if (iter % 3 == 0) {
        continue; // Skip the current iteration if the number is divisible by 3
      };
      sum = sum + iter;
    };
    sum
  }
}
```

# 循环表达式

循环表达式重复循环体（类型为 `()` 的表达式），直到遇到 `break` 为止 如果没有 `break`，循环将永远持续下去

```rust
script {
  fun foo() {
    let i = 0;
    loop { i = i + 1 }
  }
}
```

下面是一个使用 loop 来编写 sum 函数的示例：

```rust
script {
  fun sum(n: u64): u64 {
    let sum = 0;
    let i = 0;
    loop {
      i = i + 1;
      if (i > n) break;
      sum = sum + i
    };
    sum
  }
}
```

正如您可能期望的那样，`continue` 也可以在循环内部使用。下面是将上面的 `sum_intermediate` 重写为使用 `loop` 而不是 `while`

```rust
script {
  fun sum_intermediate(n: u64): u64 {
    let sum = 0;
    let i = 0;
    loop {
      i = i + 1;
      if (i % 10 == 0) continue;
      if (i > n) break;
      sum = sum + i
    };
    sum
  }
}
```

# while、loop 和 for 表达式的类型

移动循环是有类型的表达式。`while` 和 `for` 表达式的类型始终为 `()` 。

```rust
script {
  fun example() {
    let () = while (i < 10) { i = i + 1 };
    let () = for (i in 0..10) {};
  }
}
```

如果一个循环包含 `break，`该表达式的类型为 unit `()`

```rust
script {
  fun example() {
    (loop { if (i < 10) i = i + 1 else break }: ());
    let () = loop { if (i < 10) i = i + 1 else break };
  }
}
```

如果 `loop` 没有 `break`，`loop` 可以具有任何类型，就像 `return`、`abort`、`break` 和 `continue` 一样。

```rust
script {
  fun example() {
    (loop (): u64);
    (loop (): address);
    (loop (): &vector<vector<u8>>);
  }
}
```
