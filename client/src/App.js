import React, { Component } from "react";
import CryptoKoffeeContract from "./contracts/CryptoKoffee.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { walletInfo: {name: "", link: "", walletAddress: "", walletBalance: "", numOfDonations: ""}, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CryptoKoffeeContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CryptoKoffeeContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.createWallet("walletName", "Link").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getWallet().call();

    // Update state with the result.
    console.log(response)
    this.setState({ walletInfo: {name: response.name, link: response.link, 
      walletAddress: response.walletAddress, walletBalance: response.walletBalance.valueOf(), 
      numOfDonations: response.numOfDonations} });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Yeeaayy CryptoKoffee is Here!</h1>
        <p>Your wallet has been created and ready to accept donations.</p>
       
        <p>
        <h2>Wallet created details</h2>
        </p>
        <div>Wallet Identifier: {this.state.walletInfo.name}</div>
        <div>Wallet Link hashed: {this.state.walletInfo.link}</div>
        <div>Wallet Address: {this.state.walletInfo.walletAddress}</div>
        <div>Donation Balance: {this.state.walletInfo.walletBalance}</div>
        <div>Number of Donations: {this.state.walletInfo.numOfDonations}</div>
      </div>
    );
  }
}

export default App;
