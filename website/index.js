import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
// 	requestAnimationFrame( animate );
// 	renderer.render( scene, camera );
// }
// animate();


// let og = window.parent.og;

// async function derp(){
//   let walletAddress = await og.signer.getAddress();
//   console.log("log from chain: Wallet:" + walletAddress);
//   console.log(og);
//   console.log("UTF8 stuff 小馬, 昨夜のコンサートは最高でした جیم ذال sdf Д д Ж ж Ñ");
//   $("#test").html("Derp - Everything is awesome<br>" + walletAddress)
// }

// async function getTestState(){
//   try{   
//     let currentBlock = await og.provider.getBlockNumber();
//     let results = await og.lnrWeb.getWebsiteState("test.og",null,null,0,currentBlock);
//     console.log("Current State Updates");
//     for(let i=0; i<results.length; i++){
//       console.log(results[i]);
//     }
//   }
//   catch(e){
//       console.log(e);
//     }
//   }

// $(document).ready(function(){
//   derp();
//   getTestState();
// });
