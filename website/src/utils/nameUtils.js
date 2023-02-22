
export async function nameLookup(address){
    var og = window.parent.og;
    var name = address;
    try{
        var name = await og.lnr.lookupAddress(address);
    } catch(error){
        //console.log(error)
    }
    return(name);
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
            console.log("retuning owen", tryowner)
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
            console.log("retuning owen", tryowner)
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
        console.log("owner is2222222", owner)
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
        console.log("UGH")
        var owner = await og.lnr.owner(name)
        console.log("owner is", owner)
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
        //console.log(validName[1])
        //console.log(og.lnr.domainToBytes32(validName[1]));
        //console.log(bytes)
        if (og.lnr.domainToBytes32(validName[1]) === bytes){
            var isValid = true
        }
        //console.log("valid", isValid)
    }
    catch(e){
        //console.log(e)
    }
    return(isValid)
}

export async function resolveOrReturn(nameAddress){
    var og = window.parent.og;
    var name = false;
    if(og.ethers.utils.isAddress(nameAddress) == true){
        //console.log("true address", nameAddress)
        return(nameAddress)
    }
    else{
        //console.log("why in here")
            try{
                var tempname = await og.lnr.resolveName(nameAddress);
                //console.log(tempname);
                if(og.ethers.utils.isAddress(tempname)){
                    var name = tempname;
                }
            } catch(error){
                //console.log(error)
            }

    //console.log("returning", name)
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
        //console.log("why in here")
            try{
                var tempname = await og.lnr.resolveName(nameAddress);
                //console.log(tempname);
                if(og.ethers.utils.isAddress(tempname)){
                    var name = tempname;
                }
                if(tempname == null){
                    var name = tempname;
                }
            } catch(error){
                //console.log(error)
            }

    //console.log("returning", name)
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
            ////console.log(e)
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
            ////console.log(e)
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
        console.log(signature, "sig")

        return(signature)
    } catch(error){
        //console.log(error)
        return(false)
    }

};

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}


export async function getAllNames(nameAddress){
    var og = window.parent.og;
    var address = await resolveOrReturn(nameAddress);
    //console.log("address", address)
    if(address == false){
        return
    }
    //console.log("getting")
    var unwrapped = await getUnwrappedNames(address);
    //console.log(unwrapped)
    var wrapped = await getWrappedNames(address);
    //console.log(wrapped)

    var final = unwrapped.concat(wrapped)

    return(getUniqueListBy(final, 'bytes'))

}

export async function getWrappedNames(address){


    //----------WILL NEED RETOOLING TO WORK ON MAIN---------
    //------------USE lnr.og.wrapperContract.<function> INSTEAD OF contract

    var og = window.parent.og;
    var ethers = window.parent.og.ethers;
    const provider = new ethers.providers.InfuraProvider(
        "mainnet",
        "5b26585dfc17437da190dd2117648295"
      );



    const wrapperAddress = "0x2Cc8342d7c8BFf5A213eb2cdE39DE9a59b3461A7";
    const abi = [{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pairId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bytes32","name":"namer","type":"bytes32"}],"name":"Unwrapped","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"pairId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bytes32","name":"namer","type":"bytes32"}],"name":"Wrapped","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"changeProxyAvail","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"changeWrapEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_name","type":"bytes32"}],"name":"createWrapper","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"nameId","type":"bytes32"}],"name":"getNameOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"idToName","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nameBytes","outputs":[{"internalType":"contract Linagee","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"nameToId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"address","name":"_param2","type":"address"},{"internalType":"bool","name":"_param3","type":"bool"}],"name":"proxySetAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"proxySetContent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"address","name":"_param2","type":"address"}],"name":"proxySetSubRegistrar","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"unwrap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"waitForWrap","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_name","type":"bytes32"}],"name":"wrap","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    const contract = new ethers.Contract(wrapperAddress, abi, provider);

    const balance = (await contract.balanceOf(address)).toString(); //HERE
    console.log("balance is", balance)
    const tokenids =[];
    console.log("tokenis", tokenids)
    if(balance > 0){
        for(let i = 0; i < balance; i++){
            const curId = (await contract.tokenOfOwnerByIndex(address, i)).toString(); //HERE
            console.log("curid is", curId)
            const curBytes = (await contract.idToName(curId)).toString();  //HERE
            var curName = undefined;
            try{
                var curName = (og.lnr.bytes32ToString(curBytes)).toString();
                console.log(curName, "cyrr")
            }
            catch(e){
                var curName = ((gData[i]).domaintoUtf8).toString();
            }
            //console.log(curName);
            var primary = await getPrimaryAddress(curName + '.og');
            var controller = await getController(curBytes);

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
                //console.log(e)
            }
            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "wrapped", owner: address, primary: primary, controller: controller});
        }
        return(tokenids)
    }
    return(tokenids)
}

