import styles from '../App.module.css';
import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js'
import { createSignal, onCleanup, batch, onMount } from 'solid-js';
import { render } from 'solid-js/web';
import { useGlobalContext } from '../GlobalContext/store';



const Home = () =>{


  onMount(() => {
    var mouseX = 0;
    var mouseY = 0;
    var degrees = 10;
    var power = 1;
    var angleRad = degrees * Math.PI / 120;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;


    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    function onDocumentMouseMove(event) {

      mouseX = ( event.clientX - windowHalfX ) / 100;
      mouseY = ( event.clientY - windowHalfY ) / 100;

  }



    var scene3d = document.getElementById("canvas")

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color("#a89be1");
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);
    
    //document.body.appendChild( renderer.domElement );
    scene3d.appendChild(renderer.domElement);
  
    // const geometry = new THREE.SphereGeometry( 1, 1, 3 );
    // const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
  
    camera.position.z = 5;
  

    function addLighting(scene) {

      
  var ambientLight = new THREE.AmbientLight(0x999999 );
  scene.add(ambientLight);
  
  var lights = [];
lights[0] = new THREE.DirectionalLight( 0xffffff, 1 );
lights[0].position.set( 1, 0, 0 );
lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
lights[1].position.set( 0.75, 1, 0.5 );
lights[2] = new THREE.DirectionalLight( 0x8200C9, 1 );
lights[2].position.set( -0.75, -1, 0.5 );
scene.add( lights[0] );
scene.add( lights[1] );
scene.add( lights[2] );



      // let color = 0xffffff;
      // let intensity = 1;
      // let light = new THREE.DirectionalLight(color, intensity);
      // light.position.set(0, -10, 0);
      // light.target.position.set(-5, -2, -5);
      // scene.add(light);
      // scene.add(light.target);
      // var intensity2=3
      // let light2 = new THREE.PointLight("pink", intensity2)
      // light2.position.set(-10, 7, 0)
      // scene.add(light2);
      // scene.add(light2.target);
      // var intensity3=2
      // let light3 = new THREE.DirectionalLight(0x7bd5d8, intensity3)
      // light3.position.set(5, 15, 15)
      // scene.add(light3);
      // scene.add(light3.target);

      // var light4 = new THREE.AmbientLight(0xffffff, .5);
      // // var intensity4 = 5;
      // // let light4 = new THREE.PointLight(0xFFFFFF,intensity4)
      // // light4.position.set(15, 0, 0)
      // scene.add(light4);
      // scene.add(light4.target);

      // let light5 = new THREE.SpotLight(0xffffff)
      // light5.position.set(50, 50, -30)
      // light5.castShadow = true; 
      // scene.add(light5);
      // scene.add(light5.target);

    }
    addLighting(scene);

    // function addSphere(scene) {
    //   let geometry = new THREE.SphereGeometry( .5, 100,100);
    //   let material = new THREE.MeshStandardMaterial({color: 0xf0f4f5, roughness: 0});
    //   let sphere = new THREE.Mesh( geometry, material );
    //   sphere.position.set(1, 2, 0);
    //   sphere.name = 'my-sphere';
    //   scene.add( sphere );

    //   requestAnimationFrame( animate );
    // }
    //addSphere(scene);
    var spheres = [];
    var geometry2 = new THREE.SphereGeometry( 0.1, 32, 16 );
    let material2 = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#ffffff').convertSRGBToLinear(),
      roughness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0,
      specular: 0x050505,
      shininess: 100
    })

    for ( var i = 0; i < 100; i ++ ) {

      var mesh = new THREE.Mesh( geometry2, material2 );

      mesh.position.x = Math.random() * 10 - 5;
      mesh.position.y = Math.random() * 10 - 5;
      mesh.position.z = Math.random() * 10 - 5;

      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

      scene.add( mesh );

      spheres.push( mesh );
      

  }

    function animate() {
      var timer = 0.0001 * Date.now();
      // var timer = 0.0001 * Date.now();

      camera.position.x += ( mouseX - camera.position.x ) * .05;
      camera.position.y += ( - mouseY - camera.position.y ) * .05;

      camera.lookAt( scene.position );

      for ( var i = 0, il = spheres.length; i < il; i ++ ) {

          var sphere = spheres[ i ];

          sphere.position.x = 5 * Math.cos( timer + i );
          sphere.position.y = 5 * Math.sin( timer + i * 1.1 );

      }

      // letter.rotation.x += 0.003




      
      requestAnimationFrame( animate );
      renderer.render( scene, camera );
    }
    animate();


  });


  
  return(
        <div class="rel">
<svg class="logof svg-shadow" width="896" height="224" version="1.1" id="Layer_1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
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

<h3 class="logoTitle">Dynamic. On-chain. Forever.\n Linagee</h3>


          <div class="canvasbg" id="canvas">
      
          </div>
      </div>
      )
}

export default Home;