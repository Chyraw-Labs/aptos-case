export const vector = `module std::vector {
  const EINDEX_OUT_OF_BOUNDS: u64 = 0x20000;
  const EINVALID_RANGE: u64 = 0x20001;
  const EVECTORS_LENGTH_MISMATCH: u64 = 0x20002;
  const EINVALID_STEP: u64 = 0x20003;
  const EINVALID_SLICE_RANGE: u64 = 0x20004;
  #[bytecode_instruction]
  native public fun empty<Element>(): vector<Element>;
  #[bytecode_instruction]
  native public fun length<Element>(v: &vector<Element>): u64;
  #[bytecode_instruction]
  native public fun borrow<Element>(v: &vector<Element>, i: u64): &Element;
  #[bytecode_instruction]
  native public fun push_back<Element>(v: &mut vector<Element>, e: Element);
  #[bytecode_instruction]
  native public fun borrow_mut<Element>(v: &mut vector<Element>, i: u64): &mut Element;
  #[bytecode_instruction]
  native public fun pop_back<Element>(v: &mut vector<Element>): Element;
  #[bytecode_instruction]
  native public fun destroy_empty<Element>(v: vector<Element>);
  #[bytecode_instruction]
  native public fun swap<Element>(v: &mut vector<Element>, i: u64, j: u64);
  public fun singleton<Element>(e: Element): vector<Element> {
      let v = empty();
      push_back(&mut v, e);
      v
  }
  public fun reverse<Element>(v: &mut vector<Element>) {
      let len = length(v);
      reverse_slice(v, 0, len);
  }
  public fun reverse_slice<Element>(v: &mut vector<Element>, left: u64, right: u64) {
      assert!(left <= right, EINVALID_RANGE);
      if (left == right) return;
      right = right - 1;
      while (left < right) {
          swap(v, left, right);
          left = left + 1;
          right = right - 1;
      }
  }
  public fun append<Element>(lhs: &mut vector<Element>, other: vector<Element>) {
      reverse(&mut other);
      reverse_append(lhs, other);
  }
  public fun reverse_append<Element>(lhs: &mut vector<Element>, other: vector<Element>) {
      let len = length(&other);
      while (len > 0) {
          push_back(lhs, pop_back(&mut other));
          len = len - 1;
      };
      destroy_empty(other);
  }
  public fun trim<Element>(v: &mut vector<Element>, new_len: u64): vector<Element> {
      let res = trim_reverse(v, new_len);
      reverse(&mut res);
      res
  }
  public fun trim_reverse<Element>(v: &mut vector<Element>, new_len: u64): vector<Element> {
      let len = length(v);
      assert!(new_len <= len, EINDEX_OUT_OF_BOUNDS);
      let result = empty();
      while (new_len < len) {
          push_back(&mut result, pop_back(v));
          len = len - 1;
      };
      result
  }
  public fun is_empty<Element>(v: &vector<Element>): bool {
      length(v) == 0
  }
  public fun contains<Element>(v: &vector<Element>, e: &Element): bool {
      let i = 0;
      let len = length(v);
      while (i < len) {
          if (borrow(v, i) == e) return true;
          i = i + 1;
      };
      false
  }
  public fun index_of<Element>(v: &vector<Element>, e: &Element): (bool, u64) {
      let i = 0;
      let len = length(v);
      while (i < len) {
          if (borrow(v, i) == e) return (true, i);
          i = i + 1;
      };
      (false, 0)
  }
  public inline fun find<Element>(v: &vector<Element>, f: |&Element|bool): (bool, u64) {
      let find = false;
      let found_index = 0;
      let i = 0;
      let len = length(v);
      while (i < len) {
          if (f(borrow(v, i))) {
              find = true;
              found_index = i;
              break
          };
          i = i + 1;
      };
      (find, found_index)
  }
  public fun insert<Element>(v: &mut vector<Element>, i: u64, e: Element) {
      let len = length(v);
      assert!(i <= len, EINDEX_OUT_OF_BOUNDS);
      push_back(v, e);
      while (i < len) {
          swap(v, i, len);
          i = i + 1;
      };
  }
  public fun remove<Element>(v: &mut vector<Element>, i: u64): Element {
      let len = length(v);
      if (i >= len) abort EINDEX_OUT_OF_BOUNDS;

      len = len - 1;
      while (i < len) swap(v, i, { i = i + 1; i });
      pop_back(v)
  }
  public fun remove_value<Element>(v: &mut vector<Element>, val: &Element): vector<Element> {
      let (found, index) = index_of(v, val);
      if (found) {
          vector[remove(v, index)]
      } else {
         vector[]
      }
  }
  public fun swap_remove<Element>(v: &mut vector<Element>, i: u64): Element {
      assert!(!is_empty(v), EINDEX_OUT_OF_BOUNDS);
      let last_idx = length(v) - 1;
      swap(v, i, last_idx);
      pop_back(v)
  }
  public inline fun for_each<Element>(v: vector<Element>, f: |Element|) {
      reverse(&mut v); // We need to reverse the vector to consume it efficiently
      for_each_reverse(v, |e| f(e));
  }
  public inline fun for_each_reverse<Element>(v: vector<Element>, f: |Element|) {
      let len = length(&v);
      while (len > 0) {
          f(pop_back(&mut v));
          len = len - 1;
      };
      destroy_empty(v)
  }
  public inline fun for_each_ref<Element>(v: &vector<Element>, f: |&Element|) {
      let i = 0;
      let len = length(v);
      while (i < len) {
          f(borrow(v, i));
          i = i + 1
      }
  }
  public inline fun zip<Element1, Element2>(v1: vector<Element1>, v2: vector<Element2>, f: |Element1, Element2|) {
      reverse(&mut v1);
      reverse(&mut v2);
      zip_reverse(v1, v2, |e1, e2| f(e1, e2));
  }
  public inline fun zip_reverse<Element1, Element2>(
      v1: vector<Element1>,
      v2: vector<Element2>,
      f: |Element1, Element2|,
  ) {
      let len = length(&v1);
      assert!(len == length(&v2), 0x20002);
      while (len > 0) {
          f(pop_back(&mut v1), pop_back(&mut v2));
          len = len - 1;
      };
      destroy_empty(v1);
      destroy_empty(v2);
  }
  public inline fun zip_ref<Element1, Element2>(
      v1: &vector<Element1>,
      v2: &vector<Element2>,
      f: |&Element1, &Element2|,
  ) {
      let len = length(v1);
      assert!(len == length(v2), 0x20002);
      let i = 0;
      while (i < len) {
          f(borrow(v1, i), borrow(v2, i));
          i = i + 1
      }
  }
  public inline fun enumerate_ref<Element>(v: &vector<Element>, f: |u64, &Element|) {
      let i = 0;
      let len = length(v);
      while (i < len) {
          f(i, borrow(v, i));
          i = i + 1;
      };
  }
  public inline fun for_each_mut<Element>(v: &mut vector<Element>, f: |&mut Element|) {
      let i = 0;
      let len = length(v);
      while (i < len) {
          f(borrow_mut(v, i));
          i = i + 1
      }
  }
  public inline fun zip_mut<Element1, Element2>(
      v1: &mut vector<Element1>,
      v2: &mut vector<Element2>,
      f: |&mut Element1, &mut Element2|,
  ) {
      let i = 0;
      let len = length(v1);
      assert!(len == length(v2), 0x20002);
      while (i < len) {
          f(borrow_mut(v1, i), borrow_mut(v2, i));
          i = i + 1
      }
  }
  public inline fun enumerate_mut<Element>(v: &mut vector<Element>, f: |u64, &mut Element|) {
      let i = 0;
      let len = length(v);
      while (i < len) {
          f(i, borrow_mut(v, i));
          i = i + 1;
      };
  }
  public inline fun fold<Accumulator, Element>(
      v: vector<Element>,
      init: Accumulator,
      f: |Accumulator,Element|Accumulator
  ): Accumulator {
      let accu = init;
      for_each(v, |elem| accu = f(accu, elem));
      accu
  }
  public inline fun foldr<Accumulator, Element>(
      v: vector<Element>,
      init: Accumulator,
      f: |Element, Accumulator|Accumulator
  ): Accumulator {
      let accu = init;
      for_each_reverse(v, |elem| accu = f(elem, accu));
      accu
  }
  public inline fun map_ref<Element, NewElement>(
      v: &vector<Element>,
      f: |&Element|NewElement
  ): vector<NewElement> {
      let result = vector<NewElement>[];
      for_each_ref(v, |elem| push_back(&mut result, f(elem)));
      result
  }
  public inline fun zip_map_ref<Element1, Element2, NewElement>(
      v1: &vector<Element1>,
      v2: &vector<Element2>,
      f: |&Element1, &Element2|NewElement
  ): vector<NewElement> {
      assert!(length(v1) == length(v2), 0x20002);

      let result = vector<NewElement>[];
      zip_ref(v1, v2, |e1, e2| push_back(&mut result, f(e1, e2)));
      result
  }
  public inline fun map<Element, NewElement>(
      v: vector<Element>,
      f: |Element|NewElement
  ): vector<NewElement> {
      let result = vector<NewElement>[];
      for_each(v, |elem| push_back(&mut result, f(elem)));
      result
  }
  public inline fun zip_map<Element1, Element2, NewElement>(
      v1: vector<Element1>,
      v2: vector<Element2>,
      f: |Element1, Element2|NewElement
  ): vector<NewElement> {
      assert!(length(&v1) == length(&v2), 0x20002);

      let result = vector<NewElement>[];
      zip(v1, v2, |e1, e2| push_back(&mut result, f(e1, e2)));
      result
  }
  public inline fun filter<Element:drop>(
      v: vector<Element>,
      p: |&Element|bool
  ): vector<Element> {
      let result = vector<Element>[];
      for_each(v, |elem| {
          if (p(&elem)) push_back(&mut result, elem);
      });
      result
  }
  public inline fun partition<Element>(
      v: &mut vector<Element>,
      pred: |&Element|bool
  ): u64 {
      let i = 0;
      let len = length(v);
      while (i < len) {
          if (!pred(borrow(v, i))) break;
          i = i + 1;
      };
      let p = i;
      i = i + 1;
      while (i < len) {
          if (pred(borrow(v, i))) {
              swap(v, p, i);
              p = p + 1;
          };
          i = i + 1;
      };
      p
  }
  public fun rotate<Element>(
      v: &mut vector<Element>,
      rot: u64
  ): u64 {
      let len = length(v);
      rotate_slice(v, 0, rot, len)
  }
  public fun rotate_slice<Element>(
      v: &mut vector<Element>,
      left: u64,
      rot: u64,
      right: u64
  ): u64 {
      reverse_slice(v, left, rot);
      reverse_slice(v, rot, right);
      reverse_slice(v, left, right);
      left + (right - rot)
  }
  public inline fun stable_partition<Element>(
      v: &mut vector<Element>,
      p: |&Element|bool
  ): u64 {
      let len = length(v);
      let t = empty();
      let f = empty();
      while (len > 0) {
          let e = pop_back(v);
          if (p(&e)) {
              push_back(&mut t, e);
          } else {
              push_back(&mut f, e);
          };
          len = len - 1;
      };
      let pos = length(&t);
      reverse_append(v, t);
      reverse_append(v, f);
      pos
  }
  public inline fun any<Element>(
      v: &vector<Element>,
      p: |&Element|bool
  ): bool {
      let result = false;
      let i = 0;
      while (i < length(v)) {
          result = p(borrow(v, i));
          if (result) {
              break
          };
          i = i + 1
      };
      result
  }
  public inline fun all<Element>(
      v: &vector<Element>,
      p: |&Element|bool
  ): bool {
      let result = true;
      let i = 0;
      while (i < length(v)) {
          result = p(borrow(v, i));
          if (!result) {
              break
          };
          i = i + 1
      };
      result
  }
  public inline fun destroy<Element>(
      v: vector<Element>,
      d: |Element|
  ) {
      for_each_reverse(v, |e| d(e))
  }

  public fun range(start: u64, end: u64): vector<u64> {
      range_with_step(start, end, 1)
  }

  public fun range_with_step(start: u64, end: u64, step: u64): vector<u64> {
      assert!(step > 0, EINVALID_STEP);

      let vec = vector[];
      while (start < end) {
          push_back(&mut vec, start);
          start = start + step;
      };
      vec
  }
  public fun slice<Element: copy>(
      v: &vector<Element>,
      start: u64,
      end: u64
  ): vector<Element> {
      assert!(start <= end && end <= length(v), EINVALID_SLICE_RANGE);

      let vec = vector[];
      while (start < end) {
          push_back(&mut vec, *borrow(v, start));
          start = start + 1;
      };
      vec
  }
}`
