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
    <li class="is-active "><a>Upload Asset</a></li>
    <li><a>Update Website</a></li>
    <li><a>Update State</a></li>
    <li><a>Upload Library</a></li>
  </ul>
</div>
<div class="columns is-mobile">   

<div class="column is-half is-offset-one-quarter mt-6">
        <Show when={curTab() == "asset"}>
            <input  
            class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
            value={fileName() || "File name"}
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
            value={fileDesc() || "File description"}
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

            <Show>

                <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                value={fileName() || "File name"}
                onInput={(e) => {
                    setWebsiteName(e.target.value)
                }}/>   


                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                value={fileType() || "File type"}
                onInput={(e) => {
                    setWebsiteData(e.target.value)
                }}/>  
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                value={fileDesc() || "File description"}
                onInput={(e) => {
                    setWebsiteDataHash(e.target.value)
                }}/>  
                        <input  
                class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                value={fileData() || "File data"}
                onInput={(e) => {
                    setWebsiteTxHash(e.target.value)
                }}/>  
                <button class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                </Show>

                <Show>

                    <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                    value={fileName() || "File name"}
                    onInput={(e) => {
                        setWebsiteName(e.target.value)
                    }}/>   


                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                    value={fileType() || "File type"}
                    onInput={(e) => {
                        setWebsiteV(e.target.value)
                    }}/>  
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                    value={fileDesc() || "File description"}
                    onInput={(e) => {
                        setWebsiteState(e.target.value)
                    }}/>  
                    <button class="button is-outlined mb-3 ml-3 tagCount">Upload</button>
                    </Show>

                    <Show>

                    <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                    value={fileName() || "File name"}
                    onInput={(e) => {
                        setLibName(e.target.value)
                    }}/>   


                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                    value={fileType() || "File type"}
                    onInput={(e) => {
                        setLibDesc(e.target.value)
                    }}/>  
                            <input  
                    class="input dark-bg mb-4 wh spaceRow" type="text" placeholder="name.html"
                    value={fileDesc() || "File description"}
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