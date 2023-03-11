
export async function nameLookup(address){
    var og = window.parent.og;
    var name = address;
    try{
        var name = await og.lnr.lookupAddress(address);
    } catch(error){

    }
    return(name);
}


export async function getCurrentNameStatus(name, bytes){
    var og = window.parent.og;
    var isValid = false;
    try{
        var isValid = og.lnr.isNormalizedBytes(bytes);

    } 
    catch(e){
    }


    var pure = await pureOwnerString(name);
    //console.log("hmmm")

    var resolver = await getPrimaryAddress(name);
    //console.log("primary resolver is ", resolver)
    var controller = await getController(bytes);

    if(pure && pure == "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7"){
        var waiting = await og.lnr.waitForWrap(name);
        //console.log("waiting is ", waiting)
        if(waiting && og.ethers.utils.isAddress(waiting)){
            return({name: name, bytes: bytes, owner: waiting, status: "transferred", primary: resolver, isValid: isValid, controller: controller})
        }
    }

    if(pure && pure !== "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7"){
        var waiting = await og.lnr.waitForWrap(name);
        if(waiting && og.ethers.utils.isAddress(waiting)){
            return({name: name, bytes: bytes, owner: waiting, status: "waiting", primary: resolver, isValid: isValid, controller: controller})
        }
    }

    var pureOwnerBytes = await pureOwner(bytes);

    if(pureOwnerBytes && pureOwnerBytes !== "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7"){
        return({name: name, bytes: bytes, owner: pureOwnerBytes, status: "unwrapped", primary: resolver, isValid: isValid, controller: controller})
    }
    if(pureOwnerBytes && pureOwnerBytes == "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7"){
        const curId = (await og.lnr.wrapperContract.nameToId(bytes)).toNumber();
        //console.log("curId is ", curId)
        if(curId && Number.isInteger(curId) && curId > 0 ){
            var wrappedOwner = await og.lnr.wrapperContract.ownerOf(curId)
            if(wrappedOwner && wrappedOwner !=="0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(wrappedOwner)){
                return({name: name, bytes: bytes, owner: wrappedOwner, status: "wrapped", primary: resolver, tokenId: curId, isValid: isValid, controller: controller})
            }
        }
    }
    if(pureOwnerBytes){
     
        var simpleName = await nameStatusTool(name);
    
        if(simpleName && simpleName[0] && og.ethers.utils.isAddress(simpleName[0])){

            return({name: name, bytes: bytes, owner: simpleName[0], status: simpleName[1], primary: resolver, isValid: isValid, controller: controller})
        }
    }
    return({name: name, bytes: bytes, owner: undefined, status: undefined, primary: resolver, isValid: isValid, controller: controller})
}







export function isNorm(name){
    var og = window.parent.og;
    try{
        var norm = og.lnr.isNormalizedName(name)
        if(norm){
            return(norm)
        }
        return(false)
    } catch(e){
    }
    return false
}

export async function pureOwner(bytes){
    var og = window.parent.og;
    try{
        var tryowner = await og.lnr.linageeContract.owner(bytes);
        if(og.ethers.utils.isAddress(tryowner)){   
         
            return(tryowner)
        }
    } catch(e){

    }
    return(false)
}

export async function pureOwnerString(domain){
    var og = window.parent.og;
    try{
        var tryowner = await og.lnr.linageeContract.owner(og.lnr.domainToBytes32(domain));
        if(og.ethers.utils.isAddress(tryowner)){   
           
            return(tryowner)
        }
    } catch(e){

    }
    return(false)
}


export async function isOwner(address, name){
    var og = window.parent.og;
    try{
        var owner = await og.lnr.owner(name)
    
        if(owner && owner[0]){
            if(address == owner[0]){
                return(true)
            }
        }
    }
    catch(e){

    }
    return(false)
}

export async function nameStatusTool(name){
    var og = window.parent.og;
  
    try{
    
        var owner = await og.lnr.owner(name)
  
        if(owner && owner[0] && owner[1]){
            return(owner)
        }
    }
    catch(e){
    }
    return(false)
}

