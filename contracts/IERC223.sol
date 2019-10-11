pragma solidity ^0.4.24;

interface IERC223 {
    function transfer(address to, uint256 amount, bytes data) external returns (bool);
    function transferFrom(address from, address to, uint256 amount, bytes data) external returns (bool);
}
