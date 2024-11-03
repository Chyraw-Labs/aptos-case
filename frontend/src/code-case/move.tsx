export const HELLO = `module case::hello {
    #[test_only]
    use std::string;
    #[test_only]
    use std::debug::print;

    #[test]
    fun test() {
        let hello = string::utf8(b"hello_world");
        print(&hello);
    }
}`
export const TYPE = `module case::test{

    #[test_only]
    use std::string;
    #[test_only]
    use std::debug::print;
    /// false
const EFALSE:u64 = 1;

    #[test]
    fun test_assignment(){
        let  test_assignment = string::utf8(b"########################## test assignment ##########################");
        print(&test_assignment);
        let arithmetic = string::utf8(b"----- Assignment 'string' to str, expeced string -----");
        print(&arithmetic);
        let str = string::utf8(b"string");
        print(&str);

        let arithmetic = string::utf8(b"----- Assignment '10' to num, expeced 10 -----");
        print(&arithmetic);
        let num = 10;
        print(&num);

        let arithmetic = string::utf8(b"----- Assignment 'true' to bool, expeced true -----");
        print(&arithmetic);
        let flag = true;
        print(&flag);

    }
    #[test]
    fun test_comparison(){
        let  test_calc = string::utf8(b"########################## test comparison ##########################");
        print(&test_calc);

        let comparison = string::utf8(b"----- Comparison (2 > 3) expected false -----");
        print(&comparison);
        let result = (2 > 3);
        print(&result);

        // assert!( !result,EFALSE);
        let comparison = string::utf8(b"----- Comparison (2 < 3) expected true -----");
        print(&comparison);
        let result = (2 < 3);
        print(&result);

        let comparison = string::utf8(b"----- Comparison (8 <= 3) expected false -----");
        print(&comparison);
        let result = (8 <= 3);
        print(&result);

        let comparison = string::utf8(b"----- Comparison (8 >= 3) expected false -----");
        print(&comparison);
        let result = (8 <= 3);
        print(&result);

        let comparison = string::utf8(b"----- Comparison (2 == 3) expected false -----");
        print(&comparison);
        let result = (2 == 3);
        print(&result);
    }
    #[test]
    fun test_calc() {
        let  test_calc = string::utf8(b"########################## test calc ##########################");
        print(&test_calc);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 + 5) expected 22-----");
        print(&arithmetic);
        let result = ( 17 + 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 - 5) expected 12----- [don't (4 - 17), ERROR: Subtraction overflow]");
        print(&arithmetic);
        let result = ( 17 - 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 * 5) expected 85-----");
        print(&arithmetic);
        let result = ( 17 * 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 / 5) expected 3-----");
        print(&arithmetic);
        let result = ( 17 / 5);
        print(&result);
        let num = 5;
        print(&num);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 % 5) expected 2-----");
        print(&arithmetic);
        let result = ( 17 % 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 | 5) expected 21 [OR]-----");
        print(&arithmetic);
        let result = ( 17 | 5);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  1  0  0  0  1  ---- 17
        //   0  0  0  0  0  1  0  1  ---- 5
        //   0  0  0  1  0  1  0  1  --- 21
        // 0 OR 0 = 0
        // 0 OR 1 = 1
        // 1 OR 0 = 1
        // 1 OR 1 = 1

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 & 5) expected 1 [AND]-----");
        print(&arithmetic);
        let result = ( 17 & 5);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  1  0  0  0  1  ---- 17
        //   0  0  0  0  0  1  0  1  ---- 5
        //   0  0  0  0  0  0  0  1  ---- 1
        // 0 OR 0 = 0
        // 0 OR 1 = 0
        // 1 OR 0 = 0
        // 1 OR 1 = 1

        let arithmetic = string::utf8(b"----- Arithmetic ( 17 ^ 5) expected 20 [XOR]-----");
        print(&arithmetic);
        let result = ( 17 ^ 5);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  1  0  0  0  1  ---- 17
        //   0  0  0  0  0  1  0  1  ---- 5
        //   0  0  0  1  0  1  0  0  ---- 20
        // 0 XOR 0 = 0
        // 0 XOR 1 = 1
        // 1 XOR 0 = 1
        // 1 XOR 1 = 0

        let arithmetic = string::utf8(b"----- Arithmetic !( 17 < 5) expected true [NOT]-----");
        print(&arithmetic);
        let result = !( 17 < 5);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( true && false) expected false [Logical AND] -----");
        print(&arithmetic);
        let result = ( true && false);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic ( true || false) expected true [Logical OR] -----");
        print(&arithmetic);
        let result = ( true || false);
        print(&result);

        let arithmetic = string::utf8(b"----- Arithmetic (11 << 2) expected 44 [Left Shift] -----");
        print(&arithmetic);
        let result:u8 = ( 11 << 2);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  0  1  0  1  1  ---- 11
        //                        ^  ----
        //                  ^  0  0  ---- 2 shift
        //   0  0  1  0  1  1  0  0  ---- 44

        let arithmetic = string::utf8(b"----- Arithmetic (11 >> 2) expected 2 [Right Shift] -----");
        print(&arithmetic);
        let result:u8 = ( 11 >> 2);
        print(&result);
        // 128 64 32 16  8  4  2  1
        //   0  0  0  0  1  0  1  1          ---- 11
        //                        ^          ----
        //   0  0  0  0  0  0  1  0  1  1    ---- 2 shift
        //   0  0  0  0  0  0  1  0          ---- 2

        // -------------

    }
}
`

