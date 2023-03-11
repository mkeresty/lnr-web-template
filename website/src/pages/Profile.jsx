import styles from '../App.module.css';
import { createSignal, Show, onMount } from 'solid-js';
import { getAllNames, getName } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Profile = () =>{

    var og = window.parent.og;

    const [names, setNames] = createSignal([]);
    const [namesCount, setNamesCount] = createSignal(0);
    const [wrappedCount, setWrappedCount] = createSignal(0);
    const [primaryName, setPrimaryName] = createSignal('primary not set');
  
    const { store, setStore } = useGlobalContext();

    const handleCount = (array)=>{
        const id = "wrapped";
        var count = array.filter((obj) => obj.status === id).length;
        setWrappedCount(count);
    }
  
    const getNames = async () =>{
        setLoading(true);
      
        var n = await getName(store().profileAddress)
        if(n){
            setPrimaryName(n)
        }
      if(store().personData && store().profileAddress == store().personData.address){
        setLoading(true);
        setNames(store().personData.names);
        setNamesCount(store().personData.count)
        //setPrimaryName(store().userPrimary)
        setWrappedCount(store().personData.wrappedCount)
      
      }  
      else if((store().profileAddress).length > 0){
        setLoading(true);
        var repNames = await getAllNames((store().profileAddress));
     
        if(repNames.length > 1){
          setNames(repNames);
          setNamesCount(repNames.length);
          handleCount(repNames);
          //setPrimaryName(store().userPrimary)
          const prev = store()
          var toSet = {personData: {address: store().profileAddress, names: names(), count: namesCount(), wrappedCount: wrappedCount()}}
          setStore({...prev, ...toSet});
          setLoading(false)
          return
        }
        setLoading(false)
        return
      }
      setLoading(false)
      return
  
    }

    const setRouteTo = (route) => {
        const prev = store()
        var toSet = {route: route, lastRoute: prev.route}
        setStore({...prev, ...toSet});
    }

    const handleDomain = (item)=>{
     
        const prev = store()
        var toSet = {lastRoute: 'Profile',route: "Domain", domain: item}
        setStore({...prev, ...toSet});
    }

    const goBack = ()=>{
        const prev = store()
        setRouteTo(prev.lastRoute)
      }

      const setLoading = (bool) => {
        const prev = store()
        var toSet = {isLoading: bool}
        setStore({...prev, ...toSet});
    }

    const copyText = (t) =>{
        navigator.clipboard.writeText(t)
        return(setModal("Copied", 'success'))
    }

    
    const setModal = (message, type) => {
        setLoading(false)
        const prev = store()
        var toSet = {modal:{status: true, message: message, type: type}}
        setStore({...prev, ...toSet});
    }
  

 
  


  onMount(async () => {
    setLoading(true);
    await getNames();
    setLoading(false);
  });


      return(
        <div class="page"> 
        <div class="ml-4 spaceRow">
        <button class="button tagCount is-pulled-left" onClick={goBack}><span class="material-icons">arrow_back</span></button>
        </div>
            <div class="columns" >
                <div class="column ">
                    <div class="block  bw">
                        <div class="box lg profileCard">
                    <img class="profileL" src="https://linagee.vision/LNR_L_Icon_White.svg" width="40" height="12"/>
                        <h3 class="title is-3 wh profilePrimary">
                            {primaryName}
                        </h3>
                        </div>
                    </div>
                </div>
                <div class="column  centerColumn profileInfo">
                <div class="container p-4 pt-8 has-text-left">
                <div class="is-hidden-mobile spacer"></div>
                        <h4 class="title is-4 has-light-text wh">
                        {primaryName} <span onClick={()=>copyText(primaryName())} class="material-icons mIcon is-size-6">content_copy</span>
                        </h4>
                        <h6 class="subtitle is-6 has-light-text wh">
                            {store().profileAddress} <span onClick={()=>copyText(store().profileAddress)} class="material-icons mIcon is-size-6">content_copy</span>
                        </h6>
                        < br />
                        <div class="tags are-medium">
                        <span class="tag tagCount">
                            Total: {namesCount}
                        </span>
                        <span class="tag tagCount">
                            Unwrapped: {namesCount() - wrappedCount()}
                        </span>
                        <span class="tag tagCount">
                            Wrapped: {wrappedCount}
                        </span>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div class="block  bw">
            <div class="content p-4">
                <Show when={namesCount() > 0}>
                <table class="table is-transparent has-text-light tableStyle">
                    <thead >
                        <tr >
                        <th class="wh">Domain</th>
                        <th class="wh">Status</th>
                        <th class="wh">Normalized</th>
                        <th class="wh">Bytecode</th>
                        </tr>
                    </thead>
                    <tbody>
                    <For each={names()}>{(item, i) =>
                        <tr onClick={()=>handleDomain(item)} class="tableRow" id={item.bytes}>
                        <th   class="wh">{item.name}</th>
                        <th class="wh">{item.status}</th>
                        <th >
                            <Show
                            when={item.isValid == "true"}
                            fallback={<span class="tag is-danger ml-7 mr-7 has-text-white-bis">Invalid</span>}>
                                <span class="tag is-success ml-7 mr-7 has-text-white-bis">Valid</span>
                            </Show>
                        </th>
                        <th class="wh">{item.bytes} <span onClick={()=>copyText(item.bytes)} class="material-icons mIcon is-size-6">content_copy</span></th>
                        </tr>
            
      }</For>
      </tbody>
      </table>
      </Show>

            </div>
            </div>
        </div>
      )
}

export default Profile;