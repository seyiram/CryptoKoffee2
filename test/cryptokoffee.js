const CryptoKoffee = artifacts.require("CryptoKoffee");

contract("CryptoKoffee", (accounts) => {
  let cryptoKoffeeInstance = null;
  before(async () => {
    cryptoKoffeeInstance = await CryptoKoffee.deployed();
  });

  it("...should call the hash function.", async () => {
    // Set value of wallet information
    await cryptoKoffeeInstance.hash("hash", { from: accounts[0] });

    // Get the value of wallet information
    const storedHash = await cryptoKoffeeInstance.hash("hash", {
      from: accounts[0],
    });

    // Hash function should be converted to byte32
    assert.equal(
      storedHash,
      "0x33027547537d35728a741470df1ccf65de10b454ca0def7c5c20b257b7b8d161"
    );
  });

  it("...should create a new wallet info.", async () => {
    // Set value of wallet information
    await cryptoKoffeeInstance.createWallet({ from: accounts[0] });

    // Return the values of wallet information stored
    const walletData = await cryptoKoffeeInstance.getWallet.call();

    assert.equal(
      walletData.walletAddress,
      "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
    );
    assert.equal(walletData.walletBalance.toNumber(), 0);
    assert.equal(walletData.numOfDonations.toNumber(), 0);
  });

  it("...should fail when wallet already exists", async () => {
    try {
      // Try creating another wallet
      await cryptoKoffeeInstance.createWallet({ from: accounts[0] });
      assert.fail("A wallet is already associated to this address");
    } catch (err) {
      assert.include(
        err.message,
        "A wallet is already associated to this address"
      );
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  it("...should donate to a wallet with valid amount.", async () => {
    // Set value of wallet information
    await cryptoKoffeeInstance.donate(accounts[0], {
      from: accounts[1],
      value: 2000000000000000000,
    });

    // Grab the wallet which received the donation
    const walletData = await cryptoKoffeeInstance.getWallet.call({
      from: accounts[0],
    });
    const totalNumOfDonations =
      await cryptoKoffeeInstance.totalNumberOfDonations();

    // Then assert that the donation was made

    assert.equal(
      walletData.walletAddress,
      "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
    );
    assert.equal(walletData.walletBalance.valueOf(), 2000000000000000000);
    assert.equal(walletData.numOfDonations.toNumber(), 1);
    assert.equal(totalNumOfDonations, 1);
  });

  it("...should fail when donate to a wallet with an invalid amount.", async () => {
    try {
      // Set value of wallet information
      await cryptoKoffeeInstance.donate(accounts[0], {
        from: accounts[1],
        value: 0,
      });
      assert.fail("Transfer amount has to be greater than 0.");
    } catch (err) {
      assert.include(err.message, "Transfer amount has to be greater than 0.");
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  it("...should fail when donate to an invalid wallet address", async () => {
    try {
      // Call donate function and provide invalid address
      await cryptoKoffeeInstance.donate(
        "0x0000000000000000000000000000000000000000",
        { from: accounts[1], value: 2000000000000000000 }
      );
      assert.fail("Your address is not registered on CryptoKoffee.");
    } catch (err) {
      assert.include(
        err.message,
        "Your address is not registered on CryptoKoffee."
      );
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  it("...should return the total donations received in the smart contract.", async () => {
    // Call the get donation balance function
    const contractBalance = await cryptoKoffeeInstance.getDonationBalance();

    // Then assert that the total balance is up to the donations made
    assert.equal(contractBalance.valueOf(), 2000000000000000000);
  });

  it("...should withdraw funds into a provided wallet address(my wallet).", async () => {
    // Call the withdraw function
    await cryptoKoffeeInstance.withdrawFunds(
      accounts[0],
      "1000000000000000000",
      { from: accounts[0] }
    );

    // Grab the wallet which the withdrawal was made from
    const walletData = await cryptoKoffeeInstance.getWallet.call({
      from: accounts[0],
    });

    // Call the get donation balance function
    const contractBalance = await cryptoKoffeeInstance.getDonationBalance();

    // Then assert that the total contract balance reduces after withdrawal is made
    assert.equal(contractBalance.valueOf(), 1000000000000000000);

    // Then assert that the wallet balance is reduced after withdraw
    assert.equal(walletData.walletBalance.valueOf(), 1000000000000000000);
  });

  it("...should fail if someone else other than the wallet owner calls the withdraw function", async () => {
    try {
      // Call withdraw function by another wallet user
      await cryptoKoffeeInstance.withdrawFunds(
        accounts[0],
        "1000000000000000000",
        { from: accounts[1] }
      );
      assert.fail("Only Wallet owner can perform this activity.");
    } catch (err) {
      assert.include(
        err.message,
        "Only Wallet owner can perform this activity."
      );
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  it("...should fail if withdraw Funds is called on invalid wallet address", async () => {
    try {
      // Call withdrawFunds function and provide invalid address
      await cryptoKoffeeInstance.withdrawFunds(
        "0x0000000000000000000000000000000000000000",
        "1000000000000000000",
        { from: accounts[0] }
      );
      assert.fail("Your address is not registered on CryptoKoffee.");
    } catch (err) {
      assert.include(
        err.message,
        "Your address is not registered on CryptoKoffee."
      );
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });

  it("...should fail if funds to be withdrawn if more than funds in wallet", async () => {
    try {
      // Call withdrawFunds function and provide amount more than you have in your wallet
      await cryptoKoffeeInstance.withdrawFunds(
        accounts[0],
        "4000000000000000000",
        { from: accounts[0] }
      );
      assert.fail("You can't withdraw more than you have in your wallet!");
    } catch (err) {
      assert.include(
        err.message,
        "You can't withdraw more than you have in your wallet!"
      );
      assert.include(
        err.message,
        "revert",
        "The error message should contain 'revert'"
      );
    }
  });
});
