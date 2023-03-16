import styles from '../App.module.css';
import { createSignal, onMount, Show, For } from 'solid-js';
import { resolve, resolveOrReturn, searchAllNames } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';


const Search = () => {
  var og = window.parent.og;
  const [name, setName] = createSignal('');
  const [names, setNames] = createSignal('');

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


  const getPerson = async () =>{
    setLoading(true)
    var check = await resolveOrReturn(name());
    if(og.ethers.utils.isAddress(check)){
        await setRouteTo("Profile", name(), check);
        setLoading(false)
        return
    }
    if(!name().endsWith(".og")){
        var message = <>Name must end in .og</>
        return(setModal(message, "format"))
    }
    var resname = await resolve(name())
    if(og.ethers.utils.isAddress(resname)){
        setLoading(false)
        await setRouteTo("Profile", name(), resname);
        return
    }
    if(resname == null){
        var message = <>{name()} - No resolver set</>
        return(setModal(message, "format"))
    }
    var message = <>Oops something went wrong</>;
    return(setModal(message, "warning"))

  }

  const searchNames = async()=>{
    setLoading(true)
    var res = await searchAllNames(name());
    if(res.length > 0){
        setNames(res);
        const prev = store()
        var toSet = {searchData: {name: name(), names: names()}}
        setLoading(false)
        setStore({...prev, ...toSet});
    }
    setLoading(false)
  }


  const setRouteTo = async (route, item, profileAddress) => {
    const prev = store()
    var toSet = {route: route}
    if(route == "Domain"){
      var toSet = {lastRoute: store().route, route: route, domain: item}
    }
    if(route == "Profile"){
      var toSet = {lastRoute: store().route, route: route, domain: item, profileAddress: profileAddress }
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
          <div class="m-3 ml-5 mr-5 msearch">
            <input  
                      class="input dark-bg wh minput" type="text" placeholder="address or name"
                      onInput={(e) => {
                        setName(e.target.value)
                      }}/>  
                      <div class="sbut ml-2 mb">
            <button class="button tagCount mr-1  is-outlined mb" onClick={getPerson}>Search profile</button>
            <button class="button tagCount ml-1 is-outlined mb" onClick={searchNames}>Search names</button>
            </div>
          </div>
          <br />
          
          <br/>

          {/* classList={{"box tile  gr bm--card-equal-height": true , "lg":(item.isValid == "true"), "bd":(item.isValid == "false")} */}
      <div class="columns is-multiline is-mobile mr-3 ml-3">
          <For each={names()}>{(item, i) =>
                    <div class="column is-one-third-tablet is-one-quarter-desktop is-one-sixth-fullhd is-full-mobile is-one-fifth-widescreen">
          <div onClick={()=>setRouteTo("Domain", item, "")} classList={{"bm--card-equal-height": true, "gr": true,"box": true, "tile": true, "lg":item.isValid == "true", "bd":item.isValid == "false"}} >
          <svg class="searchL" width="112" height="28" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
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
          <h3 class="title is-3 wh profilePrimary">
              {item.name}
          </h3>
          </div>
                </div>





          //                         <div class="lg profileCard  gr bm--card-equal-height">
          //                         <svg class="profileL" width="112" height="28" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
          //    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 64 64"
          //    style="enable-background:new 0 0 64 64;" xml:space="preserve">
          
          // <g id="Icon_00000083085568311264098930000009971497657372628140_">
          //   <path stroke="white" fill="white"  d="M27.279,51.644c-0.035,0.064-0.094,0.198,0.01,0.378c0.114,0.198,0.28,0.198,0.343,0.198l6.57,0.001
          //     l24.282-42.058c1.098-1.902,1.2-4.138,0.305-6.102c-1.108-2.433-3.597-3.94-6.271-3.94h-22.12v0.007
          //     c-1.642,0.068-3.035,1.347-3.108,3c-0.079,1.791,1.339,3.269,3.108,3.29v0.002h2.494L5.515,53.838
          //     c-1.249,2.163-1.209,4.759,0.12,6.895c1.237,1.989,3.461,3.148,5.804,3.148h37.524c1.617,0,3.035-1.184,3.212-2.791
          //     c0.21-1.9-1.272-3.508-3.13-3.508H11.313c-0.063,0-0.229,0-0.343-0.198c-0.114-0.198-0.031-0.342,0-0.396L40.146,6.419h12.541
          //     c0.063,0,0.229,0,0.343,0.198c0.114,0.198,0.031,0.342,0,0.396L27.279,51.644z"/>
          // </g>
          // </svg>
          //                         <h3 class="title is-3 wh profilePrimary">
          //                             {item.name}
          //                         </h3>
          //                         </div>
          // <div class="column">
          //       <div onClick={()=>setRouteTo("Domain", item, "")} class="tile box is-vertical linagee-border has-text-white-bis fullHeight gr darkSecondary searchBox bm--card-equal-height">
          //         <h6 class="title is-4 has-text-white-bis">{item.name}</h6>

          //         <div class="searchStats centerColumn">
          //         <h7 class="title is-7 has-text-white-bis">{item.status}</h7>
                
          //       <Show
          //         when={item.isValid == "true"}
          //         fallback={
          //           <span class="tag is-danger ml-7 mr-7 has-text-white-bis searchTag">Invalid</span>
          //         }
          //       >
          //         <span class="tag is-success ml-7 mr-7 has-text-white-bis searchTag">Valid</span>
          //       </Show>
          //       </div>
          //       </div>
          //   </div>
       
      }</For>

</div>
      

      </div>
    )
  }
  
  export default Search;