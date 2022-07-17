const CryptoKoffee = artifacts.require("CryptoKoffee");

contract("CryptoKoffee", accounts => {
    let cryptoKoffeeInstance = null
    before(async() =>{
        cryptoKoffeeInstance = await CryptoKoffee.deployed();
    })
    
    it("...should call the hash function.", async () => {
    
        // Set value of wallet information
        await cryptoKoffeeInstance.hash("hash", { from: accounts[0] });
    
        // Get the value of wallet information
        const storedHash = await cryptoKoffeeInstance.hash("hash", { from: accounts[0] });

        // Hash function should be converted to byte32
        assert.equal(storedHash, "0x33027547537d35728a741470df1ccf65de10b454ca0def7c5c20b257b7b8d161");
      });

    it("...should create a new wallet info.", async () => {  
        // hash the wallet name and link
        const hashName = await cryptoKoffeeInstance.hash("walletName")
        const hashLink = await cryptoKoffeeInstance.hash("projectLink")

        // Set value of wallet information
        await cryptoKoffeeInstance.createWallet(hashName, hashLink, { from: accounts[0] });
  
        // Return the values of wallet information stored
        const walletData = await cryptoKoffeeInstance.getWallet.call();
        assert.equal(walletData.name, "0x5c4060ec36e6ba2f35331bc3ec4e78bc60453964c1809704706b1326932f3bf6");
        assert.equal(walletData.link, "0x98e2ad7432c52956fab2e46a2c98bbd0397105486c4f117310d944419cd704f3");
        assert.equal(walletData.walletAddress, "0x627306090abaB3A6e1400e9345bC60c78a8BEf57");
        assert.equal(walletData.walletBalance.toNumber(), 0);
        assert.equal(walletData.numOfDonations.toNumber(), 0);
    });

    it("...should donate to a wallet.", async () => {  
    
        // Set value of wallet information
        await cryptoKoffeeInstance.donate(accounts[0], { from: accounts[1], value: 2000000000000000000  });
  
        // Grab the wallet which received the donation 
        const walletData = await cryptoKoffeeInstance.getWallet.call({ from: accounts[0]  });
        const totalNumOfDonations = await cryptoKoffeeInstance.totalNumberOfDonations();
        console.log(walletData.numOfDonations.toNumber())
        // Then assert that the donation was made
        assert.equal(walletData.name, "0x5c4060ec36e6ba2f35331bc3ec4e78bc60453964c1809704706b1326932f3bf6");
        assert.equal(walletData.link, "0x98e2ad7432c52956fab2e46a2c98bbd0397105486c4f117310d944419cd704f3");
        assert.equal(walletData.walletAddress, "0x627306090abaB3A6e1400e9345bC60c78a8BEf57");
        assert.equal(walletData.walletBalance.valueOf(), 2000000000000000000);
        assert.equal(walletData.numOfDonations.toNumber(), 1);
        assert.equal(totalNumOfDonations, 1);
    });
// Test account receiveing donations without wallet registering
// Function to prevent multiple wallet with same address
// Test if donation is 0
// Test withdraw by owner only
// Test if not onwer withdrawing.
  });