export function isValidBytes(bytes){
    var og = window.parent.og;
    var isValid = false;
    var name = (og.lnr.bytes32ToString(bytes)).toString();
    try{
        var validName = og.lnr.isValidDomain(name+'.og'); 

        if (og.lnr.domainToBytes32(validName[1]) === bytes){
            var isValid = true
        }
     
    }
    catch(e){
       
    }
    return(isValid)
}

export async function resolveOrReturn(nameAddress){
    var og = window.parent.og;
    var name = false;
    if(og.ethers.utils.isAddress(nameAddress) == true){
        
        return(nameAddress)
    }
    else{
       
            try{
                var tempname = await og.lnr.resolveName(nameAddress);
               
                if(og.ethers.utils.isAddress(tempname)){
                    var name = tempname;
                }
            } catch(error){
                
            }

  
    return(name)
};
}

export async function resolve(nameAddress){
    var og = window.parent.og;
    var name = false;
    if(og.ethers.utils.isAddress(nameAddress) == true){
        return(name)
    }
    else{
       
            try{
                var tempname = await og.lnr.resolveName(nameAddress);
              
                if(og.ethers.utils.isAddress(tempname)){
                    var name = tempname;
                }
                if(tempname == null){
                    var name = tempname;
                }
            } catch(error){
             
            }

   
    return(name)
};
}

export async function getName(address){
    var og = window.parent.og;
    var name = undefined;
    if(og.ethers.utils.isAddress(address) == true){
        try{
            var name = await og.lnr.lookupAddress(address)
        }
        catch(e){
          
        }
        return(name)
    }
    return(name)
};

export async function isControllerFun(name, address){
    var og = window.parent.og;
    var res = false;
    if(og.ethers.utils.isAddress(address) == true){
        try{
            var res = await og.lnr.verifyIsNameOwner(name, address);
        }
        catch(e){
          
        }
        return(res)
    }
    return(res)
};

export async function getController(bytes){
    var og = window.parent.og;
    try {
        var lnres = await og.lnr.resolverContract.controller(bytes)
        if(lnres !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(lnres) == true){
            return(lnres)
        }
    }catch(error){
        return(undefined)
    }
    return(undefined)
}

export async function getPrimaryAddress(name){
    var og = window.parent.og;
    try {
        var lnres = await og.lnr.resolveName(name);
        if(lnres !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(lnres) == true){
            return(lnres)
        }
    }catch(error){
        return(undefined)
    }
    return(undefined)
}




export async function handleEthers(fn){
    try{
        var signature = await fn();
     

        return(signature)
    } catch(error){
        
        return(false)
    }

};

function getUniqueListBy(arr, key) {

    let result = arr.filter(
        (item, index) => index === arr.findIndex(
          other => item.bytes === other.bytes
        ));

    return(result)



    //return [...new Map(arr.map(item => [item[key], item])).values()]
}


export async function getAllNames(nameAddress){
    var og = window.parent.og;
    var address = await resolveOrReturn(nameAddress);
    
    if(address == false){
        return
    }
   
    var unwrapped = await getUnwrappedNamesv2(address);

    //console.log("unwrapped", unwrapped.length, unwrapped)
    
    var wrapped = await getWrappedNamesv2(address);

    //console.log("wrapped", wrapped.length, wrapped)
   

    var final = wrapped.concat(unwrapped)

    //console.log("final ", final.length, getUniqueListBy(final, 'bytes').length)

    return(getUniqueListBy(final, 'bytes'))

}

export async function getWrappedNamesv2(address){

    var og = window.parent.og;
    var ethers = window.parent.og.ethers;

    const tokenids =[];

    const balance = await og.lnr.wrapperContract.balanceOf(address);
    if(balance > 0){
        for(let i = 0; i < balance; i++){
            const curId = (await og.lnr.wrapperContract.tokenOfOwnerByIndex(address, i)).toString(); //HERE
            const curBytes = (await og.lnr.wrapperContract.idToName(curId)).toString();  //HERE
            var curName = undefined;
            try{
                var tc = (og.lnr.bytes32ToString(curBytes)).toString();
                if(tc){
                    var curName = tc
                }
            }
            catch(e){

            }
           
            var primary = undefined;
            var controller = undefined;

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
           
            }
            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "wrapped", owner: address, primary: primary, controller: controller});
        }
        return(tokenids)
    }
    return(tokenids)

}

