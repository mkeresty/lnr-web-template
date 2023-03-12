import styles from '../App.module.css';
import { createSignal, createEffect, onMount } from 'solid-js';
import { getName } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Header = () => {
    const [address, setAddress] = createSignal('Connect');
    const [primary, setPrimary] = createSignal(undefined);
    const [showNav, setShowNav] = createSignal(false)
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
        console.log("store: ",store())
    })

  
  
    const setRouteTo = async (route) => {
        setShowNav(false)
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
    

  
  
    return(<><nav class="navbar linagee z"  role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" onClick={()=>setRouteTo("Home")}>
        <svg width="112" height="28" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
	 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64"
	 style="enable-background:new 0 0 64 64;" xml:space="preserve">

<g id="Icon_00000083085568311264098930000009971497657372628140_">
	<path stroke="white" fill="white"  d="M27.279,51.644c-0.035,0.064-0.094,0.198,0.01,0.378c0.114,0.198,0.28,0.198,0.343,0.198l6.57,0.001
		l24.282-42.058c1.098-1.902,1.2-4.138,0.305-6.102c-1.108-2.433-3.597-3.94-6.271-3.94h-22.12v0.007
		c-1.642,0.068-3.035,1.347-3.108,3c-0.079,1.791,1.339,3.269,3.108,3.29v0.002h2.494L5.515,53.838
		c-1.249,2.163-1.209,4.759,0.12,6.895c1.237,1.989,3.461,3.148,5.804,3.148h37.524c1.617,0,3.035-1.184,3.212-2.791
		c0.21-1.9-1.272-3.508-3.13-3.508H11.313c-0.063,0-0.229,0-0.343-0.198c-0.114-0.198-0.031-0.342,0-0.396L40.146,6.419h12.541
		c0.063,0,0.229,0,0.343,0.198c0.114,0.198,0.031,0.342,0,0.396L27.279,51.644z"/>
</g>
</svg>
        {store}
      </a>
  
      <a onClick={()=>setShowNav(!showNav())} role="button" class="navbar-burger wh" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <Show when={showNav() == true}>
    <div class="navbar-menu is-active modalBg linagee-border">
    <a onClick={()=>setRouteTo("Home")} class="navbar-item wh mn">
          Home
        </a>
        <hr class="navbar-divider"/>
        <a onClick={()=>setRouteTo("Profile")} class="navbar-item wh mn">
          Profile
        </a>
        <hr class="navbar-divider"/>
        <a onClick={()=>setRouteTo("Search")} class="navbar-item wh mn">
              Search
            </a>
            <a onClick={()=>setRouteTo("Mint")} class="navbar-item wh mn">
              Mint
            </a>
            <hr class="navbar-divider"/>

            <a onClick={()=>setRouteTo("Create")} class="navbar-item wh mn">
              Create
            </a>
     
            <span  >
            <button onClick={connect} class="button tag tagCount">
          {primary() || address()}
      </button>
            </span>

</div>
</Show>
  
    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a onClick={()=>setRouteTo("Home")} class="navbar-item">
          Home
        </a>
        <a onClick={()=>setRouteTo("Profile")} class="navbar-item">
          Profile
        </a>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-item ">
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
          <a onClick={()=>setRouteTo("Create")} class="navbar-item">
            Create
          </a>
      </div>
          
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
          <button onClick={connect} class="button is-outlined m-3 name">
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
  <Show when={store() && store().route == "Home"}>
    <div class="bottom"></div>
  </Show>
  </>
  )
  }
  


export default Header;