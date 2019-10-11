pragma solidity ^0.4.24;
import "./CoinBase.sol";

contract YatzyCoinPlasma is CoinBase {

    string public name = "YatzyCoin";
    string public symbol = "YATZ";

    address private _owner;

    // Transfer Gateway contract address
    address public gateway;
    
    constructor(address gatewayAddress) CoinBase(0) public {
        _owner = msg.sender;
        gateway = gatewayAddress;
    }

    // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
    function mintToGateway(uint256 amount) public {
        require(msg.sender == gateway, "Only the gateway is allowed to mint");
        mintAmount(gateway, amount);
    }

    //remove in production
    function destroy() external {
       require (msg.sender == _owner);
       selfdestruct(_owner);
    }
    
    //Fallback - return any abstract transfers to sender 
    function () external payable { msg.sender.transfer(msg.value); }
}