export const NFT = `module my_first_nft::my_first_nft {
    use std::option;
    use std::signer;
    use std::string;
    use aptos_std::string_utils;
    use aptos_framework::account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::object::Object;

    use aptos_token_objects::collection;
    use aptos_token_objects::royalty;
    use aptos_token_objects::token;
    use aptos_token_objects::token::Token;

    // ERROR CODE
    const ERROR_NOWNER: u64 = 1;

    const ResourceAccountSeed: vector<u8> = b"mfers";

    const CollectionDescription: vector<u8> = b"mfers are generated entirely from hand drawings by sartoshi. this project is in the public domain; feel free to use mfers any way you want.";

    const CollectionName: vector<u8> = b"mfers";

    const CollectionURI: vector<u8> = b"ipfs://QmWmgfYhDWjzVheQyV2TnpVXYnKR25oLWCB2i9JeBxsJbz";

    const TokenURI: vector<u8> = b"ipfs://bafybeiearr64ic2e7z5ypgdpu2waasqdrslhzjjm65hrsui2scqanau3ya/";

    const TokenPrefix: vector<u8> = b"mfer #";

    struct ResourceCap has key {
        cap: SignerCapability
    }

    struct CollectionRefsStore has key {
        mutator_ref: collection::MutatorRef
    }

    struct TokenRefsStore has key {
        mutator_ref: token::MutatorRef,
        burn_ref: token::BurnRef,
        extend_ref: object::ExtendRef,
        transfer_ref: option::Option<object::TransferRef>
    }

    struct Content has key {
        content: string::String
    }

    #[event]
    struct MintEvent has drop, store {
        owner: address,
        token_id: address,
        content: string::String
    }

    #[event]
    struct SetContentEvent has drop, store {
        owner: address,
        token_id: address,
        old_content: string::String,
        new_content: string::String
    }

    #[event]
    struct BurnEvent has drop, store {
        owner: address,
        token_id: address,
        content: string::String
    }


    fun init_module(sender: &signer) {
        let (resource_signer, resource_cap) = account::create_resource_account(
            sender,
            ResourceAccountSeed
        );

        move_to(
            &resource_signer,
            ResourceCap {
                cap: resource_cap
            }
        );

        let collection_cref = collection::create_unlimited_collection(
            &resource_signer,
            string::utf8(CollectionDescription),
            string::utf8(CollectionName),
            option::some(royalty::create(5, 100, signer::address_of(sender))),
            string::utf8(CollectionURI)
        );

        let collection_signer = object::generate_signer(&collection_cref);

        let mutator_ref = collection::generate_mutator_ref(&collection_cref);

        move_to(
            &collection_signer,
            CollectionRefsStore {
                mutator_ref
            }
        );
    }

    entry public fun mint(
        sender: &signer,
        content: string::String
    ) acquires ResourceCap {
        let resource_cap = &borrow_global<ResourceCap>(
            account::create_resource_address(
                &@my_first_nft,
                ResourceAccountSeed
            )
        ).cap;

        let resource_signer = &account::create_signer_with_capability(
            resource_cap
        );
        let url = string::utf8(TokenURI);

        let token_cref = token::create_numbered_token(
            resource_signer,
            string::utf8(CollectionName),
            string::utf8(CollectionDescription),
            string::utf8(TokenPrefix),
            string::utf8(b""),
            option::none(),
            string::utf8(b""),
        );

        let id = token::index<Token>(object::object_from_constructor_ref(&token_cref));
        string::append(&mut url, string_utils::to_string(&id));
        string::append(&mut url, string::utf8(b".png"));

        let token_signer = object::generate_signer(&token_cref);

        // create token_mutator_ref
        let token_mutator_ref = token::generate_mutator_ref(&token_cref);

        token::set_uri(&token_mutator_ref, url);

        // create generate_burn_ref
        let token_burn_ref = token::generate_burn_ref(&token_cref);

        // if you want stop transfer ( must save transfer_ref
        // let transfer_ref = object::generate_transfer_ref(&token_cref);
        // object::disable_ungated_transfer(&transfer_ref);

        move_to(
            &token_signer,
            TokenRefsStore {
                mutator_ref: token_mutator_ref,
                burn_ref: token_burn_ref,
                extend_ref: object::generate_extend_ref(&token_cref),
                transfer_ref: option::none()
            }
        );

        move_to(
            &token_signer,
            Content {
                content
            }
        );

        event::emit(
            MintEvent {
                owner: signer::address_of(sender),
                token_id: object::address_from_constructor_ref(&token_cref),
                content
            }
        );

        object::transfer(
            resource_signer,
            object::object_from_constructor_ref<Token>(&token_cref),
            signer::address_of(sender),
        )
    }


    entry fun burn(
        sender: &signer,
        object: Object<Content>
    ) acquires TokenRefsStore, Content {
        assert!(object::is_owner(object, signer::address_of(sender)), ERROR_NOWNER);
        let TokenRefsStore {
            mutator_ref: _,
            burn_ref,
            extend_ref: _,
            transfer_ref: _
        } = move_from<TokenRefsStore>(object::object_address(&object));

        let Content {
            content
        } = move_from<Content>(object::object_address(&object));

        event::emit(
            BurnEvent {
                owner: object::owner(object),
                token_id: object::object_address(&object),
                content
            }
        );

        token::burn(burn_ref);
    }

    entry fun set_content(
        sender: &signer,
        object: Object<Content>,
        content: string::String
    ) acquires Content {
        let old_content = borrow_content(signer::address_of(sender), object).content;
        event::emit(
            SetContentEvent {
                owner: object::owner(object),
                token_id: object::object_address(&object),
                old_content,
                new_content: content
            }
        );
        borrow_mut_content(signer::address_of(sender), object).content = content;
    }

    #[view]
    public fun get_content(object: Object<Content>): string::String acquires Content {
        borrow_global<Content>(object::object_address(&object)).content
    }

    inline fun borrow_content(owner: address, object: Object<Content>): &Content {
        assert!(object::is_owner(object, owner), ERROR_NOWNER);
        borrow_global<Content>(object::object_address(&object))
    }

    inline fun borrow_mut_content(owner: address, object: Object<Content>): &mut Content {
        assert!(object::is_owner(object, owner), ERROR_NOWNER);
        borrow_global_mut<Content>(object::object_address(&object))
    }

    #[test_only]
    public fun init_for_test(sender: &signer) {
        init_module(sender)
    }
}`

