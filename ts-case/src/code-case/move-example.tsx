export const EXAMPLE_IF = `script {
  fun example() {
  let x = 0;
  let y = 1;
    let maximum = if (x > y) x else y;
    if (maximum < 10) {
        x = x + 10;
        y = y + 10;
        let _a = x + y;
    } else if (x >= 10 && y >= 10) {
        x = x - 10;
        y = y - 10;
        let _a = x + y;
    }
  }
}
`

export const EXAMPLE_FOR = `script {
  fun sum(n: u64): u64 {
    let sum = 0;
    for (i in 0..n) {
      sum = sum + i;
    };
    sum
  }
}`
