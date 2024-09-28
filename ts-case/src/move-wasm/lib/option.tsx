export const option = `module std::option {
  use std::vector;
  struct Option<Element> has copy, drop, store {
      vec: vector<Element>
  }
  const EOPTION_IS_SET: u64 = 0x40000;
  const EOPTION_NOT_SET: u64 = 0x40001;
  const EOPTION_VEC_TOO_LONG: u64 = 0x40002;
  public fun none<Element>(): Option<Element> {
      Option { vec: vector::empty() }
  }
  public fun some<Element>(e: Element): Option<Element> {
      Option { vec: vector::singleton(e) }
  }
  public fun from_vec<Element>(vec: vector<Element>): Option<Element> {
      assert!(vector::length(&vec) <= 1, EOPTION_VEC_TOO_LONG);
      Option { vec }
  }
  public fun is_none<Element>(t: &Option<Element>): bool {
      vector::is_empty(&t.vec)
  }
  public fun is_some<Element>(t: &Option<Element>): bool {
      !vector::is_empty(&t.vec)
  }
  public fun contains<Element>(t: &Option<Element>, e_ref: &Element): bool {
      vector::contains(&t.vec, e_ref)
  }
  public fun borrow<Element>(t: &Option<Element>): &Element {
      assert!(is_some(t), EOPTION_NOT_SET);
      vector::borrow(&t.vec, 0)
  }
  public fun borrow_with_default<Element>(t: &Option<Element>, default_ref: &Element): &Element {
      let vec_ref = &t.vec;
      if (vector::is_empty(vec_ref)) default_ref
      else vector::borrow(vec_ref, 0)
  }
  public fun get_with_default<Element: copy + drop>(
      t: &Option<Element>,
      default: Element,
  ): Element {
      let vec_ref = &t.vec;
      if (vector::is_empty(vec_ref)) default
      else *vector::borrow(vec_ref, 0)
  }
  public fun fill<Element>(t: &mut Option<Element>, e: Element) {
      let vec_ref = &mut t.vec;
      if (vector::is_empty(vec_ref)) vector::push_back(vec_ref, e)
      else abort EOPTION_IS_SET
  }
  public fun extract<Element>(t: &mut Option<Element>): Element {
      assert!(is_some(t), EOPTION_NOT_SET);
      vector::pop_back(&mut t.vec)
  }
  public fun borrow_mut<Element>(t: &mut Option<Element>): &mut Element {
      assert!(is_some(t), EOPTION_NOT_SET);
      vector::borrow_mut(&mut t.vec, 0)
  }
  public fun swap<Element>(t: &mut Option<Element>, e: Element): Element {
      assert!(is_some(t), EOPTION_NOT_SET);
      let vec_ref = &mut t.vec;
      let old_value = vector::pop_back(vec_ref);
      vector::push_back(vec_ref, e);
      old_value
  }
  public fun swap_or_fill<Element>(t: &mut Option<Element>, e: Element): Option<Element> {
      let vec_ref = &mut t.vec;
      let old_value = if (vector::is_empty(vec_ref)) none()
          else some(vector::pop_back(vec_ref));
      vector::push_back(vec_ref, e);
      old_value
  }
  public fun destroy_with_default<Element: drop>(t: Option<Element>, default: Element): Element {
      let Option { vec } = t;
      if (vector::is_empty(&mut vec)) default
      else vector::pop_back(&mut vec)
  }
  public fun destroy_some<Element>(t: Option<Element>): Element {
      assert!(is_some(&t), EOPTION_NOT_SET);
      let Option { vec } = t;
      let elem = vector::pop_back(&mut vec);
      vector::destroy_empty(vec);
      elem
  }
  public fun destroy_none<Element>(t: Option<Element>) {
      assert!(is_none(&t), EOPTION_IS_SET);
      let Option { vec } = t;
      vector::destroy_empty(vec)
  }
  public fun to_vec<Element>(t: Option<Element>): vector<Element> {
      let Option { vec } = t;
      vec
  }
  public inline fun for_each<Element>(o: Option<Element>, f: |Element|) {
      if (is_some(&o)) {
          f(destroy_some(o))
      } else {
          destroy_none(o)
      }
  }
  public inline fun for_each_ref<Element>(o: &Option<Element>, f: |&Element|) {
      if (is_some(o)) {
          f(borrow(o))
      }
  }
  public inline fun for_each_mut<Element>(o: &mut Option<Element>, f: |&mut Element|) {
      if (is_some(o)) {
          f(borrow_mut(o))
      }
  }
  public inline fun fold<Accumulator, Element>(
      o: Option<Element>,
      init: Accumulator,
      f: |Accumulator,Element|Accumulator
  ): Accumulator {
      if (is_some(&o)) {
          f(init, destroy_some(o))
      } else {
          destroy_none(o);
          init
      }
  }
  public inline fun map<Element, OtherElement>(o: Option<Element>, f: |Element|OtherElement): Option<OtherElement> {
      if (is_some(&o)) {
          some(f(destroy_some(o)))
      } else {
          destroy_none(o);
          none()
      }
  }
  public inline fun map_ref<Element, OtherElement>(
      o: &Option<Element>, f: |&Element|OtherElement): Option<OtherElement> {
      if (is_some(o)) {
          some(f(borrow(o)))
      } else {
          none()
      }
  }
  public inline fun filter<Element:drop>(o: Option<Element>, f: |&Element|bool): Option<Element> {
      if (is_some(&o) && f(borrow(&o))) {
          o
      } else {
          none()
      }
  }
  public inline fun any<Element>(o: &Option<Element>, p: |&Element|bool): bool {
      is_some(o) && p(borrow(o))
  }
  public inline fun destroy<Element>(o: Option<Element>, d: |Element|) {
      let vec = to_vec(o);
      vector::destroy(vec, |e| d(e));
  }
}`