export const MAILBOX = `module case::mailbox {

    use std::option::{Self, Option};
    use std::signer;
    use std::string::String;
    use std::vector;
    use aptos_std::smart_table::{Self, SmartTable};
    use aptos_std::smart_vector::{Self, SmartVector};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::object::{Self, Object, ObjectCore, ExtendRef};
    use aptos_token::token::{Self, Token, TokenId};

    const E_TOKEN_INPUT_LENGTH_MISMATCH: u64 = 2;

    const E_NO_MAILBOX_EXISTS: u64 = 3;

    const E_MAILBOX_NOT_EMPTY: u64 = 4;

    const E_MAILBOX_EMPTY: u64 = 5;

    const E_OUT_OF_BOUNDS: u64 = 6;

    const E_NOT_SENDER: u64 = 7;

    const SEED: vector<u8> = b"Mailbox";

    struct MailboxRouter has key {
        mailboxes: SmartTable<MailboxId, Mailbox>,
        extend_ref: ExtendRef,
    }

    struct MailboxId has store, copy, drop {
        receiver: address
    }

    struct Mailbox has store {
        mail: SmartVector<Envelope>,
    }

    struct Envelope has store {
        sender: address,
        note: Option<String>,
        coins: Option<Coin<AptosCoin>>,
        legacy_tokens: vector<Token>,
        objects: vector<Object<ObjectCore>>
    }

    fun init_module(deployer: &signer) {
        let constructor_ref = object::create_named_object(deployer, SEED);
        let extend_ref = object::generate_extend_ref(&constructor_ref);

        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        object::disable_ungated_transfer(&transfer_ref);

        let object_signer = object::generate_signer(&constructor_ref);
        move_to(&object_signer, MailboxRouter {
            mailboxes: smart_table::new(),
            extend_ref
        });
    }

    entry fun send_mail(
        caller: &signer,
        receiver: address,
        note: Option<String>,
        coin_amount: u64,
        objects: vector<Object<ObjectCore>>,
        legacy_token_creator_addresses: vector<address>,
        legacy_token_collection_names: vector<String>,
        legacy_token_names: vector<String>,
    ) acquires MailboxRouter {
        assert!(
            vector::length(&legacy_token_creator_addresses) == vector::length(&legacy_token_collection_names),
            E_TOKEN_INPUT_LENGTH_MISMATCH
        );
        assert!(
            vector::length(&legacy_token_creator_addresses) == vector::length(&legacy_token_names),
            E_TOKEN_INPUT_LENGTH_MISMATCH
        );

        let token_ids = vector[];
        let length = vector::length(&legacy_token_names);
        for (i in 0..length) {
            let creator_address = *vector::borrow(&legacy_token_creator_addresses, i);
            let collection_name = *vector::borrow(&legacy_token_collection_names, i);
            let token_name = *vector::borrow(&legacy_token_names, i);
            let data_id = token::create_token_data_id(creator_address, collection_name, token_name);
            let latest_property_version = token::get_tokendata_largest_property_version(creator_address, data_id);
            let token_id = token::create_token_id(data_id, latest_property_version);
            vector::push_back(&mut token_ids, token_id);
        };

        send_mail_internal(caller, receiver, note, coin_amount, objects, token_ids);
    }

    entry fun open_latest_envelope(caller: &signer) acquires MailboxRouter {
        let mailbox = get_mailbox(signer::address_of(caller));
        let length = smart_vector::length(&mailbox.mail);
        open_envelope(caller, length - 1)
    }

    entry fun open_oldest_envelope(caller: &signer) acquires MailboxRouter {
        open_envelope(caller, 0)
    }

    entry fun open_envelope(caller: &signer, num: u64) acquires MailboxRouter {
        let caller_address = signer::address_of(caller);
        let envelope = open_mail(caller_address, num);

        deposit_contents(caller, envelope);
    }

    entry fun return_envelope(sender: &signer, receiver: address, num: u64) acquires MailboxRouter {
        let envelope = open_mail(receiver, num);

        assert!(envelope.sender == signer::address_of(sender), E_NOT_SENDER);
        deposit_contents(sender, envelope);
    }

    fun deposit_contents(receiver: &signer, envelope: Envelope) acquires MailboxRouter {
        let receiver_address = signer::address_of(receiver);

        let Envelope {
            sender: _, 
            note: _, 
            coins,
            legacy_tokens,
            objects,
        } = envelope;

        if (option::is_some(&coins)) {
            coin::deposit(receiver_address, option::destroy_some(coins))
        } else {
            option::destroy_none(coins);
        };

        vector::for_each(legacy_tokens, |legacy_token| {
            token::deposit_token(receiver, legacy_token);
        });

        let mailbox_signer = get_mailbox_signer();
        vector::for_each(objects, |obj| {
            object::transfer(mailbox_signer, obj, receiver_address)
        });
    }

    entry fun destroy_mailbox(caller: &signer) acquires MailboxRouter {
        let receiver = signer::address_of(caller);
        let router = get_mailbox_router_mut();

        let mailbox_id = MailboxId { receiver };

        if (smart_table::contains(&router.mailboxes, mailbox_id)) {
            let is_empty = smart_vector::is_empty(&smart_table::borrow(&router.mailboxes, mailbox_id).mail);
            assert!(is_empty, E_MAILBOX_NOT_EMPTY);

            let Mailbox {
                mail,
            } = smart_table::remove(&mut router.mailboxes, mailbox_id);
            smart_vector::destroy_empty(mail);
        }
    }

    fun send_mail_internal(
        caller: &signer,
        receiver: address,
        note: Option<String>,
        coin_amount: u64,
        objects: vector<Object<ObjectCore>>,
        legacy_token_ids: vector<TokenId>
    ) acquires MailboxRouter {
        let coins = coin::withdraw<AptosCoin>(caller, coin_amount);

        vector::for_each_ref(&objects, |obj| {
            object::transfer(caller, *obj, @deploy_addr);
        });

        let legacy_tokens = vector::map(legacy_token_ids, |token_id| {
            token::withdraw_token(caller, token_id, 1)
        });

        let envelope = Envelope {
            sender: signer::address_of(caller),
            note,
            objects,
            legacy_tokens,
            coins: option::some(coins),
        };

        let router = get_mailbox_router_mut();
        let mailbox_id = MailboxId {
            receiver
        };
        if (!smart_table::contains(&router.mailboxes, mailbox_id)) {
            smart_table::add(&mut router.mailboxes, mailbox_id, Mailbox {
                mail: smart_vector::new(),
            })
        };

        let mailbox = smart_table::borrow_mut(&mut router.mailboxes, mailbox_id);

        smart_vector::push_back(&mut mailbox.mail, envelope);
    }

    fun open_mail(receiver: address, num: u64): Envelope acquires MailboxRouter {
        let mailbox = get_mailbox_mut(receiver);

        let length = smart_vector::length(&mailbox.mail);
        assert!(length > 0, E_MAILBOX_EMPTY); 
        assert!(num < length, E_OUT_OF_BOUNDS);

        smart_vector::remove(&mut mailbox.mail, num)
    }

    #[view]
    fun view_mail(receiver: address, num: u64): Envelope acquires MailboxRouter {
        let mailbox = get_mailbox_mut(receiver);

        smart_vector::remove(&mut mailbox.mail, num)
    }

    inline fun get_mailbox_router_mut(): &mut MailboxRouter {
        let mailbox_router_address = object::create_object_address(&@deploy_addr, SEED);
        borrow_global_mut<MailboxRouter>(mailbox_router_address)
    }

    inline fun get_mailbox_signer(): &signer {
        let router = get_mailbox_router_mut();
        &object::generate_signer_for_extending(&router.extend_ref)
    }

    inline fun get_mailbox_mut(receiver: address): &mut Mailbox {
        let router = get_mailbox_router_mut();
        let mailbox_id = MailboxId {
            receiver
        };
        assert!(smart_table::contains(&router.mailboxes, mailbox_id), E_NO_MAILBOX_EXISTS);

        smart_table::borrow_mut(&mut router.mailboxes, mailbox_id)
    }

    inline fun get_mailbox(receiver: address): &Mailbox {
        let router = get_mailbox_router_mut();
        let mailbox_id = MailboxId {
            receiver
        };
        assert!(smart_table::contains(&router.mailboxes, mailbox_id), E_NO_MAILBOX_EXISTS);

        smart_table::borrow(&mut router.mailboxes, mailbox_id)
    }
}
`