// export async function getWrappedNames(address){

//     var og = window.parent.og;
//     var ethers = window.parent.og.ethers;

//     const tokenids =[];

//     const balance = await og.lnr.wrapperContract.balanceOf(address);
//     if(balance > 0){
//         for(let i = 0; i < balance; i++){
//             const curId = (await og.lnr.wrapperContract.tokenOfOwnerByIndex(address, i)).toString(); //HERE
         
//             const curBytes = (await og.lnr.wrapperContract.idToName(curId)).toString();  //HERE
//             var curName = undefined;
//             try{
//                 var curName = (og.lnr.bytes32ToString(curBytes)).toString();
              
//             }
//             catch(e){
//                 var curName = ((gData[i]).domaintoUtf8).toString();
//             }
           
//             var primary = await getPrimaryAddress(curName + '.og');
//             var controller = await getController(curBytes);

//             var isValid = false;
//             try{
//                 var isValid = og.lnr.isNormalizedBytes(curBytes)
//             } 
//             catch(e){
           
//             }
//             tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "wrapped", owner: address, primary: primary, controller: controller});
//         }
//         return(tokenids)
//     }
//     return(tokenids)
// }

//////////////////////////////////////////////////////////////////////////////////////////

export async function getUnwrappedNamesv2(address){
    var og = window.parent.og;
    var gData = await loopGraphv2(address);

    //console.log("gdfata length", gData.length);

    const tokenids =[];
    if(gData && gData.length > 0){

        
        for(let i = 0; i < gData.length; i++){
         
            const curId = undefined;
            const curBytes = ((gData[i]).domainBytecode).toString();
            
            var curName = undefined;
            try{
                var curName = (og.lnr.bytes32ToString(curBytes)).toString();
            }
            catch(e){
                var curName = ((gData[i]).domaintoUtf8)
            }

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
               
            }

            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "unwrapped", owner: address, primary: undefined, controller: undefined});

           
        }
        //console.log("tokenids v2: ", tokenids.length)
        return(tokenids)
    }

    return(tokenids)

}

// export async function getUnwrappedNames(address){
//     var og = window.parent.og;
//     var gData = await loopGraph(address);

//     //console.log("gdfata length", gData.length)
 
//     const tokenids =[];
//     if(gData && gData.length > 0){

        
//         for(let i = 0; i < gData.length; i++){
         
//             const curId = undefined;
//             const curBytes = ((gData[i]).domainBytecode).toString();
            
//             var curName = undefined;
//             try{
//                 var curName = (og.lnr.bytes32ToString(curBytes)).toString();
//             }
//             catch(e){
//                 var curName = ((gData[i]).domaintoUtf8)
//             }
         
//             var primary = await getPrimaryAddress(curName + '.og');
          
//             var controller = await getController(curBytes);

//             var isValid = false;
//             try{
//                 var isValid = og.lnr.isNormalizedBytes(curBytes)
//             } 
//             catch(e){
               
//             }
//             tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "unwrapped", owner: address, primary: primary, controller: controller});

           
//         }
//         //console.log("tokenids", tokenids.length)
//         return(tokenids)
//     }

//     return(tokenids)
// }

