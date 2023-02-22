import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, resolveOrReturn, handleEthers, isOwner, nameStatusTool, pureOwner } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Wrap = () =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('');
    const [nameStatus, setNameStatus] = createSignal('');
    const [showModal, setShowModal] = createSignal(false);
    const [modalType, setModalType] = createSignal('nothisstart');
    const [modalName, setModalName] = createSignal('Lorem ipsum');
    const [modalOwner, setModalOwner] = createSignal('Lorem ipsum');
    const [modalSignature, setModalSignature] = createSignal('Lorem ipsum');
    const [modalMessage, setModalMessage] = createSignal('Lorem ipsum');
    const [newStatus, setNewStatus] = createSignal();
    const { store, setStore } = useGlobalContext();
    const oops = <>Oops something went wrong</>;

    const setModal = (message, type) => {
      const prev = store()
      var toSet = {modal:{status: true, message: message, type: type}}
      setStore({...prev, ...toSet});
  }
  

    async function createWrapper(){
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      console.log("is va", isValid, currentName)
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(setModal(message, "format"))
      }
      var walletAddress = await og.signer.getAddress();
      var checked = await isOwner(walletAddress, currentName)
      console.log("checked is", checked)
      if(checked == false){
        var message = <>You do not own {currentName}</>
        return(setModal(message, "warning"))
      }
      if(checked){
        var tx = await og.lnr.createWrapper(name());
        tx.wait().then(async (receipt) => {
   
          if (receipt && receipt.status == 1) {
        var message = <>Wrapper created for <a href={`https://etherscan.io/tx/${tx}`} target="_blank"> {currentName}</a></>;
        setModal(message, "success")
        setNewStatus("waiting")
        return(await transferToWrapper());
          }
          else{
            return(setModal(oops, "warning"))
          }
       })
      }
      else{
        return(setModal(oops, "warning"))
      }
      return
    }
  
    async function transferToWrapper(){
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(setModal(message, "warning"))
      }
      var walletAddress = await og.signer.getAddress();
      var checked = await isOwner(walletAddress, currentName)
      console.log("CH#ECX", checked)
      if(checked == false){
        var message = <>You do not own {currentName}</>
        return(setModal(message, "warning"))
      }
      var waiting = await og.lnr.waitForWrap(name());
      console.log("waiting", waiting)
      if(waiting !== walletAddress){
        var message = <>Wrapper not created for {currentName}</>
        return(setModal(message, "warning"))
      }
      if(checked && waiting == walletAddress){
        console.log("transfer", name().bytes)
        var tx = await og.lnr.linageeContract.transfer(store().domain.bytes, "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7");
        tx.wait().then(async (receipt) => {
         
          if (receipt && receipt.status == 1) {
            var message = <>{currentName} transferred to <a href={`https://etherscan.io/tx/${tx}`} target="_blank"> wrapper</a></>;
            setModal(message, "success")
            setNewStatus("transferred")
            return(await wrapName());
          }
          else{
            var message = <>Oops something went wrong</>;
            return(setModal(oops, "warning"))
          }
       })
      }
      else{
        var message = <>Oops something went wrong</>;
        return(setModal(oops, "warning"))
      }
      return
    }
  
    async function wrapName(){
      const currentName = name();
      const curBytes = store().domain.bytes;
      var walletAddress = await og.signer.getAddress();
      console.log("status us", newStatus())

      if(newStatus() == "transferred"){
        console.log("trying to wrap")
        var tx2 = await og.lnr.wrapperContract.wrap(curBytes);
        tx2.wait().then(async (receipt) => {
        
          if (receipt && receipt.status == 1) {
            var message = <>{currentName} wrapped! <a href={`https://etherscan.io/tx/${tx2}`} target="_blank"> View on Etherscan</a></>;
            setModal(message, "success")
            setNewStatus("wrapped")
            return(signature);
          }
          else{
            return(setModal(oops, "warning"))
          }
       })
      }
      else{
        return(setModal(oops, "warning"))
      }
      return
    }

    async function unwrapName(){
      const currentName = name();
      var walletAddress = await og.signer.getAddress();
      var isValid = await og.lnr.isValidDomain(currentName);
      var checked = await isOwner(walletAddress, currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(setModal(message, "format"))
      }
      if(checked == false){
        return(setModal(oops, "warning"))
      }
      if(checked && newStatus()== "wrapped"){
        var tx = await og.lnr.wrap(currentName);
        tx.wait().then(async (receipt) => {
   
          if (receipt && receipt.status == 1) {
            var message = <>{currentName} unwrapped! <a href={`https://etherscan.io/tx/${tx}`} target="_blank"> View on Etherscan</a></>;
            setModal(message, "success")
            setNewStatus("unwrapped")
            return(signature);
          }
          else{
            return(setModal(oops, "warning"))
          }
       })
      }
      else{
        return(setModal(oops, "warning"))
      }
      return
    }

    onMount(async () => {
      setName(store().domain.name);
      setNameStatus(store().domain.status)
      console.log("hm status ", store().domain.status)
      await status();
      console.log("new status is", newStatus())
      
    });

    const status = async()=>{
      var isValid = await og.lnr.isValidDomain(name());
      if(!isValid){
        return
      }
      var st = await nameStatusTool(name());
      console.log("st is", st)
      var waiting = await og.lnr.waitForWrap(name());
      console.log("waiting", waiting)
      var pure = await pureOwner(store().domain.bytes)
      console.log("pure is", pure)
      if(pure == store().userAddress && waiting !== store().userAddress){
        setNewStatus("unwrapped")
      }
      else if(pure == store().userAddress && waiting == store().userAddress){
        setNewStatus("waiting")
      }
      else if(pure == "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7" && waiting == store().userAddress){
        setNewStatus("transferred")
      }
      else if(st && st[1] == "wrapped" && st[0] == store().userAddress){
        setNewStatus("wrapped")
      }
    }



  
  
    return(

          <div class="block has-text-centered">
              <h4 class="title is-3 has-text-light">{name}</h4>
              <Switch >
                  <Match when={(newStatus() == "unwrapped")}><button class="button tagCount" onClick={createWrapper}>Create Wrapper</button></Match>
                  <Match when={(newStatus() == "waiting")}><button class="button tagCount" onClick={transferToWrapper}>Transfer to Wrapper</button></Match>
                  <Match when={(newStatus() == "transferred")}><button class="button tagCount" onClick={wrapName}>Wrap</button></Match>
                  <Match when={(name().status == "wrapped"|| newStatus() == "wrapped")}><button class="button tagCount" onClick={unwrapName}>Unwrap</button></Match>
              </Switch>
          </div>

    )
  }
  
  

export default Wrap;