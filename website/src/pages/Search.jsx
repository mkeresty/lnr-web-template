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
          <div class="m-3 msearch">
            <input  
                      class="input dark-bg wh minput" type="text" placeholder="address or name"
                      onInput={(e) => {
                        setName(e.target.value)
                      }}/>  
                      <div class="sbut mr-2 ml-2 mb">
            <button class="button tagCount mr-1  is-outlined mb" onClick={getPerson}>Search profile</button>
            <button class="button tagCount ml-1 is-outlined mb" onClick={searchNames}>Search names</button>
            </div>
          </div>
          <br />
          
          <br/>
      <div class="columns is-multiline is-mobile mr-3 ml-3">
          <For each={names()}>{(item, i) =>
          <div class="column">
                <div onClick={()=>setRouteTo("Domain", item, "")} class="tile box is-vertical has-background-dark linagee-border has-text-white-bis fullHeight gr">
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