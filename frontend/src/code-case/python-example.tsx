export const RE_ENTRANCY_ATTACKS = `# 模拟传统智能合约环境
class TraditionalContract:
    def __init__(self):
        self.balance = 100

    def withdraw(self, amount):
        print(f"尝试从传统合约中提取 {amount} 个代币")
        if self.balance >= amount:
            print(f"  合约余额充足 (当前余额: {self.balance})")
            # 这里的外部调用可能导致重入
            self.send(amount)
            self.balance -= amount
            print(f"  提取后余额: {self.balance}")
        else:
            print(f"  余额不足，无法提取")

    def send(self, amount):
        print(f"  正在发送 {amount} 个代币")
        # 在实际情况中，这里会触发接收方的fallback函数
        AttackerContract.receive()

# 模拟攻击者合约
class AttackerContract:
    target = None
    attack_count = 0
    MAX_ATTACKS = 5  # 限制攻击次数，防止无限递归

    @classmethod
    def set_target(cls, target):
        cls.target = target
        cls.attack_count = 0

    @classmethod
    def attack(cls):
        print("攻击者开始攻击")
        cls.target.withdraw(10)

    @classmethod
    def receive(cls):
        cls.attack_count += 1
        if cls.attack_count <= cls.MAX_ATTACKS:
            print(f"  攻击者收到代币，尝试再次提取 (攻击次数: {cls.attack_count})")
            if cls.target.balance > 0:
                cls.target.withdraw(10)
        else:
            print(f"  攻击者达到最大攻击次数 ({cls.MAX_ATTACKS})，停止攻击")

# 模拟Move语言环境
class MoveContract:
    def __init__(self):
        self.balance = 100

    def withdraw(self, amount):
        print(f"尝试从Move合约中提取 {amount} 个代币")
        if self.balance >= amount:
            print(f"  合约余额充足 (当前余额: {self.balance})")
            # Move语言中，资源一次只能被单个执行上下文访问
            # 所以这里不会发生重入
            self.balance -= amount
            print(f"  提取后余额: {self.balance}")
            self.send(amount)
        else:
            print(f"  余额不足，无法提取")

    def send(self, amount):
        print(f"  正在发送 {amount} 个代币")

# 测试传统合约的重入攻击
print("============= 可重入攻击的合约环境 =============")
traditional = TraditionalContract()
AttackerContract.set_target(traditional)
AttackerContract.attack()
print("================================================")
print("============= 安全的合约环境 =============")
move_contract = MoveContract()
move_contract.withdraw(10)`

