import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, onCleanup, batch, onMount } from 'solid-js';
import { render } from 'solid-js/web';
import { useGlobalContext } from '../GlobalContext/store';




const OldHome = () =>{


  onMount(() => {

    var scene3d = document.getElementById("canvas")

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    //document.body.appendChild( renderer.domElement );
    scene3d.appendChild(renderer.domElement);
  
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
  
    camera.position.z = 5;
  
    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    }
    animate();

  });


  
  return(
        <div class="rel">
        <br />
        <div class="columns is-mobile">  
          <div class="column is-10 is-offset-1 pb-10">
              <div class="card lg has-text-centered">
                <br/>
                <p class="title has-text-light">
                home.og
                </p>
                <br/>

              </div>
             
            </div>
            
          </div>
          <div class="canvasbg" id="canvas"></div>
      </div>
      )
}

export default OldHome;