export async function searchUnwrappedNames(name){
    var og = window.parent.og;
    var search = await searchGraph(name);
    
    const tokenids =[];
    if(name.endsWith(".og")){
        var ogname = await pureOwner(og.lnr.domainToBytes32(name))
        if(ogname && ogname !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(ogname)){
            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(og.lnr.domainToBytes32(name))
            } 
            catch(e){
               
            }
            var primary = await getPrimaryAddress(name);
            var controller = await getController(og.lnr.domainToBytes32(name));
            tokenids.push({bytes: og.lnr.domainToBytes32(name), name: name, isValid: isValid.toString(), tokenId: undefined, status: "unwrapped", owner: ogname, primary: primary, controller: controller});
        }
    }  else{
        var ogname = await pureOwner(og.lnr.domainToBytes32(name+'.og'))
        if(ogname && ogname !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(ogname)){
            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(og.lnr.domainToBytes32(name+'.og'))
            } 
            catch(e){
                
            }
            var primary = await getPrimaryAddress(name+'.og');
            var controller = await getController(og.lnr.domainToBytes32(name+'.og'));
            tokenids.push({bytes: og.lnr.domainToBytes32(name+'.og'), name: name+'.og', isValid: isValid.toString(), tokenId: undefined, status: "unwrapped", owner: ogname, primary: primary, controller: controller});
        }
    }


    if(search && search['data']['domains'] ){
        var gData = search['data']['domains'];
        for(let i = 0; i < gData.length; i++){
         
            const curId = undefined;
            const curBytes = ((gData[i]).domainBytecode).toString();
            var address = undefined;
            try{
                var lnres = await og.lnr.linageeContract.owner(curBytes);
                if(lnres !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(lnres)){
                    var address = lnres;
                }
            } catch(e){
            
            }

         
            var curName = undefined;
            try{
                var curName = (og.lnr.bytes32ToString(curBytes)).toString();
            }
            catch(e){
                var curName = ((gData[i]).domaintoUtf8)
            }
           
            var primary = await getPrimaryAddress(curName + '.og');
            var controller = await getController(curBytes);

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
              
            }
            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "unwrapped", owner: address, primary: primary, controller: controller});

           
        }
        return(getUniqueListBy(tokenids, 'bytes'))
    }

    return(getUniqueListBy(tokenids, 'bytes'))
}

export async function loopGraphv2(address){
    const gdata=[]
    var offset = 0;
    for ( let i = 0; i<=5; i++) {
        //console.log("i = ", i, i*1000)
        var tokens = await theGraphv2(address, i*1000);

        if(tokens && tokens.errors == undefined){
            var resp = tokens['data']['domains'] 
            if(resp.length < 1){
                
                return(gdata)
            }
            offset += 1000
            gdata.push(...resp);
          
        } else{
            return(gdata)
        }
    }

    
    return(gdata)

}


async function loopGraph(address){
    const gdata=[]
    var offset = 0;
    for ( let i = 0; i>=0; i++) {
        var tokens = await theGraph(address, offset);

        if(tokens && tokens.errors == undefined){
            var resp = tokens['data']['domains'] 
            if(resp.length < 1){
                return(gdata)
            }
     
            var offset = resp.slice(-1)[0].registerIndex
            gdata.push(...resp);
          
        } else{
            return(gdata)
        }
    }

    
    return(gdata)

}

async function getUrl(address){
    var og = window.parent.og;

    var url = "https://api.studio.thegraph.com/query/42000/linagee/v0.0.1"

    try{
        const respState = await og.lnrWeb.getWebsiteState("lnrforever.og", address, null, 16748939, og.signer.provider.blockNumber )
       
        if((JSON.parse(respState[respState.length - 1].data)).data.graphUrl){
            var url = (JSON.parse(respState[respState.length - 1].data)).data.graphUrl
        }

    }
    catch(e){

    }
    return(url)

}

async function theGraphv2(address, offset){

    var og = window.parent.og;
    const dataState = await getUrl(address)

    const resp = await fetch(dataState, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
        query {
            domains(first: 1000 skip: ${offset} where: {owner_contains_nocase: "${address}"}) {
                domainUtf8,
                domainBytecode,
                owner{
                  address
                }
              }
          
      }`
        }),
      }).then((res)=>{
          return(res.json())
      })
  
      return(resp)

}

async function theGraph(address, offset){

    var og = window.parent.og;
    //const respState = await og.lnrWeb.getWebsiteState("lnrforever.og", address, null, 16748939, og.signer.provider.blockNumber )
    const dataState = await getUrl(address)

    const resp = await fetch(dataState, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
      query {
        domains(where: {owner_contains_nocase: "${address}", registerIndex_gt: ${offset}}) {
            domainUtf8,
            domainBytecode,
            registerIndex
          }
        
    }`
      }),
    }).then((res)=>{
        return(res.json())
    })

    return(resp)
}

