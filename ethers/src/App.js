import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
import { ethers, BrowserProvider , Contract } from "ethers";
import daobuilderABI from "./build/contracts/Daobuilder.json" 
import AdminsComponent from './AdminsComponent';




function App() {
  var signer = null;
  var provider = null;
  const [contract , setContract] = useState(null);
  const [walletaddress,setWalletaddress] = useState(null);
  const [etheraccount,setEtheraccount] = useState(null);
  const [weiaccount,setWeiaccount] = useState(null);
  const [gweiaccount,setGweiaccount] = useState(null);
  const [blocknumber,setBlocknumber] = useState(null);
  const [balance,setBalance] = useState(null);
  const [tranactioncount,setTranactioncount] = useState(null);
  const [reciept , setReciept] = useState(null);
  const [signerGlob , setSignerGlob] = useState(null);

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

  const sendtransaction = async ()=>{
    let tx = await signerGlob.sendTransaction({
      to: "0x06505D3D1760DE7368860380e03edf5a2CA88D69",
      value: ethers.parseEther("1.0")
    });
    
    // Often you may wish to wait until the transaction is mined
    let receipttmp = await tx.wait();
    setReciept(receipttmp);
  };
  const initcontract = async ()=>{
    // console.log("ABI Type:", typeof daobuilderABI);
    let contracttmp = new Contract("0x99d876895A758AA3f92EcC899490Be888840e7F0",daobuilderABI.abi,provider);
    setContract(contracttmp);
  };

  useEffect(()=>async function(){
    if(window.ethereum==null){
      provider = new ethers.JsonRpcProvider('http://localhost:7545');
    
    }else{
      provider = new ethers.BrowserProvider(window.ethereum);
      
      
    }
    signer = await provider.getSigner();
    // console.log(signer);
    setSignerGlob(signer);
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
    await initcontract();
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


      <button onClick={async ()=>{await sendtransaction()}}>send the transaction</button>
      <div>{reciept}</div>


      {contract && <AdminsComponent contract={contract}/>}
    </div>
  );
}

export default App;
