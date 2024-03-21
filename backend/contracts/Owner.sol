// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Owner {
    // Initial state variables
    string public name;
    address public ownerAddress;
    
    constructor(string memory _name) {
        name = _name;
        ownerAddress = msg.sender;
    }

    // Used for zero address check
    error zeroAddress(address errorAddress);

    // Ensures only owner can have permission
    modifier onlyOwner {
        require(msg.sender == ownerAddress, "Not owner.");
        _;
    }

    function getName() public onlyOwner view returns(string memory) {
        return name;
    }

    function setName(string memory _name) public onlyOwner {
        name = _name;
    }

    function getAddress() public onlyOwner view returns(address) {
        return ownerAddress;
    }

    function setAddress(address _ownerAddress) public onlyOwner{
        ownerAddress = _ownerAddress;
    }
}