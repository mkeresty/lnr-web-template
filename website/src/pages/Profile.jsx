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
                <div class="column bc">
                    <div class="block  bw">
                        <div class="box lg profileCard">
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
            <div class="content p-4 scroll">
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
                        <th   class="wh ">{item.name}</th>
                        <th class="wh">{item.status}</th>
                        <th >
                            <Show
                            when={item.isValid == "true"}
                            fallback={<span class="tag is-danger ml-7 mr-7 has-text-white-bis">Invalid</span>}>
                                <span class="tag is-success ml-7 mr-7 has-text-white-bis">Valid</span>
                            </Show>
                        </th>
                        <th class="wh has-text-right">{item.bytes} <span onClick={()=>copyText(item.bytes)} class="material-icons mIcon is-size-6">content_copy</span></th>
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