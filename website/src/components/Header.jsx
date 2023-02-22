import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, createEffect, mergeProp, onMount } from 'solid-js';
import { nameLookup, getName } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Header = () => {
    const [address, setAddress] = createSignal('Connect');
    const [primary, setPrimary] = createSignal(undefined);
    const { store, setStore } = useGlobalContext();


    var og = window.parent.og;

    async function connect(){
      var walletAddress = await og.signer.getAddress();
      var name = await getName(walletAddress);
      const prev = store();
      if(walletAddress){
        var toSet = {userAddress: walletAddress, userPrimary: name};
        setStore({...prev, ...toSet});
        setAddress(walletAddress.slice(0,4)+'...'+walletAddress.slice(-4));
      }
      if(name){
        setPrimary(name)
      }
      return
    
    }

    createEffect(() => {
        console.log("effect",store())
    })

  
  
    const setRouteTo = async (route) => {
        const prev = store()
        var toSet = {route: route}
        if(route == "Profile"){
          var walletAddress = await og.signer.getAddress();
          var toSet = {route: route, profileAddress: walletAddress}
        }
        setStore({...prev, ...toSet});
    }

    onMount(async () => {
      await connect()
    });
    

  
  
    return(<><nav class="navbar linagee"  role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="https://linagee.vision">
        <img src="https://linagee.vision/LNR_L_Icon_White.svg" width="112" height="28"/>
        {store}
      </a>
  
      <a role="button" class="navbar-burger " aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
  
    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a onClick={()=>setRouteTo("Home")} class="navbar-item">
          Home
        </a>
        <a onClick={()=>setRouteTo("Profile")} class="navbar-item">
          Profile
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-item">
            Names
          </a>
  
          <div  class="navbar-dropdown">
          <a onClick={()=>setRouteTo("Search")} class="navbar-item">
              Search
            </a>
            <a onClick={()=>setRouteTo("Mint")} class="navbar-item">
              Mint
            </a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-item">
            Web
          </a>
  
          <div class="navbar-dropdown">
            <a class="navbar-item">
              Explore
            </a>
            <a class="navbar-item">
              Create
            </a>
          </div>
        </div>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-item">
            More
          </a>
  
          <div class="navbar-dropdown">
            <a class="navbar-item">
              About
            </a>
            <a class="navbar-item">
              Docs
            </a>
            <a class="navbar-item">
              History
            </a>
            <hr class="navbar-divider"/>
            <a class="navbar-item">
              Socials
            </a>
          </div>
        </div>
      </div>
          
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
          <button onClick={connect} class="button is-outlined m-3">
          {primary() || address()}
      </button>
  
          </div>
        </div>
      </div>
    </div>
  </nav>
  <Show when={store() && store().isLoading && store().isLoading == true}>
    <progress class="progress is-small is-primary" max="100">15%</progress>
  </Show>
  </>
  )
  }
  


export default Header;