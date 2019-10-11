pragma solidity ^0.4.24;
import './IERC20.sol';
import './IERC223.sol';
import './IERC223Receiver.sol';

contract CoinBase is IERC20, IERC223  {

    uint256 private _totalBalance;
    mapping (address => uint256) private _balance;
    mapping (address => mapping (address => uint256)) private _allowed;
    
    constructor(uint256 initalSupply) public {
        _totalBalance = initalSupply;
        _balance[msg.sender] = initalSupply;
    }

    function totalSupply() public view returns (uint256) { return _totalBalance; }
    function balanceOf(address owner) public view returns (uint256) { return _balance[owner]; }
    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowed[owner][spender]; }

    function approve(address spender, uint256 value) external 
        returns (bool) {
        require(spender != msg.sender && spender != address(0), 'Invalid spender.');
        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function increaseApproved(address spender, uint256 value) external 
        returns (bool) {
        require(spender != msg.sender && spender != address(0), 'Invalid spender.');
        require(_allowed[msg.sender][spender] + value >= _allowed[msg.sender][spender], 
            "Invalid allowance overflow.");
        if (value > 0) _allowed[msg.sender][spender] += value;
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }
    
    function decreaseApproved(address spender, uint256 value) external 
        returns (bool) {
        require(spender != msg.sender && spender != address(0), 'Invalid spender.');
        if (value > 0) _allowed[msg.sender][spender] = 
            (_allowed[msg.sender][spender] <= value) ? 0 :
                _allowed[msg.sender][spender] - value;
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    function transferFrom(address from, address to, uint256 value, bytes data) external 
        returns (bool) {
        return transferAmount(from, to, value, data);
    }

    function transferFrom(address from, address to, uint256 value) external 
        returns (bool) {
        return transferAmount(from, to, value, "");
    }

    function transfer(address to, uint256 value, bytes data) external 
        returns (bool) {
        return transferAmount(msg.sender, to, value, data);
    }

    function transfer(address to, uint256 value) external 
        returns (bool) {
        return transferAmount(msg.sender, to, value, "");
    }

    function burnFrom(address from, uint256 value) external 
        returns (bool) {
        return burnAmount(from, value);
    }

    function burn(uint256 value) external 
        returns (bool) {
        return burnAmount(msg.sender, value);
    }

    function transferAmount(address from, address to, uint256 amount, bytes memory data) internal 
        returns (bool) {
        require(from == msg.sender || _allowed[from][msg.sender] >= amount, 
            "Insufficent allowance.");
        require(_balance[from] >= amount, "Insufficent balance.");
        require(to != from && to != address(0), "Invalid recipient account.");
        require(_balance[to] + amount >= _balance[to], "Invalid recipient overflow.");
        if (amount > 0) {
            if (from != msg.sender) _allowed[from][msg.sender] -= amount;
            _balance[from] -= amount;
            _balance[to] += amount;
        } 
        //ERC223 check if recipient is contract, will revert if contract not IERC223Receiver
        uint256 codeSize;
        assembly { codeSize := extcodesize(to) }
        if(codeSize > 0) {//contract
            IERC223Receiver receiver = IERC223Receiver(to);
            receiver.tokenFallback(from, amount, data);
        }
        emit Transfer(from, to, amount);
        return true;
    }

    function burnAmount(address from, uint256 amount) internal 
        returns (bool) {
        require(from == msg.sender || _allowed[from][msg.sender] >= amount, 
            "Insufficent allowance.");
        require (_balance[from] >= amount, "Insufficent funds.");
        assert(_totalBalance >= amount);
        if (amount > 0) {
            _balance[from] -= amount;
            if (from != msg.sender) _allowed[from][msg.sender] -= amount;
            _totalBalance -= amount;
        }
        emit Transfer(from, address(0), amount);
        return true;
    }

    function mintAmount(address to, uint256 amount) internal 
        returns (bool) {
        require (_totalBalance + amount >= _totalBalance, "Supply overflow");
        assert (_balance[to] + amount >= _balance[to]);
        if (amount > 0) {
            _totalBalance += amount;
            _balance[to] += amount;
        }
        emit Transfer(address(0), to, amount);
        return true;
    }
    
}