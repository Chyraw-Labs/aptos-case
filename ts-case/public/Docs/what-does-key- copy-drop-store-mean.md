# 结构体中能力的作用

[查看原文](https://x.com/Greg_Nazario/status/1751025731839373612)

> `key` 是什么意思？ `store` 是什么意思？”
>
> 它的灵感来自于许多现有的 NFT 市场的邮箱系统，用于将剩余的数字资产发送给其他用户。

您是否曾想过在 Move 中哪些结构体具备哪些能力？

`key`、`copy`、`drop`、`store` 是什么意思？

我将为您展示在一个普通的日常邮箱用例中这些能力是如何运作的。

让我们在本期的 [DailyMove](https://www.chyraw.com/tags/DailyMove) 中深入探讨。

与所有这些示例一样，我们会使用一个对象来存储邮箱的主要资源。我将其称为 `MailboxRouter`，它为所有用户的邮箱提供了一个单一的存放位置。

我们可以看到它具有 `key` 能力，这允许它作为资源存储在一个地址中。

```rust
/// 一个结构体，代表共享位置的邮箱
///
/// 在这个示例中，它只能在合约创建时创建的对象中存在
struct MailboxRouter has key {
    mailboxes: SmartTable<MailboxId, Mailbox>,
    extend_ref: ExtendRef,
}
```

![https://pbs.twimg.com/media/GEzgthRaMAAYzqT?format=jpg&name=medium](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzgthRaMAAYzqT.jpeg)

但这个 `key` 意味着什么呢？

它意味着能够**从全局状态中借用 (`borrow`)**，这在 Move 中是一个**关键概念**。全局状态可以被视为一个大型地图 (`map`)，其中包含每个地址及其对应的资源。

在这种情况下，邮箱路由地址变量（`mailbox_router_address`） 和 邮箱路由结构体（`MailboxRouter`）之间的关系可以看作是**借用**。

```rust
/// 获取邮箱路由器对象的可变引用
inline fun get_mailbox_router_mut(): &mut MailboxRouter {
    // 使用deploy_addr和SEED创建邮箱路由器对象的地址
    let mailbox_router_address = object::create_object_address(&@deploy_addr, SEED);
    // 借用全局状态中的邮箱路由器对象
    borrow_global_mut<MailboxRouter>(mailbox_router_address)
}
```

![https://pbs.twimg.com/media/GEzg7kvaIAAuMrj?format=jpg&name=large](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzg7kvaIAAuMrj.jpeg)

但是，我们怎样把邮件放入邮箱呢？

路由器有一个 `SmartTable`，它带有两个输入 `MailboxId` 和 `Mailbox`

`MailboxId` 必须具有 `store` 能力。这使得它能够**原生地存储在另一个对象中**，一般是一个 `table` 或 `vector` 。

`Mailbox` 也有 `store` 这种能力。但是，它也有 `copy` 和 `drop` 能力。

```rust
struct MailboxId has store, copy, drop {
    receiver: address
}

/// 一个邮箱，它能跟踪所有信封，并按时间顺序插入到邮箱
struct Mailbox has store {
    mail: SmartVector<Envelope>,
}
```

![https://pbs.twimg.com/media/GEzhdsKaoAA0kFb?format=jpg&name=medium](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzhdsKaoAA0kFb.jpeg)

`copy` 允许您**直接复制内部内容**。

````rust
/// 这是一个用于 SmartTable 中的键的结构体
///
/// 它必须具有 store 能力，以便能够放入像 SmartTable 或 Vector 这样的集合中
///
/// 它必须具有 copy 能力，以便能够从引用版本中被解引用或复制
///
/// 例如：
```rust
let id = MailboxId { receiver: @0x1 }
let reference = &id;
let copied_id = *reference;
```
///
/// 如果它不是 copy 的，那么它就不能直接被复制，而是需要手动传递它的内容：
/// 例如：
```rust
let id = MailboxId { receiver: @0x1 }
let reference = &id;
let copied_id = MailboxId { receiver: *reference.receiver };
```
````

想一下像地址（`address`）这样的东西，并非只有一个，但是像 NFT 或一些 coin，您无法复制（`copy`）它。

所有**可复制的结构体**还要求所有**内部字段**也都是**可复制**的。

`drop` 允许您**在任何时候丢弃**该值。对于您最喜欢的 NFT 而言，有些东西您可能不希望它从区块链中消失。

![https://pbs.twimg.com/media/GEzh280aIAAgQDy?format=png&name=medium](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzh280aIAAgQDy.png)

让我们来聊聊我们要放入邮箱的信封。

这些只有 `store`，那是因为 `Coin` 和 `Token` 类型不具备 `copy` 或 `drop` 能力。

但是，您可能会想，读完邮件后我怎么销毁信封呢？在现实世界中，我会取出信件，然后扔掉信封。让我们看看。

```rust
struct Envelope has store {
    /// 信封的发送者
    /// 这是必需的，以便能够退回信封
    sender: address,
    /// 给收件人的字符串备注
    note: Option<String>,
    /// 这只支持 AptosCoin，但可以扩展
    coins: Option<Coin<AptosCoin>>,
    /// 旧版代币标准
    legacy_tokens: vector<Token>,
    /// 任何对象，包括数字资产
    objects: vector<Object<ObjectCore>>
}
```

![https://pbs.twimg.com/media/GEzicVEaoAAf0Fj?format=jpg&name=medium](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzicVEaoAAf0Fj.jpeg)

像 `Envelope` 这样的结构可以被拆解成多个它的组成部分。这意味着我们可以将其分割，去掉不需要的部分，同时保留需要的部分，并将其保留的部分分发到其他地方。

就像您可能会撕开一个信封，取出装着您辛苦挣来的薪水，然后把信封扔掉。

```rust
let Envelope {
    sender: _, // 通过使用 _ 代替名称来丢弃以后不需要的字段
    note: _, // 丢弃备注，仅在交易中查看
    coins,
    legacy_tokens,
    objects,
} = envelope;
```

![https://pbs.twimg.com/media/GEzi-QvaUAEGMtZ?format=jpg&name=medium](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzi-QvaUAEGMtZ.jpeg)

但是，Greg，我只想寄邮件啦。

信封可以被逐步构建，里面包含每个所需部分。

当用户想要领取邮件时，他们会根据自己的邮箱获得授权。不过，发件人的信息也会保留在邮件中，这样可以作为取消邮件的保障，以防发送给错误的人（要是美国邮政服务也能这样做就好了）。

```rust
/// 向另一个账户发送邮件
fun send_mail_internal(
    caller: &signer,
    receiver: address,
    note: Option<String>,
    coin_amount: u64,
    objects: vector<Object<ObjectCore>>,
    legacy_token_ids: vector<TokenId>
) acquires MailboxRouter {
    // 将硬币放入信封
    let coins = coin::withdraw<AptosCoin>(caller, coin_amount);

    // 出于此演示的目的，我们将对象和代币的所有权转移到合约中，但通常这可以在没有中间人的情况下完成

    // 将所有对象转移到合约
    vector::for_each_ref(&objects, |obj| {
        object::transfer(caller, *obj, @deploy_addr);
    });

    // 为信封检索所有代币
    let legacy_tokens = vector::map(legacy_token_ids, |token_id| {
        // 对于此演示，我们只考虑非同质化代币
        token::withdraw_token(caller, token_id, 1)
    });

    let envelope = Envelope {
        sender: signer::address_of(caller),
        note,
        objects,
        legacy_tokens,
        coins: option::some(coins),
    };

    // 检索邮箱，如果不存在则创建它
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

    // 将信封推到邮箱上
    smart_vector::push_back(&mut mailbox.mail, envelope);
}
```

![https://pbs.twimg.com/media/GEzjZNUaIAA_REx?format=jpg&name=900x900](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzjZNUaIAA_REx.jpeg)

![https://pbs.twimg.com/media/GEzjgK9bsAI2kU_?format=jpg&name=large](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzjgK9bsAI2kU_.jpeg)

打开和查看邮件很简单，因为能力（`capabilities`）让我们可以存储邮件并将其内容转移给他人。你甚至可以在邮件还在邮箱里的时候查看它，就像我那一千封总是忘记删除的邮件一样。

```rust
/// 打开索引的邮件
fun open_mail(receiver: address, num: u64): Envelope acquires MailboxRouter {
    let mailbox = get_mailbox_mut(receiver);

    // 检查num是否可以移除
    let length = smart_vector::length(&mailbox.mail);
    assert!(length > 0, E_MAILBOX_EMPTY); // 这是为了在没有邮件时给出友好的消息
    assert!(num < length, E_OUT_OF_BOUNDS);

    // 这将从智能向量中移除项目。
    // 从gas的角度来看，移除最旧的邮件比最新的要昂贵得多，但它保留了顺序。
    //
    // 如果顺序不重要，可以使用smart_vector::swap_remove
    smart_vector::remove(&mut mailbox.mail, num)
}

#[view]
/// 查看用户邮箱中的邮件
fun view_mail(receiver: address, num: u64): Envelope acquires MailboxRouter {
    // 获取可变的邮箱引用
    let mailbox = get_mailbox_mut(receiver);

    // 移除并返回指定索引的邮件
    smart_vector::remove(&mut mailbox.mail, num)
}
```

![https://pbs.twimg.com/media/GEzj9xFbQAAq4nn?format=jpg&name=medium](https://mielgo-markdown.oss-cn-chengdu.aliyuncs.com/GEzj9xFbQAAq4nn.jpeg)

感谢阅读，希望您对 Move 结构体的功能有了些许了解。

所有源代码都可在此处获取： [struct-capabilities](https://github.com/aptos-labs/daily-move/tree/main/snippets/struct-capabilities)

中文译注合约源码：

````rust
/// 邮箱示例。这展示了如何使用中间人合约创建一个邮箱，向其他用户发送多种不同类型的项目。
///
/// 信封包装了在两方之间发送的对象、代币和硬币，并且如果收件人没有认领，可以由发件人取回。

module deploy_addr::mailbox {

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

    /// 不是所有的代币输入（creator_addresses, collection_names, token_names）长度都匹配
    const E_TOKEN_INPUT_LENGTH_MISMATCH: u64 = 2;

    /// 收件人没有邮箱存在
    const E_NO_MAILBOX_EXISTS: u64 = 3;

    /// 邮箱不为空，不能删除它
    const E_MAILBOX_NOT_EMPTY: u64 = 4;

    /// 邮箱为空
    const E_MAILBOX_EMPTY: u64 = 5;

    /// 邮件索引超出范围，可能已经被打开
    const E_OUT_OF_BOUNDS: u64 = 6;

    /// 不能退回信封，调用者不是信封的发送者
    const E_NOT_SENDER: u64 = 7;

    const SEED: vector<u8> = b"Mailbox";

    /// 一个结构体，代表共享位置的邮箱
    ///
    /// 在这个示例中，它只能在合约创建时创建的对象中存在
    struct MailboxRouter has key {
        mailboxes: SmartTable<MailboxId, Mailbox>,
        extend_ref: ExtendRef,
    }

    /// 这是一个用于 SmartTable 中的键的结构体
    ///
    /// 它必须具有 store 能力，以便能够放入像 SmartTable 或 Vector 这样的集合中
    ///
    /// 它必须具有 copy 能力，以便能够从引用版本中被取消引用或“copy ”
    ///
    /// 例如：
    /// ```move
    /// let id = MailboxId { receiver: @0x1 }
    /// let reference = &id;
    /// let copied_id = *reference;
    /// ```
    ///
    /// 如果它不是 copy 的，那么它就不能直接被复制，而是需要手动传递它的内容：
    /// 例如：
    /// ```move
    /// let id = MailboxId { receiver: @0x1 }
    /// let reference = &id;
    /// let copied_id = MailboxId { receiver: *reference.receiver };
    /// ```

    struct MailboxId has store, copy, drop {
        receiver: address
    }

    /// 一个邮箱，跟踪所有信封按时间顺序插入的顺序
    struct Mailbox has store {
        mail: SmartVector<Envelope>,
    }

    /// 一个信封，存储要发送给收件人的物品
    ///
    /// 这种类型不能复制或丢弃，因为硬币和代币不能复制或丢弃。
    ///
    /// 这些物品不能复制或丢弃的目的是防止NFT丢失和硬币丢失。
    ///
    /// 然而，信封可以通过分解来拆卸，这将允许直接移除每一块
    /// 例如：
    /// ```move
    /// let Envelope {
    ///   sender,
    ///   note,
    ///   coins,
    ///   legacy_tokens,
    ///   objects
    /// } = envelope;
    /// ```
    struct Envelope has store {
        /// 信封的发送者
        /// 这是必需的，以便能够退回信封
        sender: address,
        /// 给收件人的字符串备注
        note: Option<String>,
        /// 这只支持AptosCoin，但可以扩展
        coins: Option<Coin<AptosCoin>>,
        /// 旧版代币标准
        legacy_tokens: vector<Token>,
        /// 任何对象，包括数字资产
        objects: vector<Object<ObjectCore>>
    }

    /// 在部署此合约时设置，对象中邮箱的唯一实例
    fun init_module(deployer: &signer) {
        // 创建一个以deployer命名的对象，并使用SEED作为种子
        let constructor_ref = object::create_named_object(deployer, SEED);
        let extend_ref = object::generate_extend_ref(&constructor_ref);

        // 禁用邮箱对象的转移，并丢弃它，这样就没有人设法转移邮箱
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        object::disable_ungated_transfer(&transfer_ref);

        // 生成对象的签名者
        let object_signer = object::generate_signer(&constructor_ref);
        // 将MailboxRouter对象转移到签名者地址
        move_to(&object_signer, MailboxRouter {
            mailboxes: smart_table::new(),
            extend_ref
        });
    }

    /// 向地址发送信封，信封中包含对象、硬币、代币和备注
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
        // 确保所有输入的长度都匹配（代币ID将有效）
        assert!(
            vector::length(&legacy_token_creator_addresses) == vector::length(&legacy_token_collection_names),
            E_TOKEN_INPUT_LENGTH_MISMATCH
        );
        assert!(
            vector::length(&legacy_token_creator_addresses) == vector::length(&legacy_token_names),
            E_TOKEN_INPUT_LENGTH_MISMATCH
        );

        // 为旧版代币构建代币ID
        let token_ids = vector[];
        let length = vector::length(&legacy_token_names);
        for(i
        in
        0..length)
        {
            let creator_address = *vector::borrow(&legacy_token_creator_addresses, i);
            let collection_name = *vector::borrow(&legacy_token_collection_names, i);
            let token_name = *vector::borrow(&legacy_token_names, i);
            let data_id = token::create_token_data_id(creator_address, collection_name, token_name);
            let latest_property_version = token::get_tokendata_largest_property_version(creator_address, data_id);
            let token_id = token::create_token_id(data_id, latest_property_version);
            vector::push_back(&mut token_ids, token_id);
        };

        // 调用内部函数发送邮件
        send_mail_internal(caller, receiver, note, coin_amount, objects, token_ids);
    }

    /// 打开最新的信封
    entry fun open_latest_envelope(caller: &signer) acquires MailboxRouter {
        // 获取调用者的邮箱
        let mailbox = get_mailbox(signer::address_of(caller));
        // 获取邮箱中邮件的数量
        let length = smart_vector::length(&mailbox.mail);
        // 打开最后一封信，即索引为length - 1的信
        open_envelope(caller, length - 1)
    }

    /// 打开最旧的信封
    entry fun open_oldest_envelope(caller: &signer) acquires MailboxRouter {
        // 打开第一封信，即索引为0的信
        open_envelope(caller, 0)
    }

    /// 打开任意编号的信封
    entry fun open_envelope(caller: &signer, num: u64) acquires MailboxRouter {
        // 获取调用者的地址
        let caller_address = signer::address_of(caller);
        // 打开指定编号的信
        let envelope = open_mail(caller_address, num);

        // 存入信封的内容
        deposit_contents(caller, envelope);
    }

    /// 将信封退回给发送者，但前提是该人已发送邮件
    entry fun return_envelope(sender: &signer, receiver: address, num: u64) acquires MailboxRouter {
        // 打开指定编号的信
        let envelope = open_mail(receiver, num);

        // 只有发送者可以取回信封的内容
        assert!(envelope.sender == signer::address_of(sender), E_NOT_SENDER);
        // 存入信封的内容
        deposit_contents(sender, envelope);
    }

    /// 存入信封的内容
    fun deposit_contents(receiver: &signer, envelope: Envelope) acquires MailboxRouter {
        // 获取收件人的地址
        let receiver_address = signer::address_of(receiver);

        // 由于信封不可丢弃，它必须被分解为其组成部分以销毁
        let Envelope {
            sender: _, // 通过使用_代替名称来丢弃以后不需要的字段
            note: _, // 丢弃备注，仅在交易中查看
            coins,
            legacy_tokens,
            objects,
        } = envelope;

        // 如果有，存入硬币，这些不能被丢弃
        if (option::is_some(&coins)) {
            coin::deposit(receiver_address, option::destroy_some(coins))
        } else {
            option::destroy_none(coins);
        };

        // 存入所有旧版代币，这些不能被丢弃
        vector::for_each(legacy_tokens, |legacy_token| {
            token::deposit_token(receiver, legacy_token);
        });

        // 存入所有对象，如果错过这一步，对象将被困在路由器账户上
        let mailbox_signer = get_mailbox_signer();
        vector::for_each(objects, |obj| {
            object::transfer(mailbox_signer, obj, receiver_address)
        });

        // 此时，所有部分都已转移到收件人
    }

    /// 移除你的邮箱，并取回存储 gas
    entry fun destroy_mailbox(caller: &signer) acquires MailboxRouter {
        // 获取调用者的地址
        let receiver = signer::address_of(caller);
        // 获取邮箱路由器的可变引用
        let router = get_mailbox_router_mut();

        let mailbox_id = MailboxId { receiver };

        if (smart_table::contains(&router.mailboxes, mailbox_id)) {
            // 检查邮箱是否为空
            let is_empty = smart_vector::is_empty(&smart_table::borrow(&router.mailboxes, mailbox_id).mail);
            assert!(is_empty, E_MAILBOX_NOT_EMPTY);

            // 分解并销毁邮箱
            let Mailbox {
                mail,
            } = smart_table::remove(&mut router.mailboxes, mailbox_id);
            smart_vector::destroy_empty(mail);
        }
    }

    /// 向另一个账户发送邮件
    fun send_mail_internal(
        caller: &signer,
        receiver: address,
        note: Option<String>,
        coin_amount: u64,
        objects: vector<Object<ObjectCore>>,
        legacy_token_ids: vector<TokenId>
    ) acquires MailboxRouter {
        // 将硬币放入信封
        let coins = coin::withdraw<AptosCoin>(caller, coin_amount);

        // 出于此演示的目的，我们将对象和代币的所有权转移到合约中，但通常这可以在没有中间人的情况下完成

        // 将所有对象转移到合约
        vector::for_each_ref(&objects, |obj| {
            object::transfer(caller, *obj, @deploy_addr);
        });

        // 为信封检索所有代币
        let legacy_tokens = vector::map(legacy_token_ids, |token_id| {
            // 对于此演示，我们只考虑非同质化代币
            token::withdraw_token(caller, token_id, 1)
        });

        let envelope = Envelope {
            sender: signer::address_of(caller),
            note,
            objects,
            legacy_tokens,
            coins: option::some(coins),
        };

        // 检索邮箱，如果不存在则创建它
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

        // 将信封推到邮箱上
        smart_vector::push_back(&mut mailbox.mail, envelope);
    }

    /// 打开索引的邮件
    fun open_mail(receiver: address, num: u64): Envelope acquires MailboxRouter {
        let mailbox = get_mailbox_mut(receiver);

        // 检查num是否可以移除
        let length = smart_vector::length(&mailbox.mail);
        assert!(length > 0, E_MAILBOX_EMPTY); // 这是为了在没有邮件时给出友好的消息
        assert!(num < length, E_OUT_OF_BOUNDS);

        // 这将从智能向量中移除项目。
        // 从gas的角度来看，移除最旧的邮件比最新的要昂贵得多，但它保留了顺序。
        //
        // 如果顺序不重要，可以使用smart_vector::swap_remove
        smart_vector::remove(&mut mailbox.mail, num)
    }

    #[view]
    /// 查看用户邮箱中的邮件
    fun view_mail(receiver: address, num: u64): Envelope acquires MailboxRouter {
        // 获取可变的邮箱引用
        let mailbox = get_mailbox_mut(receiver);

        // 移除并返回指定索引的邮件
        smart_vector::remove(&mut mailbox.mail, num)
    }

    /// 获取邮箱路由器对象的可变引用
    inline fun get_mailbox_router_mut(): &mut MailboxRouter {
        // 使用deploy_addr和SEED创建邮箱路由器对象的地址
        let mailbox_router_address = object::create_object_address(&@deploy_addr, SEED);
        // 借用全局状态中的邮箱路由器对象
        borrow_global_mut<MailboxRouter>(mailbox_router_address)
    }

    /// 获取用于移动对象的邮箱签名者
    inline fun get_mailbox_signer(): &signer {
        // 获取邮箱路由器对象的可变引用
        let router = get_mailbox_router_mut();
        // 生成用于扩展操作的签名者
        &object::generate_signer_for_extending(&router.extend_ref)
    }

    /// 为用户检索可变的邮箱以进行读取
    inline fun get_mailbox_mut(receiver: address): &mut Mailbox {
        // 获取邮箱路由器对象的可变引用
        let router = get_mailbox_router_mut();
        // 创建邮箱ID
        let mailbox_id = MailboxId {
            receiver
        };
        // 确保邮箱存在
        assert!(smart_table::contains(&router.mailboxes, mailbox_id), E_NO_MAILBOX_EXISTS);
        // 借用邮箱路由器中的邮箱
        smart_table::borrow_mut(&mut router.mailboxes, mailbox_id)
    }

    /// 以不可变方式检索用户的邮箱
    inline fun get_mailbox(receiver: address): &Mailbox {
        // 获取邮箱路由器对象的可变引用
        let router = get_mailbox_router_mut();
        // 创建邮箱ID
        let mailbox_id = MailboxId {
            receiver
        };
        // 确保邮箱存在
        assert!(smart_table::contains(&router.mailboxes, mailbox_id), E_NO_MAILBOX_EXISTS);
        // 借用邮箱路由器中的邮箱，以不可变方式
        smart_table::borrow(&mut router.mailboxes, mailbox_id)
    }
}
````
