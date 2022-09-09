import React, { useState, useEffect } from "react";
import CryptoKoffeeContract from "../../contracts/CryptoKoffee.json";
import getWeb3 from "web3";

const Web3ProviderConnect = async () => {
//  const connectToProvider = async () => {
    console.log("Connect to provider clicked!!");
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CryptoKoffeeContract.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        CryptoKoffeeContract.abi,
        deployedNetwork && deployedNetwork.address
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
//   };
//   return connectToProvider;
};

export default Web3ProviderConnect;
