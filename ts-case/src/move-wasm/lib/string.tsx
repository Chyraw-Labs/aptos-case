export const string = `
module std::string {
    use std::vector;
    use std::option::{Self, Option};

    /// An invalid UTF8 encoding.
    const EINVALID_UTF8: u64 = 1;

    /// Index out of range.
    const EINVALID_INDEX: u64 = 2;

   
    struct String has copy, drop, store {
        bytes: vector<u8>,
    }

    public fun utf8(bytes: vector<u8>): String {
        assert!(internal_check_utf8(&bytes), EINVALID_UTF8);
        String{bytes}
    }

    public fun try_utf8(bytes: vector<u8>): Option<String> {
        if (internal_check_utf8(&bytes)) {
            option::some(String{bytes})
        } else {
            option::none()
        }
    }

    public fun bytes(self: &String): &vector<u8> {
        &self.bytes
    }

    /// Checks whether this string is empty.
    public fun is_empty(self: &String): bool {
        vector::is_empty(&self.bytes)
    }

    /// Returns the length of this string, in bytes.
    public fun length(self: &String): u64 {
        vector::length(&self.bytes)
    }

    /// Appends a string.
    public fun append(self: &mut String, r: String) {
        vector::append(&mut self.bytes, r.bytes)
    }

    /// Appends bytes which must be in valid utf8 format.
    public fun append_utf8(self: &mut String, bytes: vector<u8>) {
        append(self, utf8(bytes))
    }

    public fun insert(self: &mut String, at: u64, o: String) {
        let bytes = &self.bytes;
        assert!(at <= vector::length(bytes) && internal_is_char_boundary(bytes, at), EINVALID_INDEX);
        let l = length(self);
        let front = sub_string(self, 0, at);
        let end = sub_string(self, at, l);
        append(&mut front, o);
        append(&mut front, end);
        *self = front;
    }

    public fun sub_string(self: &String, i: u64, j: u64): String {
        let bytes = &self.bytes;
        let l = vector::length(bytes);
        assert!(
            j <= l && i <= j && internal_is_char_boundary(bytes, i) && internal_is_char_boundary(bytes, j),
            EINVALID_INDEX
        );
        String { bytes: internal_sub_string(bytes, i, j) }
    }

    public fun index_of(self: &String, r: &String): u64 {
        internal_index_of(&self.bytes, &r.bytes)
    }


    public native fun internal_check_utf8(v: &vector<u8>): bool;
    native fun internal_is_char_boundary(v: &vector<u8>, i: u64): bool;
    native fun internal_sub_string(v: &vector<u8>, i: u64, j: u64): vector<u8>;
    native fun internal_index_of(v: &vector<u8>, r: &vector<u8>): u64;
}`
