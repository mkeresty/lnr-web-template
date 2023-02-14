import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';

export default function AddressBox(props){
    const merged = mergeProps({
        address: 'address',
        primary: 'null',
        onOk: () => console.log('Ok')
      }, props); 

      return(
        <div class="box">
            <h4>{props.address}</h4>
            <h4>{props.primary}</h4>
        </div>
      )
}