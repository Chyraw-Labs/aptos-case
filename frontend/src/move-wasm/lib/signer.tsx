export const signer = `module std::signer {
    native public fun borrow_address(s: &signer): &address;
    public fun address_of(s: &signer): address {
        *borrow_address(s)
    }
    spec native fun is_txn_signer(s: signer): bool;
    spec native fun is_txn_signer_addr(a: address): bool;
}`
