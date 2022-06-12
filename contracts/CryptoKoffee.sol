// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract CryptoKoffee {
    address public owner;

    struct Payment{
        uint amount;
        uint timeStamp;
    }

    struct WalletInfo{
        string name;
        string link;
        address walletAddress;
    }

    struct Balance {
        uint totalBalance;
        uint numPayments;
        mapping(uint => Payment) payments;
    }

    // Track donations made to project
    mapping(address => Payment) public donations;
    mapping(address => Balance) public balanceReceived;
    mapping(address => WalletInfo) public walletMapping;

    // Emit events 
    event DonationEvent(uint _amount, address doner, uint timeStamp);
    event WalletInfoEvent(string  name, string  link, address walletAddress);

    // Set project Name and Target amout when smart contract is being deployed.
    constructor (){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    
    // Create wallet
    function createWallet(string memory _name, string memory _link) public {
        WalletInfo memory _wallet = WalletInfo(_name, _link, msg.sender);
        walletMapping[msg.sender] = _wallet;
        emit WalletInfoEvent(_name, _link, msg.sender);
    }
    
    function getWallet() public returns(string memory name, string memory link, address walletAddress) {
        name = walletMapping[msg.sender].name;
        link = walletMapping[msg.sender].link;
        walletAddress = walletMapping[msg.sender].walletAddress;
        // Emit events after getting wallet info data
        emit WalletInfoEvent(name, link, walletAddress);
        return (name, link,walletAddress);
    }

    // Donate function
    function donate() public payable {
        balanceReceived[msg.sender].totalBalance += msg.value;
        Payment memory payment = Payment(msg.value, block.timestamp);
        balanceReceived[msg.sender].payments[balanceReceived[msg.sender].numPayments] = payment;
        balanceReceived[msg.sender].numPayments++;
        emit DonationEvent(msg.value, msg.sender, block.timestamp);
    }

    // Get donation balance from contract
    function getDonationBalance() public view returns(uint){
        return address(this).balance;
    }

    // Release funds from contract to project
    function releaseFunds(address payable _to, uint _amount) onlyOwner public payable {
        uint _balance = balanceReceived[msg.sender].totalBalance;
        require(_balance > 0, "You don't have enough tokens for withdrawal");
        _to.transfer(_amount);
        emit DonationEvent(_amount, _to, block.timestamp);

    }
}
