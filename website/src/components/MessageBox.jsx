import styles from '../App.module.css';
import { Show } from 'solid-js';



export default function MessageBox(props){


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
