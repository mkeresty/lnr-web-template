import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, resolveOrReturn, handleEthers } from '../utils/nameUtils';

const Transfer = () =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('');
    const [transferAddress, setTransferAddress] = createSignal('');
    const [showModal, setShowModal] = createSignal(false);
    const [modalType, setModalType] = createSignal('nothisstart');
    const [modalName, setModalName] = createSignal('Lorem ipsum');
    const [modalOwner, setModalOwner] = createSignal('Lorem ipsum');
    const [modalSignature, setModalSignature] = createSignal('Lorem ipsum');
    const [modalMessage, setModalMessage] = createSignal('Lorem ipsum');
  
    async function transferOg(){
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var walletAddress = await og.signer.getAddress();
      var checkedAddress = await resolveOrReturn(transferAddress());
      if(checkedAddress == false){
        var message = <>Not a valid transfer address</>
        console.log("not today")
        return(controlBox("warning", currentName, walletAddress, "null", message))
      }
      var checked = await handleEthers(og.lnr.owner(currentName));
      console.log("checked is", checked)
      if(checked && checked[0] == walletAddress){
        var nameorAddress = await nameLookup(walletAddress)
        var signature = await handleEthers(og.lnr.transfer(checkedAddress, currentName));
        if(signature){
        var message = <>{currentName} transfered to <a href={`https://etherscan.io/address/${checkedAddress}`} target="_blank"> {nameorAddress}</a></>;
        controlBox("success", currentName, walletAddress, "null", message)
        return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          controlBox("warning", currentName, walletAddress, "null", message)
        }
      }
      if(checked[0] !== walletAddress && checked!== false){
        var message = <>You do not own {currentName}</>
        return(controlBox("warning", currentName, walletAddress, "null", message))
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


  
  
    return(
      <div class="page">
  <br/>
  <div class="columns is-mobile">  
  
  <div class="column is-10 is-offset-1 pb-10">
          <div class="card lg has-text-centered">
          <br/>
          <p class="title has-text-light">
          This entire site is on chain
          </p>
          <br/>
          </div>
      </div>
      </div>
  <div class="columns is-mobile">   
  
      <div class="column is-half is-offset-one-quarter mt-6">
          <div class="block has-text-centered">
              <h3 class="title is-3 has-text-light">Transfer</h3>
                  <input  
                    class="input mt-3 mb-3" type="text" placeholder="name.og"
                    onInput={(e) => {
                      setShowModal(false); 
                      setName(e.target.value)
                    }}/>
                    <br />
                    <input  
                    class="input mt-3 mb-3" type="text" placeholder="primary.og or address"
                    onInput={(e) => {
                      setShowModal(false); 
                      setTransferAddress(e.target.value)
                    }}/>
                  <button class="button is-outlined m-3" onClick={transferOg}>Transfer</button>
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
      </div>
  </div>
  </div>
    )
  }
  

export default Transfer