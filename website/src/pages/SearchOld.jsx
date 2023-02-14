import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import NameBox from '../components/NameInfo';
import AddressBox from '../components/AddressInfo';
import { nameLookup, handleEthers } from '../utils/nameUtils';

const SearchOld = () =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('');
    const [showModal, setShowModal] = createSignal(false);
    const [showAddressModal, setShowAddressModal] = createSignal(false);
    const [showErrorModal, setShowErrorModal] = createSignal(false);
    const [modalType, setModalType] = createSignal('nothisstart');
    const [modalErrorType, setModalErrorType] = createSignal('nothisstart');
    const [modalName, setModalName] = createSignal('Lorem ipsum');
    const [modalOwner, setModalOwner] = createSignal('Lorem ipsum');
    const [modalSignature, setModalSignature] = createSignal('Lorem ipsum');
    const [modalMessage, setModalMessage] = createSignal('Lorem ipsum');
    const [modalAddress, setModalAddress] = createSignal('Lorem ipsum');
    const [modalAddressPrimary, setModalAddressPrimary] = createSignal('Lorem ipsum');


    async function handleSearch(){
        const currentName = name();
        const addressBool = og.ethers.utils.isAddress(currentName);
        console.log("is address", addressBool)
        if(addressBool){
            var primary = await handleEthers(og.lnr.lookupAddress(currentName));
            return(controlAddressBox(currentName, primary))
        }
        var isValid = await og.lnr.isValidDomain(currentName);
        if(isValid[0] == false && !addressBool){
          var message = <>{currentName} - {isValid[1]}</>
          return(controlErrorBox("warning", message))
        }

        var owner = await handleEthers(og.lnr.owner(currentName));
        if(owner == false){
            var message = <>Oops something went wrong</>;
            return(controlErrorBox("warning", message))
        }
        if(owner == null && isValid){
            var message = <>Not owned yet</>;
            return(controlErrorBox("success", message))
        }
        var primary = await handleEthers(og.lnr.resolveName(currentName));
        if(primary){
            return(controlBox("name", currentName, owner[0], primary, owner[1]))
        }
        else {
        var message = <>Oops something went wrong</>;
        return(controlErrorBox("warning", message))
        }


        
    }

    const controlBox = (boxType, currentName, ownerAddress, primary, wrapped)=>{
        setShowAddressModal(false); 
        setShowModal(false); 
        setShowErrorModal(false);
        setModalType(boxType);
        setModalName(currentName);
        setModalOwner(ownerAddress);
        setModalPrimary(primary);
        setModalwrapped(wrapped);
        setShowModal(true);
      }

      const controlAddressBox = (address, primary)=>{
        setShowAddressModal(false); 
        setShowModal(false); 
        setShowErrorModal(false);
        setModalAddress(address);
        setModalAddressPrimary(primary);
        setShowAddressModal(true);
      }


      const controlErrorBox = (errorType, message) => {
        setShowAddressModal(false); 
        setShowModal(false); 
        setShowErrorModal(false);
        setModalMessage(message);
        setModalErrorType(errorType);
        setShowErrorModal(true);
      }


    return(
        <div class="page">
        <br />
        <div class="columns is-mobile">  
  
        <div class="column is-10 is-offset-1 pb-10">
          <div class="card lg has-text-centered">
          <br/>
          <p class="title has-text-light">
          search.og
          </p>
          <br/>
          </div>
      </div>
      </div>
      <div class="columns is-mobile">   
      <div class="column is-half is-offset-one-quarter mt-6">
          <div class="block has-text-centered">
              <h3 class="title is-3 has-text-light">Search</h3>
                  <input  
                    class="input dark-bg wh mw" type="text" placeholder="name.og or address"
                    onInput={(e) => {
                        setShowAddressModal(false); 
                        setShowModal(false); 
                        setShowErrorModal(false);
                      setName(e.target.value)
                    }}/>      
                    <button class="button is-outlined mb-3" onClick={handleSearch}>Search</button>
                    <Show when={showModal()}>
                    <NameBox
                    type={modalType()}
                    name={modalName()}
                    owner={modalOwner()}
                    primary={modalPrimary()}
                    wrapped={modalWrapped()}
                    onOk={() => {
                        setModalType('WARNING');
                        setShowModal(false);
                    }}>
                    </NameBox>
                </Show>
                <Show when={showErrorModal()}>
                    <MessageBox
                    type={modalErrorType()}
                    message={modalMessage()}
                    onOk={() => {
                        setModalErrorType('WARNING');
                        setShowErrorModal(false);
                    }}>
                    </MessageBox>
                </Show>
                <Show when={showAddressModal()}>
                    <AddressBox
                    address={modalAddress()}
                    primary={modalAddressPrimary()}
                    onOk={() => {
                        setShowAddressModal(false);
                    }}>
                    </AddressBox>
                </Show>

                
          </div>
      </div>
  </div>
      </div>


    )
}

export default SearchOld;