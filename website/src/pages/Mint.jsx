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
  
                    <div class="block  bw sm">
                        <div class="box lg profileCard">
                    <img class="profileL" src="https://linagee.vision/LNR_L_Icon_White.svg" width="40" height="12"/>
                        <h3 class="title is-3 wh profilePrimary">
                            {name}
                        </h3>
                        </div>
                    </div>
      </div>
  <div class="columns is-mobile">   

      <div class="column is-half is-offset-one-quarter mt-6">
          <div class="block has-text-centered">
              <h3 class="title is-3 has-text-light">Mint</h3>
                  <input  
                    class="input dark-bg wh mw" type="text" placeholder="name.og"
                    onInput={(e) => {
                      setName(e.target.value)
                    }}/>      
                    <button class="button is-outlined mb-3 ml-3 tagCount" onClick={mint}>Mint</button>
          </div>
      </div>
  </div>
  </div>
    )
  }

export default Mint;