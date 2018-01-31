import React from 'react';
import ReactDOM from 'react-dom';
import App from './components';
import './index.css';
import persistence from './store/persistence' 
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store';
const store = configureStore(persistence)
ReactDOM.render(
  <App store={store}/>,
  document.getElementById('root')
);
registerServiceWorker();