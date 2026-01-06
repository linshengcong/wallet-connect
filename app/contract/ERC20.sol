// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IERC20.sol";

/**
 * @dev ERC20 代币标准的实现合约
 * 实现了 IERC20 接口规定的所有函数
 */
contract ERC20 is IERC20 {
    // 状态变量
    mapping(address => uint256) public override balanceOf; // 账户余额
    mapping(address => mapping(address => uint256)) public override allowance; // 授权额度

    uint256 public override totalSupply; // 代币总供给

    string public name; // 代币名称
    string public symbol; // 代币代号
    uint8 public decimals = 18; // 小数位数

    /**
     * @dev 构造函数：初始化代币名称、代号
     * @param name_ 代币名称
     * @param symbol_ 代币代号
     */
    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
    }

    /**
     * @dev 实现 IERC20 的 transfer 函数，代币转账逻辑
     * 调用方扣除 amount 数量代币，接收方增加相应代币
     * @param recipient 接收方地址
     * @param amount 转账数量
     * @return 成功返回 true
     */
    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @dev 实现 IERC20 的 approve 函数，代币授权逻辑
     * 被授权方 spender 可以支配授权方的 amount 数量的代币
     * @param spender 被授权方地址（可以是 EOA 或合约地址）
     * @param amount 授权数量
     * @return 成功返回 true
     */
    function approve(
        address spender,
        uint256 amount
    ) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev 实现 IERC20 的 transferFrom 函数，授权转账逻辑
     * 被授权方将授权方 sender 的 amount 数量代币转账给接收方 recipient
     * @param sender 授权方地址
     * @param recipient 接收方地址
     * @param amount 转账数量
     * @return 成功返回 true
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    /**
     * @dev 铸造代币函数（不在 IERC20 标准中）
     * 注意：此为教程示例，任何人可铸造。实际应用中应加权限管理
     * @param amount 铸造数量
     */
    function mint(uint256 amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    /**
     * @dev 销毁代币函数（不在 IERC20 标准中）
     * @param amount 销毁数量
     */
    function burn(uint256 amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
