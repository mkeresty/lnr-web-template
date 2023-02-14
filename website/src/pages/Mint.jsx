import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, handleEthers } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Mint = () =>{

    var og = window.parent.og;
    const [name, setName] = createSignal('name.og');
    const [loading, setLoading] = createSignal(false);
    const [showModal, setShowModal] = createSignal(false);
    const [modalType, setModalType] = createSignal('nothisstart');
    const [modalName, setModalName] = createSignal('Lorem ipsum');
    const [modalOwner, setModalOwner] = createSignal('Lorem ipsum');
    const [modalSignature, setModalSignature] = createSignal('Lorem ipsum');
    const [modalMessage, setModalMessage] = createSignal('Lorem ipsum');

    
    const controlBox = (boxType, currentName, ownerAddress, signature, message)=>{
      setShowModal(false); 
      setModalType(boxType);
      setModalName(currentName);
      setModalOwner(ownerAddress);
      setModalSignature(signature);
      setModalMessage(message);
      setShowModal(true);
    }

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
      setLoading(true);
      const currentName = name();
      var isValid = await og.lnr.isValidDomain(currentName);
      if(isValid[0] == false){
        var message = <>{currentName} - {isValid[1]}</>
        setLoading(false)
        return(controlBox('format', currentName, "null", isValid[1], message))
      }
      var walletAddress = await og.signer.getAddress();
      var checked = await og.lnr.owner(currentName);
      console.log("checledf", checked)
      if(checked == null){
        var signature = await handleEthers(og.lnr.reserve(currentName));

        if(signature){
          signature.wait().then(async (receipt) => {
            setLoading(false);
            if (receipt && receipt.status == 1) {
               setLoading(false);
               var message = <> {currentName} minted! <a href={`https://etherscan.io/tx/${signature}`} target="_blank">View on Etherscan</a></>
               controlBox("success", currentName, walletAddress, signature, message);
            }
         });
         setLoading(false);

            return(signature);
        }
        else{
          var message = <>Oops something went wrong</>;
          controlBox("warning", currentName, walletAddress, "null", message)
        }

        
      }
      if(checked && checked!== false){
        console.log("here")
        var nameorAddress = await nameLookup(checked[0])
        console.log("here", nameorAddress)
        var message = <>{currentName} is owned by <a href={`https://etherscan.io/address/${checked[0]}`} target="_blank"> {nameorAddress || checked[0]}</a></>
        controlBox("warning", currentName, checked[0], "null", message)
        setLoading(false);
        return(checked[0])
      }
      else{
        var message = <>Oops something went wrong</>;
        controlBox("warning", currentName, walletAddress, "null", message)
        setLoading(false);
      }
      setLoading(false);
      return
    }


  
    return(
      <div class="page">
  <br/>
  <div class="columns is-mobile cn">  
  
                    <div class="block  bw sm">
                        <div class="box lg profileCard">
                    <img class="profileL" src="https://linagee.vision/LNR_L_Icon_White.svg" width="40" height="12"/>
                        <h3 class="title is-3 wh profilePrimary">
                            {name}
                        </h3>
                        </div>
                    </div>
      </div>
      <Show when={loading() == true}>
                <progress class="progress is-small is-primary ml-8 mr-8" max="100">15%</progress>
                </Show>
  <div class="columns is-mobile">   

      <div class="column is-half is-offset-one-quarter mt-6">
          <div class="block has-text-centered">
              <h3 class="title is-3 has-text-light">Mint</h3>
                  <input  
                    class="input dark-bg wh mw" type="text" placeholder="name.og"
                    onInput={(e) => {
                      setShowModal(false); 
                      setName(e.target.value)
                    }}/>      
                    <button class="button is-outlined mb-3 ml-3 tagCount" onClick={mintOg}>Mint</button>
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