export const PERMISSION_VULNERABILITIES = `import random
from typing import Dict, Any

class Address:
    def __init__(self):
        self.value = random.randint(1000, 9999)
    
    def __str__(self):
        return f"0x{self.value:04x}"

class Resource:
    pass

class Signer:
    def __init__(self, address: Address):
        self.address = address

class BaseContract:
    def __init__(self):
        self.resources: Dict[Address, Dict[str, Any]] = {}
    
    def move_to(self, account: Address, resource_name: str, resource: Any):
        if account not in self.resources:
            self.resources[account] = {}
        self.resources[account][resource_name] = resource
    
    def exists(self, account: Address, resource_name: str) -> bool:
        return account in self.resources and resource_name in self.resources[account]
    
    def borrow_global(self, account: Address, resource_name: str) -> Any:
        if not self.exists(account, resource_name):
            raise Exception(f"Resource {resource_name} does not exist for account {account}")
        return self.resources[account][resource_name]

class VulnerableContract(BaseContract):
    def initialize(self, account: Signer):
        self.move_to(account.address, "AdminCapability", Resource())
        log(f"VulnerableContract: 为账户 {account.address} 初始化", "这个操作正确地为管理员账户创建了AdminCapability资源")
    
    def perform_admin_action(self, account: Signer):
        # 漏洞：没有检查调用者是否具有AdminCapability
        log(f"VulnerableContract: 账户 {account.address} 执行管理员操作", 
            "安全漏洞：这个函数没有检查调用者是否拥有AdminCapability。任何账户都可以执行管理员操作，这是一个严重的权限控制缺陷。")
    
    def transfer_funds(self, from_account: Signer, to_address: Address, amount: int):
        # 漏洞：没有检查from_account是否有足够的资金
        log(f"VulnerableContract: 从 {from_account.address} 转移 {amount} 到 {to_address}", 
            "安全漏洞：这个函数没有检查发送方是否有足够的资金。它允许转移不存在的资金，可能导致资金凭空创造或负余额。")

class SecureContract(BaseContract):
    def initialize(self, account: Signer):
        self.move_to(account.address, "AdminCapability", Resource())
        self.move_to(account.address, "Balance", 1000)  # 初始余额
        log(f"SecureContract: 为账户 {account.address} 初始化", 
            "这个操作正确地为管理员账户创建了AdminCapability资源和初始余额。这是安全的初始化过程。")
    
    def perform_admin_action(self, account: Signer):
        assert self.exists(account.address, "AdminCapability"), "权限拒绝：未找到管理员权限"
        log(f"SecureContract: 账户 {account.address} 执行管理员操作", 
            "安全特性：这个函数在执行管理员操作之前检查了AdminCapability的存在。这确保只有授权的管理员才能执行此操作。")
    
    def transfer_funds(self, from_account: Signer, to_address: Address, amount: int):
        assert self.exists(from_account.address, "Balance"), "余额资源不存在"
        balance = self.borrow_global(from_account.address, "Balance")
        assert balance >= amount, "余额不足"
        
        self.resources[from_account.address]["Balance"] -= amount
        if not self.exists(to_address, "Balance"):
            self.move_to(to_address, "Balance", amount)
        else:
            self.resources[to_address]["Balance"] += amount
        
        log(f"SecureContract: 从 {from_account.address} 转移 {amount} 到 {to_address}", 
            "安全特性：这个函数在转移资金之前检查了发送方的余额是否足够。它还确保接收方的Balance资源存在。这防止了资金凭空创造和负余额的问题。")
    
    def get_balance(self, account: Address) -> int:
        assert self.exists(account, "Balance"), "余额资源不存在"
        return self.borrow_global(account, "Balance")

def deploy_and_test_contracts():
    vulnerable_contract = VulnerableContract()
    secure_contract = SecureContract()
    
    admin = Signer(Address())
    user1 = Signer(Address())
    user2 = Signer(Address())
    
    log("合约部署成功", "现在我们有了两个合约：一个有漏洞的合约和一个安全的合约。我们将比较它们的行为。")
    
    log("================ 测试 VulnerableContract ================")
    vulnerable_contract.initialize(admin)
    
    vulnerable_contract.perform_admin_action(user1)
    log("漏洞演示1: 非管理员执行了管理员操作", 
        "这显示了VulnerableContract中的权限控制缺陷。在实际的Move合约中，这将是一个严重的安全漏洞。")
    
    vulnerable_contract.transfer_funds(user1, user2.address, 1000000)
    log("漏洞演示2: 转移了不存在的资金", 
        "这显示了VulnerableContract中的另一个漏洞：没有进行适当的余额检查。在真实环境中，这可能导致严重的经济损失。")
    
    log("================ 测试 SecureContract ================")
    secure_contract.initialize(admin)
    
    try:
        secure_contract.perform_admin_action(user1)
    except AssertionError as e:
        log(f"安全特性演示1: 非管理员无法执行管理员操作 - {str(e)}", 
            "这显示了SecureContract正确实现了权限控制。只有拥有AdminCapability的账户才能执行管理员操作。")
    
    secure_contract.perform_admin_action(admin)
    log("安全特性演示2: 管理员成功执行管理员操作", 
        "这证明了管理员权限检查的正确性。只有初始化时获得AdminCapability的账户才能执行此操作。")
    
    try:
        secure_contract.transfer_funds(user1, user2.address, 2000)
    except AssertionError as e:
        log(f"安全特性演示3: 无法转移超过余额的资金 - {str(e)}", 
            "这展示了SecureContract中正确的余额检查实现。它防止了透支和资金凭空创造的问题。")
    
    secure_contract.transfer_funds(admin, user1.address, 500)
    log(f"用户1余额: {secure_contract.get_balance(user1.address)}", 
        "这显示了安全的资金转移操作。管理员成功向用户1转移了资金，用户1的余额被正确更新。")
    
    secure_contract.transfer_funds(user1, user2.address, 200)
    log(f"转账后用户1余额: {secure_contract.get_balance(user1.address)}", 
        "这进一步展示了安全的资金转移。用户1成功向用户2转移了部分资金，余额被正确减少。")
    log(f"转账后用户2余额: {secure_contract.get_balance(user2.address)}", 
        "用户2的余额增加，证明资金转移操作的完整性。")

def log(message, explanation=""):
    print(f"[日志] {message}")
    if explanation:
        print(f"[解释] {explanation}")

if __name__ == "__main__":
    deploy_and_test_contracts()`

