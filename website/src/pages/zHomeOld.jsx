import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, onMount, Show, For, createEffect, mergeProps } from 'solid-js';
import { nameLookup, handleEthers, getWrappedNames, getUnwrappedNames, getAllNames } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Home = () => {
  var og = window.parent.og;
  const [name, setName] = createSignal('');
  const [names, setNames] = createSignal('');
  const [namesCount, setNamesCount] = createSignal();

  const { store, setStore } = useGlobalContext();

  const getNames =async () =>{
    if(name().length > 0){
      var repNames = await getAllNames(name());
      console.log('reo', repNames)
      if(repNames.length > 1){
        setNames(repNames);
        setNamesCount(repNames.length);
        return
      }
      return

    }
    return

  }

  
  const Test = () => {
    const prev = store()
    var toSet = {domain: "howdy"}
    setStore({...prev, ...toSet});
}



    return(
      <div class="page">
        <br />
        <div class="columns is-mobile">  
          <div class="column is-10 is-offset-1 pb-10">
              <div class="card lg has-text-centered">
                <br/>
                <p class="title has-text-light">
                home.og
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
                      class="input" type="text" placeholder="address"
                      onInput={(e) => {
                        setName(e.target.value)
                      }}/>  
            <button class="button is-outlined ml-3" onClick={getNames}>search</button>
          </div>
          <br />
          <h2 class="title is-2 has-text-white-bis">{namesCount}</h2>
          <br/>
      <div class="columns is-multiline is-mobile mr-3 ml-3">
          <For each={names()}>{(item, i) =>
          <div class="column">
                <div onClick={()=>setRouteTo("Domain")} class="tile box is-vertical has-background-dark linagee-border has-text-white-bis fullHeight">
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
  
  export default Home;