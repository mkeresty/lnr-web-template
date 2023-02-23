import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import { isControllerFun, resolveOrReturn, isOwner, nameStatusTool, pureOwner} from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';
import Wrap from './WrapOld';
import MessageBox from '../components/MessageBox';

const NewDomain = () =>{

    var og = window.parent.og;

    const [name, setName] = createSignal({bytes: undefined, name: undefined, isValid: undefined, tokenId: undefined, status: undefined, owner: undefined, primary: undefined, controller: undefined});
    const [transferAddress, setTransferAddress] = createSignal();
    const [transferModal, setTransferModal] = createSignal(false);
    const [wrapperModal, setWrapperModal] = createSignal(false);
    const [isController, setIsController] = createSignal(false);
    const [controllerState, setControllerState] = createSignal();


    const [controllerTx, setControllerTx] = createSignal();
    const [primaryTx, setPrimaryTx] = createSignal(undefined);
  
    const { store, setStore } = useGlobalContext();

    const setModal = (message, type) => {
      const prev = store()
      var toSet = {modal:{status: true, message: message, type: type}}
      setStore({...prev, ...toSet});
  }

  const getNameData2 = async () =>{
    if(store().domain){
        
    }

  }
  

    const getNameData = async()=>{
      if(store().domain){
        const prev = store()
        const pure = await pureOwner(prev.domain.bytes)
        console.log('fhfhfhfhf', pure)
        var waiting = false
        try{
          var tempw = await og.lnr.waitForWrap(prev.domain.name)
          if(og.ethers.utils.isAddress(tempw)){
            var waiting = true
          }
        }
        catch(e){}
        if((pure == "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7") && og.ethers.utils.isAddress(waiting)){
          console.log("in here", waiting)
          var toSet = {owner: waiting}
          var merged = {...(prev.domain), ...toSet};
          console.log("mmm",merged)
          setName(merged);
        }
        else{
          setName(store().domain);
          console.log("name is", name())
        }
        console.log(name());
        var isctrl = await isControllerFun(store().domain.name, store().userAddress);
        setIsController(isctrl);
        console.log("ctrl", isController())
      }
      else{
        setRouteTo("Home")
      }

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
    await getNameData();
    //await updateOwner()
    setLoading(false);
  });

  const setLoading = (bool) => {
    const prev = store()
    var toSet = {isLoading: bool}
    setStore({...prev, ...toSet});
}




  //-------------------------------------------------

  const setPrimaryAddress = async()=>{
    setLoading(true);
    var tx = await og.lnr.setPrimary(name().name)
    tx.wait().then(async (receipt) => {
      setLoading(false);
      if (receipt && receipt.status == 1) {
         setLoading(false);
         setPrimaryTx(store().userAddress);
      }
   });

  }


  const setControllerAddress = async()=>{
    var check = await resolveOrReturn(controllerState());
    if(!check){
      return
    }
    setLoading(true);
    var tx = await og.lnr.setController(name().name, controllerState());
    tx.wait().then(async (receipt) => {
      setLoading(false);
      if (receipt && receipt.status == 1) {
         setLoading(false);
         setControllerTx(store().userAddress);
      }
   });
  }

  const unsetPrimaryAddress = async()=>{
    setLoading(true);
    var tx = await og.lnr.unsetPrimary(name().name);
    tx.wait().then(async (receipt) => {
      setLoading(false);
      if (receipt && receipt.status == 1) {
         setLoading(false);
         setPrimaryTx(undefined);
      }
   });
  }

  const unsetControllerAddress = async()=>{
    setLoading(true);
    var tx = await og.lnr.unsetController(name().name, name().controller);
    tx.wait().then(async (receipt) => {
      setLoading(false);
      if (receipt && receipt.status == 1) {
         setLoading(false);
         setControllerTx(undefined);
      }
   });
  }

  const handleTransfer = async()=>{
    var check = await resolveOrReturn(transferAddress());
    console.log("check", check, name().name)
    if(!check){
      return
    }
    setLoading(true);
    setTransferModal(false);
    if(name().status == "unwrapped"){
      console.log("gr")
      var tx = await og.lnr.linageeContract.transfer(name().bytes, check);
      console.log('tx', tx)
      tx.wait().then(async (receipt) => {
        setLoading(false);
        if (receipt && receipt.status == 1) {
           setLoading(false);
           const prev = name()
           var toSet = {owner: check}
           setName({...prev, ...toSet});
        }
        var message = <> {name().name} transferred! <a href={`https://etherscan.io/tx/${signature}`} target="_blank">View on Etherscan</a></>
        setModal(message, "success")
     });
     setLoading(false);

    }
    if(name().status == "wrapped"){
      var tx = await og.lnr.wrappedContract.safeTransferFrom(store().userAddress, check, name().tokenId);
      tx.wait().then(async (receipt) => {
        setLoading(false);
        if (receipt && receipt.status == 1) {
           setLoading(false);
           const prev = name()
           var toSet = {owner: check}
           setName({...prev, ...toSet});
           console.log(name())
        }
        var message = <> {currentName} transferred! <a href={`https://etherscan.io/tx/${signature}`} target="_blank">View on Etherscan</a></>
        setModal(message, "success")
     });
     setLoading(false);

    }
    setLoading(false);


  }



      return(
        <div class="page"> 
                <div classList={{"modal": true , "is-active":transferModal()}}>   
                  <div class="box dark-bg">
                  <h3 class="title is-3 wh profilePrimary">
                            {name().name}
                        </h3>
                    <br />
                    <input  
                    class="input mt-3 mb-3 dark-bg wh" type="text" placeholder="primary.og or address"
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
                  <div class="box dark-bg">
                    <Wrap />
                    <button class="button tagCount is-pulled-right" onClick={()=>setWrapperModal(false)}>close</button>
                  </div>
                  </div>
        <div class="spaceRow ml-4">
          <button class="button tagCount is-pulled-left" onClick={goBack}>back</button>
          <Show
            when={store().userAddress == name().owner}>
              <button class="button tagCount is-pulled-right" onClick={()=>setTransferModal(true)}>transfer</button>
          </Show>
          <Switch >
                  <Match when={store().userAddress == name().owner && name().status == "unwrapped" && name().isValid == "true"}><button class="button tagCount" onClick={()=>setWrapperModal(true)}>Wrap</button></Match>
                  <Match when={store().userAddress == name().owner && name().status == "wrapped"}><button class="button tagCount" onClick={()=>setWrapperModal(true)}>Unwrap</button></Match>
              </Switch>
        </div>
            <div class="columns" >
                <div class="column ">
                    <div class="block  bw">
                        <div class="box lg profileCard">
                    <img class="profileL" src="https://linagee.vision/LNR_L_Icon_White.svg" width="40" height="12"/>
                        <h3 class="title is-3 wh profilePrimary">
                            {name().name}
                        </h3>
                        </div>
                    </div>
                </div>
                <div class="column  centerColumn profileInfo">
                <div class="container p-4 pt-8 has-light-text wh has-text-left">
                <div class="is-hidden-mobile spacer"></div>
                        <h3 class="title is-3 wh">
                            {name().name}
                        </h3>
                        < br />
                        <div class="tags are-medium">
                          <span class="tag tagCount">
                              {name().status}
                          </span>
                          <Show
                            when={name().isValid == "true"}
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
              {name().owner}
            </h6>
            <hr class="solid"/>
            <h5 class="title is-5 wh">
              ByteCode
            </h5>
            <h6 class="subtitle is-6 wh">
              {name().bytes}
            </h6>
            <hr class="solid"/>
            <h5 class="title is-5 wh">
              Resolver
            </h5>
            <div class="spaceRow">
             <h6 class="subtitle is-6 wh">
             {name().primary || primaryTx() ||"Resolver is not set"}
              </h6> 
              <Switch >
                  <Match when={(isController() || (name().owner == store().userAddress)) && (name().primary == undefined) && name().isValid == "true"}><button class="button tagCount" onClick={setPrimaryAddress}>Set Primary</button></Match>
                  <Match when={(isController() || (name().owner == store().userAddress)) && (name().primary !== undefined || primaryTx() !== undefined)}><button class="button tagCount" onClick={unsetPrimaryAddress}>Unset Primary</button></Match>
              </Switch>

              </div>
            <hr class="solid"/>
            <h5 class="title is-5 wh">
              Controller
            </h5>
            <div class="spaceRow">

              <Switch >
                  <Match when={name().owner == store().userAddress && (name().controller == undefined || controllerTx() == undefined) && name().isValid == "true"}>
                  <input  
                    class="input dark-bg wh mw" type="text" placeholder="No controller set"
                    disabled={!(name().owner == store().userAddress)}
                    value={name().controller || "Controller is not set"}
                    onInput={(e) => {
                      setControllerState(e.target.value)
                    }}/>

                    <button class="button tagCount" onClick={setControllerAddress}>Set Controller</button>
                    </Match>
                  <Match when={name().owner == store().userAddress && (name().controller !== undefined || controllerTx() == !undefined)}>
                  <h6 class="subtitle is-6 wh">
                    {name().controller || controllerTx()}
                      </h6> 
                    <button class="button tagCount" onClick={unsetControllerAddress}>Unset Controller</button>
                    </Match>
                    <Match when={name().owner !== store().userAddress}>
                  <h6 class="subtitle is-6 wh">
                    {name().controller || controllerTx() || "Controller is not set"}
                      </h6> 
                    </Match>
              </Switch>
              </div>
            

            </div>
            </div>
           


        </div>

      )
}

export default NewDomain;