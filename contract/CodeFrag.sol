pragma solidity >=0.4.25 <0.6.0;

contract CodeFrag {
    address prevContract;
    string codeFrag;
    constructor (address _prevContract, string memory _codeFrag) public {
        prevContract = _prevContract;
        codeFrag = _codeFrag;
    }

    function getCodeFragment () public view returns(address, string memory) {
        return (prevContract, codeFrag);
    }
}