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
