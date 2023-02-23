import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import { isControllerFun, resolveOrReturn, isOwner, nameStatusTool, pureOwner, getCurrentNameStatus} from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';
import Wrap from './Wrap';
import MessageBox from '../components/MessageBox';

const Domain = () =>{

    var og = window.parent.og;

    const [name, setName] = createSignal({bytes: undefined, name: undefined, isValid: undefined, tokenId: undefined, status: undefined, owner: undefined, primary: undefined, controller: undefined});
    const [transferAddress, setTransferAddress] = createSignal();
    const [transferModal, setTransferModal] = createSignal(false);
    const [wrapperModal, setWrapperModal] = createSignal(false);
    const [isController, setIsController] = createSignal(false);
    const [controllerState, setControllerState] = createSignal();


    const [controllerTx, setControllerTx] = createSignal(undefined);
    const [primaryTx, setPrimaryTx] = createSignal(undefined);
  
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
      console.log(stat, "new test")
      if(stat){
        const prev = store()
        var merged = {...(prev.domain), ...stat};
        var toSet = {domain: merged}
        setStore({...prev, ...toSet});
        var isctrl = await isControllerFun(store().domain.name, store().userAddress);
        setIsController(isctrl);
        setLoading(false)
        return
      }
    }
    return(setRouteTo("Home"))
  }

    createEffect(()=>{
      console.log(transferModal(), "m")
    })

    const setRouteTo = (route) => {
        const prev = store()
        var toSet = {lastRoute: 'Domain',route: route}
        setStore({...prev, ...toSet});
    }

    const goBack = ()=>{
      const prev = store()
      setRouteTo(prev.lastRoute)
    }



  onMount(async () => {
    setLoading(true);
    await updateNameData()
    setLoading(false);
  });

  const setPrimaryAddress = async()=>{
    setLoading(true);
    try{
      var tx = await og.lnr.setPrimary(store().domain.name)
      tx.wait().then(async (receipt) => {
          if(receipt && receipt.status == 1) {
            var message = <> {store().domain.name} set as primary! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
            await updateNameData();
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


  const setControllerAddress = async()=>{
    var check = await resolveOrReturn(controllerState());
    if(!check){
      return
    }
    setLoading(true);
    try{
      var tx = await og.lnr.setController(store().domain.name, controllerState());
      tx.wait().then(async (receipt) => {
          if(receipt && receipt.status == 1) {
            var message = <> {store().domain.name} set as controller! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
            await updateNameData();
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

  const unsetPrimaryAddress = async()=>{
    setLoading(true);
    try{
      var tx = await og.lnr.unsetPrimary(store().domain.name)
      tx.wait().then(async (receipt) => {
          if(receipt && receipt.status == 1) {
            var message = <> {store().domain.name} unset as primary! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
            await updateNameData();
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

  const unsetControllerAddress = async()=>{
    var check = await resolveOrReturn(controllerState());
    if(!check){
      return
    }
    setLoading(true);
    try{
      var tx = await og.lnr.unsetController(store().domain.name, controllerState());
      tx.wait().then(async (receipt) => {
          if(receipt && receipt.status == 1) {
            var message = <> {store().domain.name} unset as controller! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
            await updateNameData();
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

  const handleTransfer = async()=>{
    if(store().domain.status == "waiting" || store().domain.status == "transferred"){
      return(setModal(`Cannot transfer name while status is ${store().domain.status}`, "warning"))
    }
    var check = await resolveOrReturn(transferAddress());
    console.log("check", check, store().domain.name)
    if(!check){
      return
    }
    setLoading(true);
    setTransferModal(false);
    if(store().domain.status == "unwrapped"){
      console.log("gr")
      try{
        var tx = await og.lnr.linageeContract.transfer(store().domain.bytes, check);
        tx.wait().then(async (receipt) => {
            if(receipt && receipt.status == 1) {
              var message = <> {store().domain.name} transferred! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
              await updateNameData();
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
    if(store().domain.status == "wrapped"){
      try{
        var tx = await og.lnr.wrappedContract.safeTransferFrom(store().userAddress, check, store().domain.tokenId);
        tx.wait().then(async (receipt) => {
            if(receipt && receipt.status == 1) {
              var message = <> {store().domain.name} transferred! <a href={`https://etherscan.io/tx/${tx}`} target="_blank">View on Etherscan</a></>
              await updateNameData();
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



      return(
        <div class="page"> 
                <div classList={{"modal": true , "is-active":transferModal()}}>   
                  <div class="box dark-bg modalBg">
                  <h3 class="title is-3 wh profilePrimary">
                            {store().domain.name}
                        </h3>
                    <br />
                    <input  
                    class="input mt-3 mb-3 no-bg wh" type="text" placeholder="primary.og or address"
                    onInput={(e) => {

                      setTransferAddress(e.target.value)
                    }}/>
                  <div class="spaceRow">
                  <button class="button tagCount is-pulled-right" onClick={()=>setTransferModal(false)}>close</button>
                  <button class="button tagCount" onClick={handleTransfer}>Transfer</button>
                  </div>

                  </div>


                <button class="modal-close is-large" aria-label="close"></button>
                </div>
                <div classList={{"modal": true , "is-active":wrapperModal()}}>   
                  <div class="box dark-bg modalBg">
                    <Wrap />
                    <button class="button tagCount is-pulled-right" onClick={()=>setWrapperModal(false)}>close</button>
                  </div>
                  </div>
        <div class="spaceRow ml-4">
          <button class="button tagCount is-pulled-left" onClick={goBack}>back</button>
          <Show
            when={store().userAddress == store().domain.owner}>
              <button class="button tagCount is-pulled-right" onClick={()=>setTransferModal(true)}>transfer</button>
          </Show>
          <Switch >
                  <Match when={store().userAddress == store().domain.owner && store().domain.status == "unwrapped" && store().domain.isValid == true}><button class="button tagCount" onClick={()=>setWrapperModal(true)}>Wrap(0/3)</button></Match>
                  <Match when={store().userAddress == store().domain.owner && store().domain.status == "waiting" && store().domain.isValid == true}><button class="button tagCount" onClick={()=>setWrapperModal(true)}>Wrap(1/3)</button></Match>
                  <Match when={store().userAddress == store().domain.owner && store().domain.status == "transferred" && store().domain.isValid == true}><button class="button tagCount" onClick={()=>setWrapperModal(true)}>Wrap(2/3)</button></Match>
                  <Match when={store().userAddress == store().domain.owner && store().domain.status == "wrapped"}><button class="button tagCount" onClick={()=>setWrapperModal(true)}>Unwrap</button></Match>
              </Switch>
        </div>
            <div class="columns" >
                <div class="column ">
                    <div class="block  bw">
                        <div class="box lg profileCard">
                    <img class="profileL" src="https://linagee.vision/LNR_L_Icon_White.svg" width="40" height="12"/>
                        <h3 class="title is-3 wh profilePrimary">
                        {store().domain.name}
                        </h3>
                        </div>
                    </div>
                </div>
                <div class="column  centerColumn profileInfo">
                <div class="container p-4 pt-8 has-light-text wh has-text-left">
                <div class="is-hidden-mobile spacer"></div>
                        <h3 class="title is-3 wh">
                            {store().domain.name}
                        </h3>
                        < br />
                        <div class="tags are-medium">
                          <span class="tag tagCount">
                              {store().domain.status}
                          </span>
                          <Show
                            when={store().domain.isValid == true}
                            fallback={<span class="tag is-danger ml-7 mr-7 has-text-white-bis">Invalid</span>}>
                                <span class="tag is-success ml-7 mr-7 has-text-white-bis">Valid</span>
                            </Show>

                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="block  bw">
            <div class="content p-4 has-text-left wh">
              
            <h5 class="title is-5 wh">
              Owner
            </h5>
            <h6 class="subtitle is-6 wh">
            {store().domain.owner}
            </h6>
            <hr class="solid"/>
            <h5 class="title is-5 wh">
              ByteCode
            </h5>
            <h6 class="subtitle is-6 wh">
            {store().domain.bytes}
            </h6>
            <hr class="solid"/>
            <h5 class="title is-5 wh">
              Resolver
            </h5>
            <div class="spaceRow">
             <h6 class="subtitle is-6 wh">
             {store().domain.primary || "Resolver is not set"}
              </h6> 
              <Switch >
                  <Match when={(isController() || (store().domain.owner == store().userAddress)) && (store().domain.primary == undefined) && store().domain.isValid == true}><button class="button tagCount" onClick={setPrimaryAddress}>Set Primary</button></Match>
                  <Match when={(isController() || (store().domain.owner == store().userAddress)) && (store().domain.primary !== undefined)}><button class="button tagCount" onClick={unsetPrimaryAddress}>Unset Primary</button></Match>
              </Switch>

              </div>
            <hr class="solid"/>
            <h5 class="title is-5 wh">
              Controller
            </h5>
            <div class="spaceRow">

              <Switch 
                    fallback={<h6 class="subtitle is-6 wh">Controller is not set</h6> }  
                  >
                  <Match when={store().domain.owner == store().userAddress && (store().domain.controller == undefined || controllerTx() == undefined) && store().domain.isValid !== false}>
                  <input  
                    class="input dark-bg wh mw" type="text" placeholder="No controller set"
                    disabled={!(store().domain.owner == store().userAddress)}
                    value={store().domain.controller || "Controller is not set"}
                    onInput={(e) => {
                      setControllerState(e.target.value)
                    }}/>

                    <button class="button tagCount" onClick={setControllerAddress}>Set Controller</button>
                    </Match>
                  <Match when={store().domain.owner == store().userAddress && (store().domain.controller !== undefined || controllerTx() == !undefined)&& store().domain.isValid !== false}>
                  <h6 class="subtitle is-6 wh">
                    {store().domain.controller || controllerTx()}
                      </h6> 
                    <button class="button tagCount" onClick={unsetControllerAddress}>Unset Controller</button>
                    </Match>
                    <Match when={store().domain.owner !== store().userAddress && store().domain.isValid !== false}>
                  <h6 class="subtitle is-6 wh">
                    {store().domain.controller || controllerTx() || "Controller is not set"}
                      </h6> 
                    </Match>
              </Switch>
              </div>
            

            </div>
            </div>
           


        </div>

      )
}

export default Domain;