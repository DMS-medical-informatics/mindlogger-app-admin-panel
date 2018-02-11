import React from 'react';
import ReactDOM from 'react-dom';
import App from './components';
import './index.css';
import {loadState, saveState} from './store/localStorage' 
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store';
const store = configureStore(loadState())
store.subscribe(() => {
  console.log(store.getState())
  saveState({
    entities: store.getState().entities,
  });
})
ReactDOM.render(
  <App store={store}/>,
  document.getElementById('root')
);
registerServiceWorker();