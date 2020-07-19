pragma solidity >=0.4.25 <0.6.0;


contract EnrollDomain {
    address payable owner;

    event ReqEnrollDomain(string domain, address user, uint256 value);

    constructor() public {
        owner = msg.sender;
    }

    function reqEnrollDomain(string memory domain) public payable {
        emit ReqEnrollDomain(domain, msg.sender, msg.value);
    }

    event ReqEnrollPath(
        string domain,
        string path,
        address targetAddr,
        string targetType,
        address user
    );

    function reqEnrollPath(
        string memory domain,
        string memory path,
        address targetAddr,
        string memory targetType
    ) public {
        emit ReqEnrollPath(domain, path, targetAddr, targetType, msg.sender);
    }

    function withdraw(uint256 value) public payable {
        require(address(msg.sender) == address(owner), "Not owner");
        owner.transfer(value);
    }

    function refund(uint256 value, address payable user) public payable {
        require(address(msg.sender) == address(owner), "Not owner");
        user.transfer(value);
    }
}
