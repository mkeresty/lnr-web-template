import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, resolveOrReturn, handleEthers } from '../utils/nameUtils';
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
    const { store, setStore } = useGlobalContext();

    async function createWrapper(){
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var walletAddress = await og.signer.getAddress();
      var checked = await handleEthers(og.lnr.owner(name()));
      if(checked[0] !== walletAddress && checked !== false){
        var message = <>You do not own {currentName}</>
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      if(checked && checked[0] == walletAddress ){
        var signature = await handleEthers(og.lnr.createWrapper(name()));
        if(signature){
        var message = <>Wrapper created for <a href={`https://etherscan.io/tx/${signature}`} target="_blank"> {currentName}</a></>;
        controlBox("success", currentName, walletAddress, "null", message)
        return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          controlBox("warning", currentName, walletAddress, "null", message)
        }
      }
      else{
        var message = <>Oops something went wrong</>;
        controlBox("warning", currentName, walletAddress, "null", message)
      }
      return
    }
  
    async function transferToWrapper(){
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var walletAddress = await og.signer.getAddress();
      var checked = await handleEthers(og.lnr.owner(name()));
      if(checked == false){
        var message = <>Oops something went wrong</>;
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      var waiting = await handleEthers(og.lnr.waitForWrap(name()));
      if(checked[0] !== walletAddress && checked !== false){
        var message = <>You do not own {currentName}</>
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      if(waiting !== walletAddress){
        var message = <>Wrapper not created for {currentName}</>
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      if(checked && checked[0] == walletAddress && waiting == walletAddress){
        var signature = await handleEthers(og.lnr.transfer(lnr.wrapperAddress, name()));
        if(signature){
        var message = <>{currentName} transferred to <a href={`https://etherscan.io/tx/${signature}`} target="_blank"> wrapper</a></>;
        controlBox("success", currentName, walletAddress, "null", message)
        return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          controlBox("warning", currentName, walletAddress, "null", message)
        }
      }
      else{
        var message = <>Oops something went wrong</>;
        controlBox("warning", currentName, walletAddress, "null", message)
      }
      return
    }
  
    async function wrapName(){
      const currentName = name();
      var walletAddress = await og.signer.getAddress();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var checked = await handleEthers(og.lnr.owner(name()));
      if(checked == false){
        var message = <>Oops something went wrong</>;
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      if(checked && checked[0] == walletAddress && checked[1] == "unwrapped" && checked !== false){
        var signature = await handleEthers(og.lnr.wrap(name()));
        if(signature){
        var message = <>{currentName} wrapped! <a href={`https://etherscan.io/tx/${signature}`} target="_blank"> View on Etherscan</a></>;
        controlBox("success", currentName, walletAddress, "null", message)
        return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          controlBox("warning", currentName, walletAddress, "null", message)
        }
      }
      else{
        var message = <>Oops something went wrong</>;
        controlBox("warning", currentName, walletAddress, "null", message)
      }
      return
    }

    async function unwrapName(){
      const currentName = name();
      var walletAddress = await og.signer.getAddress();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var checked = await handleEthers(og.lnr.owner(name()));
      if(checked == false){
        var message = <>Oops something went wrong</>;
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      if(checked && checked[0] == walletAddress && checked[1] == "wrapped"){
        var signature = await handleEthers(og.lnr.wrap(name()));
        if(signature){
        var message = <>{currentName} unwrapped! <a href={`https://etherscan.io/tx/${signature}`} target="_blank"> View on Etherscan</a></>;
        controlBox("success", currentName, walletAddress, "null", message)
        return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          return(controlBox("warning", currentName, walletAddress, "null", message))
        }
      }
      else{
        var message = <>Oops something went wrong</>;
        controlBox("warning", currentName, walletAddress, "null", message)
      }
      return
    }

    const controlBox = (boxType, currentName, ownerAddress, signature, message)=>{
      console.log("showing modal");
      setShowModal(false); 
      setModalType(boxType);
      setModalName(currentName);
      setModalOwner(ownerAddress);
      setModalSignature(signature);
      setModalMessage(message);
      setShowModal(true);
    }

    onMount(async () => {
      setName(store().domain.name);
      setNameStatus(store().domain.status)
    });
  


  
  
    return(

          <div class="block has-text-centered">
              <h4 class="title is-3 has-text-light">{name}</h4>
                    <Show
                    when={nameStatus() == "unwrapped"}
                    fallback={<button class="button is-outlined m-3" onClick={unwrapName}>Unwrap</button>}
                    >
                      <button class="button is-outlined m-3" onClick={createWrapper}>Create Wrapper</button>
                      <button class="button is-outlined m-3" onClick={transferToWrapper}>Transfer to Wrapper</button>
                      <button class="button is-outlined m-3" onClick={wrapName}>Wrap</button>
                    </Show>
                  <Show when={showModal()}>
                    <MessageBox
                    type={modalType()}
                    name={modalName()}
                    owner={modalOwner()}
                    signature={modalSignature()}
                    message={modalMessage()}
                    onOk={() => {
                        setModalType('WARNING');
                        setShowModal(false);
                    }}>
                    </MessageBox>
                </Show>
          </div>

    )
  }
  
  

export default Wrap;