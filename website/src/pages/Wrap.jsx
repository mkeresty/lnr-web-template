import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, resolveOrReturn, handleEthers, isOwner, nameStatusTool, pureOwner, getCurrentNameStatus } from '../utils/nameUtils';
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
    const oops = <>Oops something went wrong</>;
    const { store, setStore } = useGlobalContext();

    const setModal = (message, type) => {
      setLoading(false)
      const prev = store()
      var toSet = {modal:{status: true, message: message, type: type}}
      setStore({...prev, ...toSet});
  }

    const setLoading = (bool) => {
      const prev = store()
      var toSet = {isLoading: bool}
      setStore({...prev, ...toSet});
  }

  const updateNameData = async()=>{
    if(store() && store().domain && store().domain.name){
      var stat = await getCurrentNameStatus(store().domain.name, store().domain.bytes)
      if(stat){
        const prev = store()
        var merged = {...(prev.domain), ...stat};
        var toSet = {domain: merged}
        setStore({...prev, ...toSet});
        return(setLoading(false))
      }
    }
    return(setRouteTo("Home"))
  }


    async function createWrapper(){
      setLoading(true);
      if(store().domain.isValid !== true){
        var message = <>{store().domain.name} - not normalized</>
        return(setModal(message, "format"))
      }
      if(store().domain.owner !== store().userAddress){
        var message = <>You do not own {store().domain.name}</>
        return(setModal(message, "warning"))
      }
      if(store().domain.status == "unwrapped"){
        try{
          var tx = await og.lnr.createWrapper(store().domain.name);
          tx.wait().then(async (receipt) => {
              if(receipt && receipt.status == 1) {
                var message = <>Wrapper created for <a href={`https://etherscan.io/tx/${tx}`} target="_blank"> {store().domain.name}</a></>;
                await updateNameData();
                setModal(message, "success");
                await transferToWrapper()
                return
              }
              if(receipt && receipt.status == 0){
                  return(setModal(oops, "warning"))
              }
          });
          } catch(e){
            return(setModal(oops, "warning"))
          }
    } else{
      return(setModal(oops, "warning"))
    }
  }
  
    async function transferToWrapper(){
      setLoading(true);
      if(store().domain.isValid !== true){
        var message = <>{store().domain.name} - not normalized</>
        return(setModal(message, "format"))
      }
      if(store().domain.owner !== store().userAddress){
        var message = <>You do not own {store().domain.name}</>
        return(setModal(message, "warning"))
      }
      if(store().domain.status !== "waiting"){
        var message = <>Wrapper not created for {store().domain.name}</>
        return(setModal(message, "warning"))
      }
      if(store().domain.status == "waiting"){

        try{
          var tx = await og.lnr.linageeContract.transfer(store().domain.bytes, "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7");
          tx.wait().then(async (receipt) => {
              if(receipt && receipt.status == 1) {
                var message = <>{store().domain.name} transferred to <a href={`https://etherscan.io/tx/${tx}`} target="_blank">wrapper</a></>;
                await updateNameData();
                setModal(message, "success");
                await wrapName();
                return
              }
              if(receipt && receipt.status == 0){
                  return(setModal(oops, "warning"))
              }
          });
          } catch(e){
            return(setModal(oops, "warning"))
          }
      }
      else{
        return(setModal(oops, "warning"))
      }
    }
  
    async function wrapName(){
      setLoading(true);
      if(store().domain.isValid !== true){
        var message = <>{store().domain.name} - not normalized</>
        return(setModal(message, "format"))
      }
      if(store().domain.owner !== store().userAddress){
        var message = <>You do not own {store().domain.name}</>
        return(setModal(message, "warning"))
      }
      if(store().domain.status !== "transferred"){
        var message = <>{store().domain.name} not transferred to wrapper</>
        return(setModal(message, "warning"))
      }

      if(store().domain.status == "transferred"){
        try{
          var tx = await og.lnr.wrapperContract.wrap(store().domain.bytes);
          tx.wait().then(async (receipt) => {
              if(receipt && receipt.status == 1) {
                await updateNameData();
                var message = <>{store().domain.name} wrapped! <a href={`https://opensea.io/assets/ethereum/0x2cc8342d7c8bff5a213eb2cde39de9a59b3461a7/${store().domain.tokenId}`} target="_blank">View on OpenSea</a></>;
                return(setModal(message, "success"));
              }
              if(receipt && receipt.status == 0){
                  return(setModal(oops, "warning"))
              }
          });
          } catch(e){
            return(setModal(oops, "warning"))
          }
        }
      else{
        return(setModal(oops, "warning"))
      }
    }

    async function unwrapName(){
      setLoading(true);
      if(store().domain.isValid !== true){
        var message = <>{store().domain.name} - not normalized</>
        return(setModal(message, "format"))
      }
      if(store().domain.owner !== store().userAddress){
        var message = <>You do not own {store().domain.name}</>
        return(setModal(message, "warning"))
      }
      if(store().domain.status !== "wrapped"){
        var message = <>{store().domain.name} not wrapped</>
        return(setModal(message, "warning"))
      }
      if(store().domain.status == "wrapped"){

        try{
          var tx = await og.lnr.wrapperContract.unwrap(store().domain.bytes);
          tx.wait().then(async (receipt) => {
              if(receipt && receipt.status == 1) {
                await updateNameData();
                var message = <>{store().domain.name} unwrapped! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>;
                return(setModal(message, "success"));
              }
              if(receipt && receipt.status == 0){
                  return(setModal(oops, "warning"))
              }
          });
          } catch(e){
            return(setModal(oops, "warning"))
          }
      }
      else{
        return(setModal(oops, "warning"))
      }
      return
    }

    onMount(async () => {
      setLoading(true);
      await updateNameData()
      setLoading(false);
    });
  
  
    return(

          <div class="block has-text-centered">
              <h4 class="title is-3 has-text-light">{store().domain.name}</h4>
              <Switch >
                  <Match when={(store().domain.status == "unwrapped")}><button class="button tagCount" onClick={createWrapper}>Create Wrapper</button></Match>
                  <Match when={(store().domain.status == "waiting")}><button class="button tagCount" onClick={transferToWrapper}>Transfer to Wrapper</button></Match>
                  <Match when={(store().domain.status == "transferred")}><button class="button tagCount" onClick={wrapName}>Wrap</button></Match>
                  <Match when={(store().domain.status == "wrapped")}><button class="button tagCount" onClick={unwrapName}>Unwrap</button></Match>
              </Switch>
          </div>

    )
  }
  
  

export default Wrap;