import { Routes, Route } from 'react-router-dom';
import Web3Modal from "web3modal";
import Web3 from "web3";
import "./App.css";

import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3ProviderConnect from "./contexts/Web3ProviderContext/Web3ProviderConnect";
import CryptoKoffeeContract from "./contracts/CryptoKoffee.json";

import Navbar from 'components/Navbar/Navbar';
import Homepage from 'pages/Homepage/Homepage';
import Dashboard from "./pages/Dashboard/Dashboard";
import About from 'pages/About/About';

function App() {
  const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "INFURA_ID" // required
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "My Awesome App", // Required
        infuraId: "INFURA_ID", // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 1, // Optional. It defaults to 1 if not provided
        darkMode: false // Optional. Use dark theme, defaults to false
      }
    }
  };

  const web3Modal = new Web3Modal({
    network: "testnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });


  const connectToWallet = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    console.log(await web3.eth.getAccounts())

  };

  return (
    <div className="bg-gray-100 w-full h-full">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/about-us" element={<About />} />
        <Route exact path="dashboard/*" element={<Dashboard connectToWallet={connectToWallet} />} />
      </Routes>

    </div>
  );
}

export default App;
