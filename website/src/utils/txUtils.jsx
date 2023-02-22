import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, handleEthers, isNorm } from './nameUtils';
import { useGlobalContext } from '../GlobalContext/store';


export async function mintFunction(name){
    var og = window.parent.og;
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

  const mint = async () => {
    setLoading(true);
    if(!isNorm(name)){
      var message = <>{name} - invalid</>
      return(setModal(message, "format"))
    }
    var checked = await og.lnr.owner(name);
    if(checked && checked!== false && checked[0]){
        var nameorAddress = await nameLookup(checked[0])
        var message = <>{name} is owned by <a href={`https://etherscan.io/address/${checked[0]}`} target="_blank"> {nameorAddress || checked[0]}</a></>
        return(setModal(message, "warning"));
      }
    if(checked == null){
      try{
        var tx = await og.lnr.reserve(name);
        tx.wait().then(async (receipt) => {
            if(receipt && receipt.status == 1) {
              var message = <> {name} minted! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
              return(setModal(message, "success"));
            }
            if(receipt && receipt.status == 0){
                return(setModal(oops, "warning"))
            }
        });
        } catch(e){
          return(setModal(oops, "warning"))
        }}  
    else{
        return(setModal(oops, "warning"))
    }};
}