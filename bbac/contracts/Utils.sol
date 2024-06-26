// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Debugging purposes
// import "hardhat/console.sol";

library permissionMap {

    struct access {
        // string attributeIndex;
        string attribute;
        uint start;                                 // Always use block.timestamp as initial creation time
        uint end;                                   // No time restriction = 0
    }
    

    struct resourceMap {
        mapping(string => access) resources;
        mapping(uint => string) keyIndex;
        uint size;
    }

    function compareString(resourceMap storage self, string memory s1, string memory s2) internal pure returns(bool) {
        return (keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2)));
    }

    function getAccessKey(resourceMap storage self, uint key) internal view returns(string memory) {
        require(key <= self.size && key > 0, "Key value does not exists.");
        return self.keyIndex[key];
    }

    function getAccessObject(resourceMap storage self, string memory accessKey) internal view returns(access memory) {
        return self.resources[accessKey];
    }

    function containsAccessKey(resourceMap storage self, uint key, string memory accessKey) internal view returns(bool) {
        return compareString(self, self.keyIndex[key], accessKey);
    }

    function getAllKeyIndex(resourceMap storage self) internal view returns(uint[] memory) {
        uint[] memory result = new uint[](self.size);
        if (self.size == 0) {
            return result;
        }
        for (uint i = 1; i <= self.size; i++) {
            // Array starts from 0
            result[i - 1] = i;
        }
        return result;
    }

    function getAllKeyIndexValue(resourceMap storage self) internal view returns(string[] memory) {
        uint[] memory allKeys = getAllKeyIndex(self);
        string[] memory allValues = new string[](self.size);
        for (uint i = 1; i <= self.size; i++) {
            allValues[i - 1] = self.keyIndex[allKeys[i - 1]];
        }
        return allValues;
    }

    function length(resourceMap storage self) internal view returns(uint) {
        return self.size;
    } 

    function insert(resourceMap storage self, string memory key, access memory value) internal {
        require( bytes(key).length > 0, "Key must not be empty.");
        self.size++;
        self.keyIndex[self.size] = key;
        // Check to see if start time is uninitialised
        if (value.start == 0 || value.start < block.timestamp) {
            value.start = block.timestamp;
        }
        self.resources[key] = value;
    }

    function remove(resourceMap storage self, uint key, string memory accessKey) internal {
        // require(contains(self, key), "Key does not exist in contract.");
        delete self.keyIndex[key];
        delete self.resources[accessKey];
        for (uint i = key; i <= self.size; i++) {
            if (i == self.size) {
                delete self.keyIndex[i];
                break;
            }
            self.keyIndex[i] = self.keyIndex[i+1];
        }
        self.size--;
    }

    function nuke(resourceMap storage self) internal {
        for (uint i = 1; i <= self.size; i++) {
            string memory aKey = getAccessKey(self, i);
            delete self.resources[aKey];
            delete self.keyIndex[i];
        }
        self.size = 0;
    }
}
