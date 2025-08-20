// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PayableReceiver
 * @dev A simple contract for testing calldata restrictions with payable functions.
 * Used in e2e tests to validate that delegated calls with specific calldata work correctly.
 */
contract PayableReceiver {
    uint256 public totalReceived;
    uint256 public callCount;

    event EthReceived(address indexed sender, uint256 amount, uint256 totalReceived);

    /**
     * @dev Payable function that accepts ETH with no parameters
     * Perfect for testing exactCalldata and allowedCalldata restrictions
     */
    function receiveEth() external payable {
        totalReceived += msg.value;
        callCount += 1;

        emit EthReceived(msg.sender, msg.value, totalReceived);
    }

    /**
     * @dev Another payable function with different calldata for testing allowedCalldata patterns
     */
    function receiveEthAlternative() external payable {
        totalReceived += msg.value;
        callCount += 1;

        emit EthReceived(msg.sender, msg.value, totalReceived);
    }

    /**
     * @dev Get the contract's current ETH balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Reset counters for testing (only for testing purposes)
     */
    function reset() external {
        totalReceived = 0;
        callCount = 0;
    }
}
