import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [infoHash, setInfoHash] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    const loadBlockchainData = async () => {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);

      const abi = [ /* ABI from compiled contract */ ];
      const address = '0x...'; // Deployed contract address
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
    };

    loadWeb3();
    loadBlockchainData();
  }, []);

  const registerInformation = async () => {
    try {
      await contract.methods.registerInformation(Web3.utils.sha3(infoHash)).send({ from: account });
      alert('Information registered successfully!');
    } catch (error) {
      console.error("Error registering information: ", error);
      alert('Error registering information. Make sure you are an authorized staff.');
    }
  };

  const verifyInformation = async () => {
    try {
      const result = await contract.methods.verifyInformation(Web3.utils.sha3(infoHash)).call();
      setIsRegistered(result);
    } catch (error) {
      console.error("Error verifying information: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Information Registry</h1>
      <p>Your account: {account}</p>
      
      <div>
        <input 
          type="text" 
          placeholder="Enter information hash" 
          value={infoHash}
          onChange={(e) => setInfoHash(e.target.value)} 
        />
        <button onClick={registerInformation}>Register Information</button>
        <button onClick={verifyInformation}>Verify Information</button>
      </div>

      {isRegistered && <p>Information is registered.</p>}
      {!isRegistered && <p>Information is not registered.</p>}
    </div>
  );
};

export default App;
