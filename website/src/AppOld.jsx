import logo from './logo.svg';
import styles from './App.module.css';
import * as THREE from 'three';
import { createSignal, Switch, Match } from 'solid-js';
import Resolve from './pages/ResolveOld';
import Wrap from './pages/WrapOld';
import Transfer from './pages/TransferOld';
import Mint from './pages/zMintOld';
import Header from './components/Header';
import Home from './pages/zHomeOld';
import Search from './pages/SearchOld';
import Domain from './pages/Domain';

function App() {

  var og = window.parent.og;

  const [routeObj, setRouteObj] = createSignal('Mint')

  const [route, setRoute] = createSignal('Mint');
  const [domain, setDomain] = createSignal('');
  const [count, setCount] = createSignal(0);

  const callback = payload => {
    console.log("payload", payload)
    setRoute(payload)
    //setDomain(payload.domain)
    return
  }

  const callback2 = payload2 => {
    console.log("payload2", payload2)
    setRoute(payload2)
    //setDomain(payload.domain)
    return
  }



  const routeState = (payload) => {
    setRouteObj(payload)
    
  }



  return (
    <div class={styles.App}>
      <Header callback={callback} />
      {routeObj}
      <Switch
      fallback={<Home onIncrement2={() => setCount(count() + 1)} onSet={routeState}/>}
      >
        <Match when={route() == "Mint"}>
          <Mint onIncrement={() => setCount(count() + 2)} onSet={routeState}/>
        </Match>
        <Match when={route() == "Transfer"}>
          <Transfer />
        </Match>
        <Match when={route() == "Home"}>
          <Home onIncrement2={() => setCount(count() + 1)} onSet={routeState}/>
        </Match>
        <Match when={route() == "Wrap"}>
          <Wrap />
        </Match>
        <Match when={route() == "Resolve"}>
          <Resolve />
        </Match>
        <Match when={route() == "Search"}>
          <Search />
        </Match>
        <Match when={route() == "Domain"}>
          <Domain />
        </Match>
      </Switch>
    </div>
  );
}

export default App;