//////////////////////////////////////////////////////////////////////////////////////////

export async function getUnwrappedNames(address){
    var og = window.parent.og;
    var gData = await loopGraph(address);
    //console.log("tokensunwrapped", gData)
    const tokenids =[];
    if(gData && gData.length > 0){

        
        for(let i = 0; i < gData.length; i++){
            //console.log(gData[i])
            const curId = undefined;
            const curBytes = ((gData[i]).domainBytecode).toString();
            //console.log(curBytes)
            var curName = undefined;
            try{
                var curName = (og.lnr.bytes32ToString(curBytes)).toString();
            }
            catch(e){
                var curName = ((gData[i]).domaintoUtf8)
            }
            //console.log(curName);
            var primary = await getPrimaryAddress(curName + '.og');
            console.log("primary is", primary)
            var controller = await getController(curBytes);

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
                //console.log(e)
            }
            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "unwrapped", owner: address, primary: primary, controller: controller});

           
        }
        return(tokenids)
    }

    return(tokenids)
}

export async function searchUnwrappedNames(name){
    var og = window.parent.og;
    var search = await searchGraph(name);
    //console.log("tokensunwrapped", gData)
    const tokenids =[];
    if(name.endsWith(".og")){
        var ogname = await pureOwner(og.lnr.domainToBytes32(name))
        if(ogname && ogname !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(ogname)){
            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(og.lnr.domainToBytes32(name))
            } 
            catch(e){
                //console.log(e)
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
                //console.log(e)
            }
            var primary = await getPrimaryAddress(name+'.og');
            var controller = await getController(og.lnr.domainToBytes32(name+'.og'));
            tokenids.push({bytes: og.lnr.domainToBytes32(name+'.og'), name: name+'.og', isValid: isValid.toString(), tokenId: undefined, status: "unwrapped", owner: ogname, primary: primary, controller: controller});
        }
    }


    if(search && search['data']['domains'] ){
        var gData = search['data']['domains'];
        for(let i = 0; i < gData.length; i++){
            //console.log(gData[i])
            const curId = undefined;
            const curBytes = ((gData[i]).domainBytecode).toString();
            var address = undefined;
            try{
                var lnres = await og.lnr.linageeContract.owner(curBytes);
                if(lnres !== "0x0000000000000000000000000000000000000000" && og.ethers.utils.isAddress(lnres)){
                    var address = lnres;
                }
            } catch(e){
                console.log(e)
            }

            //console.log(curBytes)
            var curName = undefined;
            try{
                var curName = (og.lnr.bytes32ToString(curBytes)).toString();
            }
            catch(e){
                var curName = ((gData[i]).domaintoUtf8)
            }
            //console.log(curName);
            var primary = await getPrimaryAddress(curName + '.og');
            var controller = await getController(curBytes);

            var isValid = false;
            try{
                var isValid = og.lnr.isNormalizedBytes(curBytes)
            } 
            catch(e){
                //console.log(e)
            }
            tokenids.push({bytes: curBytes, name: curName+'.og', isValid: isValid.toString(), tokenId: curId, status: "unwrapped", owner: address, primary: primary, controller: controller});

           
        }
        return(tokenids)
    }

    return(tokenids)
}

async function loopGraph(address){
    const gdata=[]
    var offset = 0;
    for ( let i = 0; i>=0; i++) {
        var tokens = await theGraph(address, offset);
        console.log(i*100)
        if(tokens && tokens.errors == undefined){
            var resp = tokens['data']['domains'] 
            if(resp.length < 1){
                return(gdata)
            }
            console.log(resp)
            console.log('resppp', resp.slice(-1)[0].registerIndex)
            var offset = resp.slice(-1)[0].registerIndex
            console.log(offset)
            gdata.push(...resp);
           //console.log(gdata)
        } else{
            return(gdata)
        }
    }
    return(gdata)

}

async function theGraph(address, offset){

    const resp = await fetch(`https://api.studio.thegraph.com/query/42000/linagee/v0.0.1`, {
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
    const resp = await fetch(`https://api.studio.thegraph.com/query/42000/linagee/v0.0.1`, {
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
