// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4.0;

contract CryptoKoffee {
    address public owner;
    uint public totalBalance;
    uint public totalNumberOfDonations;

    struct Payment{
        uint amount;
        uint timeStamp;
        address sender;
        address receipient;
        string description;
    }

    struct WalletInfo{
        bytes32 name;
        bytes32 link;
        address walletAddress;
        uint currentBalance;
        uint numOfDonations;
    }

    // Track Payments
    mapping(address => Payment) public payments;
    // mapping(address => Balance) public balanceReceived;
    mapping(address => WalletInfo) private walletMapping;

    // Emit events 
    event DonationEvent(uint _amount, address doner, uint timeStamp);
    event WalletInfoEvent(bytes32  name, bytes32  link, address walletAddress, uint currentWalletBalance, uint numOfDonations);
    event PaymentEvent(uint amount, uint timeStamp,address sender, address receipient, string description);
    
    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You are not the owner");
        _;
    }
    
    // Validates that the amount to transfer is not zero.
    modifier validateTransferAmount() {
        require(msg.value > 0, "Transfer amount has to be greater than 0.");
        _;
    }

    modifier validateWalletOwner(address ownerAddress) {
        require(walletMapping[ownerAddress].walletAddress == msg.sender, "Only Wallet owner can perform this activity.");
        _;
    }

    // Validates that the amount to transfer is not zero.
    modifier validateReciepientAddress(address receipientAddress) {
        require(walletMapping[receipientAddress].walletAddress != 0x0000000000000000000000000000000000000000, "Your address is not registered on CryptoKoffee.");
        _;
    }

    modifier validateIfWalletExists(address senderAddress) {
        require(walletMapping[senderAddress].walletAddress != msg.sender, "A wallet is already associated to this address.");
        _;
    }

    modifier validateReciepientBalance(address receipientAddress) {
        require(walletMapping[receipientAddress].currentBalance > 0, "You don't have enough balance to withdraw.");
        _;
    }

    function hash(string memory _string) public pure returns(bytes32) {
     return keccak256(abi.encodePacked(_string));
    }

    /** Create wallet 
        Needs the connected wallet address 9900826
        **remember to hash the _name and _link before sending to chain 8929eth
    **/
    function createWallet(string memory _name, string memory _link) validateIfWalletExists(msg.sender) public {
        bytes32 hashName = hash(_name);
        bytes32 hashLink = hash(_link);
        WalletInfo memory _wallet = WalletInfo(hashName, hashLink, msg.sender, 0, 0);
        walletMapping[msg.sender] = _wallet;
        emit WalletInfoEvent(hashName, hashLink, msg.sender, 0, 0);
    }
    
    function getWallet() public returns(bytes32 name, bytes32 link, address walletAddress, uint walletBalance, uint numOfDonations) {
        name = walletMapping[msg.sender].name;
        link = walletMapping[msg.sender].link;
        walletAddress = walletMapping[msg.sender].walletAddress;
        walletBalance = walletMapping[msg.sender].currentBalance;
        numOfDonations = walletMapping[msg.sender].numOfDonations;
        // Emit events after getting wallet info data
        emit WalletInfoEvent(name, link, walletAddress, walletBalance, numOfDonations);
        return (name, link, walletAddress, walletBalance, numOfDonations);
    }

    /** Donate function
     [ Needs a wallet to make the donations to. ] 
     check if donation address has wallet associated with it.
    **/
    function donate(address donationAddress ) public payable validateReciepientAddress(donationAddress) validateTransferAmount {
        uint _amount = msg.value;
        totalBalance += _amount;
        Payment memory payment = Payment(_amount, block.timestamp, msg.sender, donationAddress, "donation");
        payments[msg.sender] = payment;
        totalNumberOfDonations++;
        walletMapping[donationAddress].currentBalance += _amount;
        walletMapping[donationAddress].numOfDonations += 1;
        emit DonationEvent(_amount, donationAddress, block.timestamp);
        emit PaymentEvent(_amount, block.timestamp, msg.sender, donationAddress, "donation");
    }

    // Get donation balance from contract
    function getDonationBalance() public view returns(uint){
        return address(this).balance;
    }

    // Release funds from contract to project 
    function withdrawFunds(address payable _to, uint _amount) 
    validateWalletOwner(msg.sender) validateReciepientAddress(_to) 
    validateReciepientBalance(_to) 
    public payable {
        require(walletMapping[_to].currentBalance >= _amount, "You can't withdraw more than you have in your wallet!");
        walletMapping[_to].currentBalance -= _amount;
        totalBalance -= _amount;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        _to.transfer(_amount);
        emit PaymentEvent(_amount, block.timestamp, msg.sender, _to, "withdraw");
    }
}