export const DISPLACEMENT_OVERFLOW = `import random

# 模拟 Move 中的 u8 类型（0-255）
MAX_U8 = 255

class Address:
    def __init__(self):
        self.value = random.randint(1000, 9999)
    
    def __str__(self):
        return f"0x{self.value:04x}"

class Coin:
    def __init__(self, value: int):
        self.value = value

class MoveVM:
    def __init__(self):
        self.resources = {}

    def move_to(self, address: Address, resource):
        if address not in self.resources:
            self.resources[address] = {}
        self.resources[address][type(resource).__name__] = resource

    def borrow_global(self, address: Address, resource_type):
        return self.resources[address][resource_type.__name__]

class VulnerableContract:
    @staticmethod
    def initialize(vm: MoveVM, address: Address):
        """初始化用户的 Coin 资源"""
        vm.move_to(address, Coin(10))  # 初始值为 10
        log(f"VulnerableContract: 为地址 {address} 初始化 Coin 资源，值为 10")

    @staticmethod
    def double_value(vm: MoveVM, address: Address):
        """使用不安全的位移操作翻倍 Coin 的值"""
        coin = vm.borrow_global(address, Coin)
        # 不安全的位移操作
        coin.value = (coin.value << 1) & MAX_U8
        log(f"VulnerableContract: 地址 {address} 的 Coin 值翻倍后为 {coin.value}", 
            "警告：这个操作使用了不安全的位移，可能导致意外结果")

class SecureContract:
    @staticmethod
    def initialize(vm: MoveVM, address: Address):
        """初始化用户的 Coin 资源"""
        vm.move_to(address, Coin(10))  # 初始值为 10
        log(f"SecureContract: 为地址 {address} 初始化 Coin 资源，值为 10")

    @staticmethod
    def double_value(vm: MoveVM, address: Address):
        """使用安全的算术操作翻倍 Coin 的值"""
        coin = vm.borrow_global(address, Coin)
        if coin.value > MAX_U8 // 2:
            raise OverflowError("翻倍操作将导致溢出")
        coin.value = coin.value * 2
        log(f"SecureContract: 地址 {address} 的 Coin 值安全地翻倍为 {coin.value}", 
            "这个操作使用了安全的算术，防止了溢出")

def test_contracts():
    vm = MoveVM()
    address1 = Address()
    address2 = Address()

    log("================ 开始测试 VulnerableContract ================")
    VulnerableContract.initialize(vm, address1)
    for _ in range(5):
        VulnerableContract.double_value(vm, address1)
    
    log("================ 开始测试 SecureContract ================")
    SecureContract.initialize(vm, address2)
    try:
        for _ in range(5):
            SecureContract.double_value(vm, address2)
    except OverflowError as e:
        log(f"安全检查捕获到错误: {e}", "这表明 SecureContract 成功防止了溢出")

def log(message, explanation=""):
    print(f"[日志] {message}")
    if explanation:
        print(f"[解释] {explanation}")
    print()

if __name__ == "__main__":
    test_contracts()`
