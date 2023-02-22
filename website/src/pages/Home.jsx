import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import { useGlobalContext } from '../GlobalContext/store';


const Home = () =>{

  const { store, setStore } = useGlobalContext();

  const setModal = () => {
    const prev = store()
    var toSet = {isLoading: true}
    setStore({...prev, ...toSet});
}

  return(
        <div class="page">
        <br />
        <div class="columns is-mobile">  
          <div class="column is-10 is-offset-1 pb-10">
              <div class="card lg has-text-centered">
                <br/>
                <p class="title has-text-light">
                home.og test
                </p>
                <br/>
                <button onClick={setModal}>test</button>
              </div>
            </div>
          </div>
      </div>
      )
}

export default Home;