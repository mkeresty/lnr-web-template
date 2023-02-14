import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';

export default function NameBox(props){
    const merged = mergeProps({
        type: 'start',
        name: 'null',
        owner: 'null',
        primary: 'null',
        wrapped: 'null',
        onOk: () => console.log('Ok')
      }, props); 

      return(
        <div class="box">
            <h4>{props.name}</h4>
            <h4>{props.owner}</h4>
            <h4>{props.primary}</h4>
            <h4>{props.wrapped}</h4>
        </div>
      )
}