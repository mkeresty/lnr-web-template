import logo from './logo.svg';
import styles from './App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match, createEffect, Show } from 'solid-js';
import Profile from './pages/Profile';
import Mint from './pages/Mint';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import Domain from './pages/Domain';
import Create from './pages/Create';
import { useGlobalContext } from './GlobalContext/store';
import MessageBox, { setModalOff } from './components/MessageBox';

function App() {

  var og = window.parent.og;

  const { store, setStore } = useGlobalContext();


  const setModalOff = () => {
    const prev = store()
    var toSet = {modal:{status: false, message: "", type: ""}}
    setStore({...prev, ...toSet});
}

  createEffect(() => {
    if(store().modal && store().modal.status && store().modal.status == true){
      setTimeout(() => {
        setModalOff()
        return
      }, 3000);
    }
})



  return (
    <div class={styles.App}>
      <Header />
      <Switch fallback={<Home />}>
        <Match when={store().route == "Home"}><Home /></Match>
        <Match when={store().route == "Mint"}><Mint /></Match>
        <Match when={store().route == "Profile"}><Profile /></Match>
        <Match when={store().route == "Search"}><Search /></Match>
        <Match when={store().route == "Domain"}><Domain /></Match>
        <Match when={store().route == "Create"}><Create /></Match>
      </Switch>
      <Show when={store().modal && store().modal.status && store().modal.status == true}>
        <MessageBox
          type={store().modal.type}
          message={store().modal.message}
          onOk={() => {
            setModalOff();
        }}>
        </MessageBox>
      </Show>
    </div>
  );
}

export default App;
