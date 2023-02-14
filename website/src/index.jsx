/* @refresh reload */
import { render } from 'solid-js/web';
import './index.css';
import App from './App.jsx';
import { GlobalContextProvider } from './GlobalContext/store';

render(() => (
    <GlobalContextProvider>
        <App />
    </GlobalContextProvider>

    ),
    document.getElementById('root')
);
