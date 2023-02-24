import styles from '../App.module.css';
import { createSignal } from 'solid-js';
import { nameLookup, isNorm } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Create = () =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('name.og');
    const [fileName, setFileName] = createSignal();
    const [fileType, setFileType] = createSignal(JSON.stringify({"content-type": "text/html"}));
    const [fileDesc, setFileDesc] = createSignal();
    const [fileData, setFileData] = createSignal();

    const [websiteName, setWebsiteName] = createSignal();
    const [websiteData, setWebsiteData] = createSignal();
    const [websiteDataHash, setWebsiteDataHash] = createSignal();
    const [websiteTxHash, setWebsiteTxHash] = createSignal();

    const [websiteV, setWebsiteV] = createSignal();
    const [websiteState, setWebsiteState] = createSignal();

    const [libName, setLibName] = createSignal();
    const [libDesc, setLibDesc] = createSignal();
    const [libLink, setLibLink] = createSignal();

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
  

    async function uploadNewFile(){
        setLoading(true)
        try{
            var tx = await og.lnr.uploadNewFile(fileName(), fileType(), fileDesc(), fileData());
            tx.wait().then(async (receipt) => {
                if(receipt && receipt.status == 1) {
                  var uncompressedKeccak256 = og.ethers.utils.keccak256(ethers.utils.toUtf8Bytes(fileData()));
                  var message = <>Asset Uploaded <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">View on Etherscan</a><br />derp://{tx.hash}/{uncompressedKeccak256} </>
                  return(setModal(message, "success"));
                }
                if(receipt && receipt.status == 0){
                    return(setModal(oops, "warning"))
                }
            });
            } catch(e){
              return(setModal(oops, "warning"))
            }
    }

    async function updateWebsite(){
        setLoading(true)
        try{
            var tx = await og.lnr.updateWebsite(websiteName(), websiteDataHash(), websiteTxHash(), websiteData());
            tx.wait().then(async (receipt) => {
                if(receipt && receipt.status == 1) {
                  var message = <>Website updated <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">View on Etherscan</a></>
                  return(setModal(message, "success"));
                }
                if(receipt && receipt.status == 0){
                    return(setModal(oops, "warning"))
                }
            });
            } catch(e){
              return(setModal(oops, "warning"))
            }
    }

    async function updateState(){
        setLoading(true)
        try{
            var tx = await og.lnr.updateState(websiteName(), websiteV(), websiteState());
            tx.wait().then(async (receipt) => {
                if(receipt && receipt.status == 1) {
                  var message = <>Website state updated <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">View on Etherscan</a></>
                  return(setModal(message, "success"));
                }
                if(receipt && receipt.status == 0){
                    return(setModal(oops, "warning"))
                }
            });
            } catch(e){
              return(setModal(oops, "warning"))
            }
    }

    async function uploadLibrary(){
        setLoading(true)
        var libraryText = await fetch(formData.get('libraryLink'));
        let headers = libraryText.headers;
        let outputHeaders = {};
        headers.forEach(function(value,key){
          if(key === "content-type")
            outputHeaders[key] = value;
        });
        var libraryText = await libraryText.text();
        try{
            var tx = await og.lnr.uploadNewFile(libName(), JSON.stringify(outputHeaders), libDesc(), libraryText);
            tx.wait().then(async (receipt) => {
                if(receipt && receipt.status == 1) {
                  var uncompressedKeccak256 = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(libraryText));
                  var message = <>Website state updated <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">View on Etherscan</a><br />derp://{tx.hash}/{uncompressedKeccak256}</>
                  return(setModal(message, "success"));
                }
                if(receipt && receipt.status == 0){
                    return(setModal(oops, "warning"))
                }
            });
            } catch(e){
              return(setModal(oops, "warning"))
            }
    }















    const oops = <>Oops something went wrong</>;
    const { store, setStore } = useGlobalContext();

    const [curTab, setcurTab] = createSignal("asset")


      //classList={{"modal": true , "is-active":wrapperModal()}}

    return(
      <div class="page">
<div class="tabs is-primary is-centered">
  <ul>
    <li onClick={()=>setcurTab("asset")} classList={{"is-active":curTab() == "asset"}}><a>Upload Asset</a></li>
    <li onClick={()=>setcurTab("website")} classList={{"is-active":curTab() == "website"}}><a>Update Website</a></li>
    <li onClick={()=>setcurTab("state")} classList={{"is-active":curTab() == "state"}}><a>Update State</a></li>
    <li onClick={()=>setcurTab("library")} classList={{"is-active":curTab() == "library"}}><a>Upload Library</a></li>
  </ul>
</div>
<div class="columns is-mobile">   
<div class="column is-half is-offset-one-quarter mt-6">
        <Show when={curTab() == "asset"}>
        <h6 class="subtitle is-6 wh">File name</h6>
            <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" 
            onInput={(e) => {
                setFileName(e.target.value)
            }}/>   

            <h6 class="subtitle is-6 wh">File type</h6>
                    <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" 
            value={fileType()}
            onInput={(e) => {
                setFileType(e.target.value)
            }}/>  
            <h6 class="subtitle is-6 wh">File description</h6>
                    <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" 
            onInput={(e) => {
                setFileDesc(e.target.value)
            }}/>  
            <h6 class="subtitle is-6 wh">File data</h6>
                    <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" 
            onInput={(e) => {
                setFileData(e.target.value)
            }}/>  
            <button onClick={uploadNewFile} class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
            </Show>

            <Show when={curTab() == "website"}>
            <h6 class="subtitle is-6 wh">Website name</h6>
                <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" 
            
                onInput={(e) => {
                    setWebsiteName(e.target.value)
                }}/>   

                <h6 class="subtitle is-6 wh">Website data</h6>
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" 
           
                onInput={(e) => {
                    setWebsiteData(e.target.value)
                }}/>  
                <h6 class="subtitle is-6 wh">Website data hash</h6>
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" 
          
                onInput={(e) => {
                    setWebsiteDataHash(e.target.value)
                }}/>  
                <h6 class="subtitle is-6 wh">Website tx hash</h6>
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text"

                onInput={(e) => {
                    setWebsiteTxHash(e.target.value)
                }}/>  
                <button onClick={updateWebsite} class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                </Show>

                <Show when={curTab() == "state"}>
                <h6 class="subtitle is-6 wh">Website name</h6>
                    <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" 
           
                    onInput={(e) => {
                        setWebsiteName(e.target.value)
                    }}/>   
                    <h6 class="subtitle is-6 wh">Website version</h6>
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="If unsure enter 0"
                 
                    onInput={(e) => {
                        setWebsiteV(e.target.value)
                    }}/>  
                    <h6 class="subtitle is-6 wh">Website state data (JSON)</h6>
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text"
                   
                    onInput={(e) => {
                        setWebsiteState(e.target.value)
                    }}/>  
                    <button onClick={updateState} class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                    </Show>

                    <Show when={curTab() == "library"}>
                    <h6 class="subtitle is-6 wh">Library name</h6>

                    <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" 
                
                    onInput={(e) => {
                        setLibName(e.target.value)
                    }}/>   
                    <h6 class="subtitle is-6 wh">Library description</h6>


                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text"
              
                    onInput={(e) => {
                        setLibDesc(e.target.value)
                    }}/>  
                    <h6 class="subtitle is-6 wh">Library cdn link</h6>
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text"
            
                    onInput={(e) => {
                        setLibLink(e.target.value)
                    }}/>  
                    <button onClick={uploadLibrary} class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                    </Show>



            
</div>
</div>



  </div>
    )
  }

export default Create;