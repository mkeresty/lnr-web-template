import styles from '../App.module.css';
import { createSignal } from 'solid-js';
import { nameLookup, isNorm } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Mint = () =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('name.og');
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

    const mint = async () => {
      setLoading(true);
      if(!isNorm(name())){
        var message = <>{name()} - not normalized</>
        return(setModal(message, "format"))
      }
      var checked = await og.lnr.owner(name());
      if(checked && checked!== false && checked[0]){
          var nameorAddress = await nameLookup(checked[0])
          var message = <>{name()} is owned by <a href={`https://etherscan.io/address/${checked[0]}`} target="_blank"> {nameorAddress || checked[0]}</a></>
          return(setModal(message, "warning"));
        }
      if(checked == null){
        try{
          var tx = await og.lnr.reserve(name());
          tx.wait().then(async (receipt) => {
              if(receipt && receipt.status == 1) {
                var message = <> {name()} minted! <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">View on Etherscan</a></>
                return(setModal(message, "success"));
              }
              if(receipt && receipt.status == 0){
                  return(setModal(oops, "warning"))
              }
          });
          } catch(e){
            return(setModal(oops, "warning"))
          }}  
      else{
          return(setModal(oops, "warning"))
      }};

    return(
      <div class="page">
  <br/>
  <div class="columns is-mobile cn">  
  <div class="column createPage mt-4">
    <div class="createForm">
                    <div class="block bw">
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
                            {name}
                        </h3>
                        </div>
                        </div>
                    </div>
                    </div>
      </div>
  <div class="columns is-mobile">   
      <div class="column createPage mt-3">
        <div class="createForm mb-4">
              <h3 class="title is-3 has-text-light">Mint</h3>
              <div class="m-3 msearch mmint">
                  <input  
                    class="input dark-bg wh mw" type="text" placeholder="name.og"
                    onInput={(e) => {
                      setName((e.target.value)+".og")
                    }}/>      
                    <div class="mb mr-2 ml-2">
                    <button class="button is-outlined tagCount mb" onClick={mint}>Mint</button>
                    </div>
          </div>
          </div>
      </div>
  </div>
  </div>
    )
  }

export default Mint;