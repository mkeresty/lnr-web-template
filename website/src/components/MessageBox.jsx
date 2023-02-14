import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';


export default function MessageBox(props){
    console.log("showing", props)
  const merged = mergeProps({
    type: 'start',
    name: 'null',
    owner: 'null',
    signature: 'null',
    message: 'null',
    onOk: () => console.log('Ok')
  }, props); 


  return(
    <Show
    when={props.type == "success"}
    fallback={
        <div class="box errorBox is-centered animated fadeOut pop">
       {props.message}
    </div>
    }
  >
    <div class="box successBox is-centered animated fadeOut pop">
    {props.message}
    </div>
    </Show>
  )
};
