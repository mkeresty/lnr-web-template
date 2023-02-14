import styles from '../App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, children, createEffect, mergeProps, Show, onMount } from 'solid-js';
import MessageBox from '../components/MessageBox';
import { nameLookup, handleEthers } from './nameUtils';
import { useGlobalContext } from '../GlobalContext/store';
