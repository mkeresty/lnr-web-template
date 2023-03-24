# lnr-web-template SolidJS
<p align="center">
  <img src="https://github.com/Linagee-Name-Registrar/Brand-Kit/blob/main/icon/svg/lnr_icon_box.svg" alt="LNR Logo" width=33% height=33%>
</p>

## Lets put dapps (websites) on the ethereum blockchain
This is a SolidJS template for putting .og websites 100% on chain, if you are interested in using a vanilla JS framework, check out (https://github.com/mkeresty/lnr-web-template-solidjs)

## How does this work?
This works by embedding website data into calldata on the Ethereum blockchain. To create a functional dapp, all the CSS, JS and HTML for the dapp is embedded into a single HTML file. This file is then gzipped and uploaded to the blockchain. Any item uploaded is called an asset.

Assets are stored on the blockchain as gzipped data and accessed by their transaction hash and the keccak256 hash of the uncompressed asset data.  To access the data directly, we use a long web address that looks like this
```
derp://0xa725844db15f47cfb979c3d71071b9bc58c8534289c391a89a7eb8787a5bec02/0xaed9ac8797981170d20879074b6b58c63d12092ad41f47eabd39896814de5197
```
## Why derp://
DERP is an acronym: Decentralized Ethereum Routing Protocol

## How are domains attached to assets?
Owners of .og domains can update routing information to map their domain name to an asset on the ethereum network. 

## Putting data onto ethereum expensive isn't this doing to be very expensive?
It would be if we didnt reuse code!  Since websites often use the same libraries, we can save alot of data by uploading reusable assets and accessing them.  Essentially we are turning calldata on ethereum into a CDN. 

## But how does that work in practice?  How much does it really cost?
As an example, I wanted to store material-icons on chain.  I'm sure there are more efficient ways to do this, but for simplicity, I used the css file here (https://fonts.googleapis.com/icon?family=Material+Icons) and embedded the .woff2 font as a base64 stream in the src property. The resulting file size was ~172kB. I compressed and uploaded this asset to the ethereum blockchain for 1,065,071 gas. Minting an ERC721 costs about 75kgas, so it costs about 14x an NFT mint to store material icons on the ethereum blockchain forever. The best part is, now anyone else can use this asset at no cost.
Right now, eth is $1500 and gas is 20gwei, it would cost 0.0213 eth ($35) to put this asset on chain right now
When eth was $4000 and gas was 100gwei it would have cost $450

## That doesn't seem very affordable why would anyone do this?
After the library assets are on chain, the websits can actually be quite small.  derpnation.og is a 100% decentralized trading marketplace that cost less than NEEDS UPDATE gas to upload, and then another 78,000 to create the route between derpnation.og and the asset.  For < NEEDSUPDATE gas, my web3 resume, NFT minting website and AMM/loan dapp is on chain forever.

Based on the figures above, the cost to deploy that right now is < $10!  Even when eth was 4k and gas was 100, that would still only cost $125

Consider the fact that .og domains have no renewal fees, and that you dont need to pay any monthly server costs!

## Okay that sounds pretty good, how are the assets reused?
Like I said, we are storing assets on eth and accessing them with URLs.  This allows us to do something like this

```
  <head>
  <!-- NOTE: These asset URLs are valid on sepolia testnet -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="UTF-8">
    <!-- jquery -->
    <script src="derp://0x90bdba8728333403f049f0ec54eaef43edae122c21dc88b3421140430ac39e65/0x7cec8efcc600aaa53decab9106bd97fcdec817a42fd0650c2f74531e5698153a"></script>
    <!-- bulma -->
    <link rel="stylesheet" href="derp://0xa725844db15f47cfb979c3d71071b9bc58c8534289c391a89a7eb8787a5bec02/0xaed9ac8797981170d20879074b6b58c63d12092ad41f47eabd39896814de5197">
    <!-- Material Icons-->
    <link rel="stylesheet" href="derp://0x669231f5909de3c83d88b16a2ba4951cbd3cf677ac3b5c81286213fe64dd3190/0x37589b02a0a8baecdf3115c0324eafc284d4e7f04be56f4d359d398a47208e46">

    <script type="importmap">
      {
        "imports": {
          "three": "derp://0xe90391a3ac35264a6ff9eec29049a6ee8341f6316487682b24c732a59dd6c84c/0x79db9d483a6155104d35f9871a2ad4fc322115a42ee09dea85fc3e2ed75660cf"
        }
      }
    </script>

  </head>
```

In this example, we are using jquery, bulma css, material icons and three.js. We only need to store a few hundred bytes on chain to access all of these libraries. (Because they have already been uploaded for you to use - *Thanks derp!*)

When lnr-web fetches your asset (single html file) it will go through and find the script/css tags the locate the assets on the blockchain, verify their integrity, and then import them, just like using a CDN.


# Getting Started
## Prerequisites

Ensure you have Node.js and NPM installed.

1. Navigate to where you want the repo to go
2. Clone the repo
   ```sh
   https://github.com/DerpHerpenstein/lnr-web-template.git
   ```
3. Install NPM packages (hardhat and static-server)
   ```sh
   npm install
   npm -g install static-server
   ```

## Launch the local server
You will need a local server running in order to use the template

   ```sh
   npx static-server
   ```

Open your web browser to 
```
http://localhost:9080/
```

Click the "Connect" Button, and then click "Load Local" to load the local website.

Open up your developer console in your browser.  You will see that the total size of this dapp is 1490kb, but the compressed size to put it on chain is 1.669kb.  That is because this page loads three.js, bulma.css, jquery, and material icons all from the blockchain. [Check lnr-web for more info](https://github.com/DerpHerpenstein/lnr-web)

This means that the total data to put on chain for this website is 1.669kb.  your looking at ~47k gas to upload this asset and another 78k to link it to your domain. For the cost of minting 2 NFTs, this terrible website can be on eth forever! lol

## the og object
Attached to the window is the og object.  This is very important because it allows your dapp to have access to web3 data.
- og.ethers  - Ethers, need I say more?
- og.lnr - The [lnr-ethers](https://github.com/Linagee-Name-Registrar/lnr-ethers) library, gives easy access to og normalization and minting/resolving/wrapping smart contracts
- og.lnrWeb - The [lnr-web](https://github.com/DerpHerpenstein/lnr-web) library, gives easy access to the lnr-web smart contract and helpers every aspect of making websites
- og.provider - Ethers Provider
- og.signer - Ethers Signer
- og.website - Information about the website that was loaded
- og.redirect(domain) - A function for navigating to other dapps

## the UI
Load Local - This will take website/index.html, website/index.js and website/style.css and compress them into a single HTML file and load it.
You should add a filename and a small description. Clicking Upload Asset will upload this website to the blockchain.
Note:  Open your web dev console, you will need the txHash and dataHash to attach your .og to this asset

Update Website - This button will update the website name to point at the data hash and the tx hash from above.  Ensure you put the data hash in the data has section and the tx hash in the tx hash section.  Ignore the website data section for now.

Update State - This is used when you want to attach a state to your website.  Imagine you are making a blog, it would be silly to upload the website every time.  You can design the website to use ethers to get all NewState events, decode the data and display the information as your wish

Upload Library - If you want to use a library that is not already on chain, you can upload it here.  Please name it appropriately
Note: Be VERY CAREFUL when it comes to using libraries uploaded by others.  People will upload malicious libraries, and it is up to you, the developer, to verify that they are what they say they are. We have uploaded a few libraries so you can get started quickly.

View Website - Load a website from the blockchain.  Try loading lnrforever.og or derpnation.og, these sites are 100% on chain.

## Build something
Your a dev, make something cool that uses nothing but libraries on chain and the eth blockchain.  We are excited to see what you come up with!


## Hardhat
Hardhat is very helpful because it allows you to easily fork mainnet and test your dapp locally without spending any eth. I use infura as a API endpoing, their free tier is sufficient for most basic stuff. 
[Forking Mainnet](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks)
1) Fork hardhat
2) Change your metamask network to point at the local hardhat instance (remember if you fork hardhat again your nonce will be wrong and you will have to reset your account on your local network with Metamask->Settings->Advances->Reset Account)
3) Test your dapp


<!-- CONTACT -->
## Contact

Derp Herpenstein - [@0xDerpNation](https://twitter.com/0xDerpNation)
