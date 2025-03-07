import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { ethers, BrowserProvider } from "ethers";




function App() {
  let signer = null;
  let provider = null;
  const [walletaddress,setWalletaddress] = useState(null);
  const [etheraccount,setEtheraccount] = useState(null);
  const [weiaccount,setWeiaccount] = useState(null);
  const [gweiaccount,setGweiaccount] = useState(null);
  const [blocknumber,setBlocknumber] = useState(null);
  const [balance,setBalance] = useState(null);
  const [tranactioncount,setTranactioncount] = useState(null);

  const getConnectedAccount = async ()=>{
    const accounts = await provider.send("eth_requestAccounts", []);
    setWalletaddress(accounts[0]); // Get the first account
    await getBalances(accounts[0]);
  };

  const setEthValues = async ()=>{
    setEtheraccount(ethers.parseEther("2.0"));
    setGweiaccount(ethers.parseUnits("6.5",'gwei'));
    setWeiaccount(ethers.parseUnits("4",'wei'));
  };
  const getBalances= async (account)=>{
    if(account){
      setBalance( ethers.formatEther(await provider.getBalance(account)));
      setTranactioncount(await provider.getTransactionCount(account));
    }
  };

  useEffect(()=>async function(){
    if(window.ethereum==null){
      provider = new ethers.JsonRpcProvider('http://localhost:7545');
    
    }else{
      provider = new ethers.BrowserProvider(window.ethereum);
      
      
    }
    signer = await provider.getSigner();
    setBlocknumber(await provider.getBlockNumber());
    await getConnectedAccount();

    window.ethereum.on("accountsChanged",async (accounts) => {
      if (accounts.length > 0) {
        setWalletaddress(accounts[0]); // Update account if still connected
        await getBalances(accounts[0]);
      } else {
        setWalletaddress(null); // Reset if disconnected
      }
    });
    await setEthValues();
    await getBalances();
  },[])
  
  return (
    <div className="App">
      Your Wallet Address: {walletaddress}
      <br/>
      Ether: {etheraccount}<br/>
      gwei: {gweiaccount}<br/>
      wei: {weiaccount}<br/>
      blocknumber: {blocknumber}<br/>
      balace: {balance}<br/>
      tranactioncount: {tranactioncount}<br/>
    </div>
  );
}

export default App;
