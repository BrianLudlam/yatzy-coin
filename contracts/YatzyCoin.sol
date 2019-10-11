pragma solidity ^0.4.24;
import "./CoinBase.sol";

contract YatzyCoin is CoinBase {
    
    string public name = "YatzyCoin";
    string public symbol = "YATZ";
    uint256 public constant INITIAL_SUPPLY = 1000000000;//1 billion

    address private _owner;
    
    constructor() CoinBase(INITIAL_SUPPLY) public {
        _owner = msg.sender;
    }

    function mintToOwner(uint256 amount) public {
        require(msg.sender == _owner, "Only owner is allowed to mint");
        mintAmount(_owner, amount);
    } 

    //remove in production
    function destroy() external {
       require (msg.sender == _owner);
       selfdestruct(_owner);
    }
    
    //Return to sender, any abstract transfers
    function () external payable { msg.sender.transfer(msg.value); }
}