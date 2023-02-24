import styles from '../App.module.css';
import { createSignal } from 'solid-js';
import { nameLookup, isNorm } from '../utils/nameUtils';
import { useGlobalContext } from '../GlobalContext/store';

const Create = () =>{
    var og = window.parent.og;
    const [name, setName] = createSignal('name.og');
    const [fileName, setFileName] = createSignal();
    const [fileType, setFileType] = createSignal();
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
            <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
            value={fileDesc()}
            onInput={(e) => {
                setFileName(e.target.value)
            }}/>   


                    <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
            value={fileType() || "File type"}
            onInput={(e) => {
                setFileType(e.target.value)
            }}/>  
                    <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
            value={fileDesc()}
            onInput={(e) => {
                setFileDesc(e.target.value)
            }}/>  
                    <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
            value={fileData() || "File data"}
            onInput={(e) => {
                setFileData(e.target.value)
            }}/>  
            <button class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
            </Show>

            <Show when={curTab() == "website"}>

                <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website name"
                value={fileDesc()}
                onInput={(e) => {
                    setWebsiteName(e.target.value)
                }}/>   


                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website data"
                value={fileDesc()}
                onInput={(e) => {
                    setWebsiteData(e.target.value)
                }}/>  
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website data hash"
                value={fileDesc()}
                onInput={(e) => {
                    setWebsiteDataHash(e.target.value)
                }}/>  
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website Tx hash"
                value={fileDesc()}
                onInput={(e) => {
                    setWebsiteTxHash(e.target.value)
                }}/>  
                <button class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                </Show>

                <Show when={curTab() == "state"}>

                    <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website name"
                    value={fileDesc()}
                    onInput={(e) => {
                        setWebsiteName(e.target.value)
                    }}/>   


                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website version"
                    value={fileType() || "File type"}
                    onInput={(e) => {
                        setWebsiteV(e.target.value)
                    }}/>  
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Website state"
                    value={fileDesc()}
                    onInput={(e) => {
                        setWebsiteState(e.target.value)
                    }}/>  
                    <button class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                    </Show>

                    <Show when={curTab() == "library"}>

                    <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Library Name"
                    value={fileDesc()}
                    onInput={(e) => {
                        setLibName(e.target.value)
                    }}/>   


                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Library description"
                    value={fileType() || "File type"}
                    onInput={(e) => {
                        setLibDesc(e.target.value)
                    }}/>  
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="Library cdn link"
                    value={fileDesc()}
                    onInput={(e) => {
                        setLibLink(e.target.value)
                    }}/>  
                    <button class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                    </Show>



            
</div>
</div>



  </div>
    )
  }

export default Create;