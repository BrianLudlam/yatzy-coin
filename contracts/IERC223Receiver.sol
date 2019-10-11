pragma solidity ^0.4.24;

interface IERC223Receiver {
    function tokenFallback(address from, uint value, bytes data) external;
}