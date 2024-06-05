pragma solidity ^0.8.0;

contract InformationRegistry {
    address public admin;
    mapping(address => bool) public authorizedStaff;
    mapping(bytes32 => address) public informationSources;
    
    event InformationRegistered(bytes32 infoHash, address indexed source);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not an admin");
        _;
    }

    modifier onlyAuthorizedStaff() {
        require(authorizedStaff[msg.sender], "Not authorized");
        _;
    }

    function authorizeStaff(address staff) external onlyAdmin {
        authorizedStaff[staff] = true;
    }

    function revokeStaff(address staff) external onlyAdmin {
        authorizedStaff[staff] = false;
    }

    function registerInformation(bytes32 infoHash) external onlyAuthorizedStaff {
        require(informationSources[infoHash] == address(0), "Information already registered");
        informationSources[infoHash] = msg.sender;
        emit InformationRegistered(infoHash, msg.sender);
    }

    function verifyInformation(bytes32 infoHash) external view returns (bool) {
        return informationSources[infoHash] != address(0);
    }
}