async function searchGraph(name){

    var og = window.parent.og;
    //const respState = await og.lnrWeb.getWebsiteState("lnrforever.og", address, null, 16748939, og.signer.provider.blockNumber )
    const dataState = await getUrl()



    const resp = await fetch(dataState, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
        query {
          domains(where: {domainUtf8_contains_nocase: "${name}"}) {
              domainUtf8,
              domainBytecode,
              registerIndex
            }
          
      }`
        }),
      }).then((res)=>{
          return(res.json())
      })
  
      return(resp)
  }

  async function searchWrappedGraph(name){

    var og = window.parent.og;
    //const respState = await og.lnrWeb.getWebsiteState("lnrforever.og", address, null, 16748939, og.signer.provider.blockNumber )
    const dataState = await getUrl()



    const resp = await fetch(dataState, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
        query {
            wrappedDomains(where: {domain_: {
                domainUtf8_contains_nocase: "${name}"
              }}){
                    domain {
                  domainUtf8,
                  domainBytecode,
                  wrappedDomainOwner{
                    address
                  }
                }
              }
          
      }`
        }),
      }).then((res)=>{
          return(res.json())
      })
  
      return(resp)
  }

  export async function searchWrappedNames(name){
    var og = window.parent.og;
    var search = await searchWrappedGraph(name);

    //console.log("wrappedunparsed: ", search)
    
    const tokenids =[];
    if(name.endsWith(".og")){
        var ogname = await pureOwner(og.lnr.domainToBytes32(name))
        if(ogname && ogname !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(ogname)){
            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(og.lnr.domainToBytes32(name))
            } 
            catch(e){
               
            }
            var primary = await getPrimaryAddress(name);
            var controller = await getController(og.lnr.domainToBytes32(name));
            tokenids.push({bytes: og.lnr.domainToBytes32(name), name: name, isValid: isValid.toString(), tokenId: undefined, status: "unwrapped", owner: ogname, primary: primary, controller: controller});
        }
    }  else{
        var ogname = await pureOwner(og.lnr.domainToBytes32(name+'.og'))
        if(ogname && ogname !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(ogname)){
            var isValid = false;
            try{
                //console.log("im here")
                var isValid = og.lnr.isNormalizedBytes(og.lnr.domainToBytes32(name+'.og'))
                
            } 
            catch(e){
                
            }
            var primary = await getPrimaryAddress(name+'.og');
            var controller = await getController(og.lnr.domainToBytes32(name+'.og'));
            tokenids.push({bytes: og.lnr.domainToBytes32(name+'.og'), name: name+'.og', isValid: isValid.toString(), tokenId: undefined, status: "unwrapped", owner: ogname, primary: primary, controller: controller});
        }
    }


    if(search && search['data']['wrappedDomains'] ){
        var gData = search['data']['wrappedDomains'];
        for(let i = 0; i < gData.length; i++){
         
            var curId = undefined;
            const curBytes = ((gData[i]).domain.domainBytecode).toString();
            var address = ((gData[i]).domain.wrappedDomainOwner.address).toString();

            try{
                var tmpid = await og.lnr.wrapperContract.nameToId(curBytes)
                if(tmpid && tmp !== 0){
                    var curId = tmpid
                }
            }
            catch(e){

            }
            var curName = undefined;
            try{
                var curName = (og.lnr.bytes32ToString(curBytes)).toString();
            }
            catch(e){
                var curName = ((gData[i]).domain.domaintoUtf8)
            }
           
            var primary = await getPrimaryAddress(curName + '.og');
            var controller = await getController(curBytes);

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
              
            }
            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "wrapped", owner: address, primary: primary, controller: controller});

           
        }
        return(getUniqueListBy(tokenids, 'bytes'))
    }

    return(getUniqueListBy(tokenids, 'bytes'))
}


export async function searchAllNames(name){

    var unwrapped = await searchUnwrappedNames(name);
    //console.log("unwrapped is", unwrapped)
    
    var wrapped = await searchWrappedNames(name);

    //console.log("wrapped is", wrapped)
   

    var final = wrapped.concat(unwrapped)

    return(getUniqueListBy(final, 'bytes'))

}