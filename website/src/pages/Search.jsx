import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, onMount, Show, For, createEffect, mergeProps } from 'solid-js';
import { resolve, nameLookup, handleEthers, getWrappedNames, getUnwrappedNames, getAllNames, resolveOrReturn, searchUnwrappedNames } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';
import MessageBox from '../components/MessageBox';

const Search = () => {
  var og = window.parent.og;
  const [name, setName] = createSignal('');
  const [names, setNames] = createSignal('');
  const [namesCount, setNamesCount] = createSignal();
  const [showModal, setShowModal] = createSignal(false);
  const [modalType, setModalType] = createSignal('nothisstart');
  const [modalName, setModalName] = createSignal('Lorem ipsum');
  const [modalOwner, setModalOwner] = createSignal('Lorem ipsum');
  const [modalSignature, setModalSignature] = createSignal('Lorem ipsum');
  const [modalMessage, setModalMessage] = createSignal('Lorem ipsum');

  
  const controlBox = (boxType, currentName, message)=>{
    setShowModal(false); 
    setModalType(boxType);
    setModalName(currentName);
    setModalMessage(message);
    setShowModal(true);
  }

  const { store, setStore } = useGlobalContext();

  const getPerson = async () =>{
    var check = await resolveOrReturn(name());
    if(og.ethers.utils.isAddress(check)){
        await setRouteTo("Profile", name());
        return
    }
    if(!name().endsWith(".og")){
        var message = <>Name must end in .og</>
        return(controlBox('format', name(), message))
    }
    var resname = await resolve(name())
    if(og.ethers.utils.isAddress(resname)){
        await setRouteTo("Profile", resname);
        return
    }
    if(resname == null){
        var message = <>{name()} - No resolver set</>
        return(controlBox('format', currentName, message))
    }
    var message = <>Oops something went wrong</>;
    controlBox("warning", name(), message)

    return

  }

  const searchNames = async()=>{
    var res = await searchUnwrappedNames(name());
    if(res.length > 0){
        setNames(res);
        const prev = store()
        var toSet = {searchData: {name: name(), names: names()}}
        setStore({...prev, ...toSet});
    }
  }


  const setRouteTo = async (route, item) => {
    const prev = store()
    var toSet = {route: route}
    if(route == "Domain"){
      var toSet = {lastRoute: store().route, route: route, domain: item}
    }
    setStore({...prev, ...toSet});
}

  
onMount(() => {
    if (store().searchData) {
        setNames(store().searchData.names);
        setName(store().searchData.name);
    }
  });   



    return(
      <div class="page">
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
        <br />
        <div class="columns is-mobile">  
          <div class="column is-10 is-offset-1 pb-10">
              <div class="card lg has-text-centered">
                <br/>
                <p class="title has-text-light">
                search.og
                </p>
                {store}
                
                <br/>
              </div>
            </div>
          </div>
          <div class="is-flex is-flex-direction-row m-3">
          <a role="button" id="burger" class="navbar-burger mr-3">
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
</a>
            <input  
                      class="input dark-bg wh" type="text" placeholder="address"
                      onInput={(e) => {
                        setName(e.target.value)
                      }}/>  
            <button class="button tagCount ml-3 is-outlined" onClick={getPerson}>Search profile</button>
            <button class="button tagCount ml-3 is-outlined" onClick={searchNames}>Search names</button>
          </div>
          <br />
          <h2 class="title is-2 has-text-white-bis">{namesCount}</h2>
          <br/>
      <div class="columns is-multiline is-mobile mr-3 ml-3">
          <For each={names()}>{(item, i) =>
          <div class="column">
                <div onClick={()=>setRouteTo("Domain", item)} class="tile box is-vertical has-background-dark linagee-border has-text-white-bis fullHeight">
                  <h6 class="title is-4 has-text-white-bis">{item.name}</h6>
                  <h6 class="title is-6 has-text-white-bis">{item.status}</h6>
                
                <Show
                  when={item.isValid == "true"}
                  fallback={
                    <span class="tag is-danger ml-7 mr-7 has-text-white-bis">Invalid</span>
                  }
                >
                  <span class="tag is-success ml-7 mr-7 has-text-white-bis">Valid</span>
                </Show>
                </div>
            </div>
       
      }</For>

</div>
      

      </div>
    )
  }
  
  export default Search;