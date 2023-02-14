import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, handleEthers } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Mint = (props) =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('');

    const [showModal, setShowModal] = createSignal(false);
    const [modalType, setModalType] = createSignal('nothisstart');
    const [modalName, setModalName] = createSignal('Lorem ipsum');
    const [modalOwner, setModalOwner] = createSignal('Lorem ipsum');
    const [modalSignature, setModalSignature] = createSignal('Lorem ipsum');
    const [modalMessage, setModalMessage] = createSignal('Lorem ipsum');

    const { store, setStore } = useGlobalContext();

    //do i really need this part below
    onMount(() => {
        if (showModal()) {
          setTimeout(() => {
            setModalType('SUCCESS');
            setModalName('Everything is good');
          }, 1500);
    
          setTimeout(() => {
            setModalType('ERROR');
            setModalName('Something is wrong');
          }, 3000);
        }
      });


    async function mintOg(){
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var walletAddress = await og.signer.getAddress();
      var checked = await handleEthers(og.lnr.owner(currentName));
      if(checked == null){
        var signature = await handleEthers(og.lnr.reserve(currentName));
        if(signature){
            var message = <> {currentName} minted! <a href={`https://etherscan.io/tx/${signature}`} target="_blank">View on Etherscan</a></>
            controlBox("success", currentName, walletAddress, signature, message);
            return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          controlBox("warning", currentName, walletAddress, "null", message)
        }

        
      }
      if(checked && checked!== false){
        var nameorAddress = await nameLookup(checked[0])
        var message = <>{currentName} is owned by <a href={`https://etherscan.io/address/${checked[0]}`} target="_blank"> {nameorAddress}</a></>
        controlBox("warning", currentName, checked[0], "null", message)
        return(checked[0])
      }
      else{
        var message = <>Oops something went wrong</>;
        controlBox("warning", currentName, walletAddress, "null", message)
      }
      return
    }

    const controlBox = (boxType, currentName, ownerAddress, signature, message)=>{
        setShowModal(false); 
        setModalType(boxType);
        setModalName(currentName);
        setModalOwner(ownerAddress);
        setModalSignature(signature);
        setModalMessage(message);
        setShowModal(true);
      }

      const handlec = ()=>{
        props.onSet("mintbob")
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
          {store}
          <br/>
          <button onClick={() => setStore("minting")}></button>
          </div>
      </div>
      </div>
  <div class="columns is-mobile">   
      <div class="column is-half is-offset-one-quarter mt-6">
          <div class="block has-text-centered">
              <h3 class="title is-3 has-text-light">Mint</h3>
                  <input  
                    class="input mb-3 mt-3" type="text" placeholder="name.og"
                    onInput={(e) => {
                      setShowModal(false); 
                      setName(e.target.value)
                    }}/>      
                    <button class="button is-outlined mb-3" onClick={mintOg}>Mint</button>
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
  
  
export default Mint;  