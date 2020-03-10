import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { firebaseConfig } from './config';
import firebase from 'firebase';

firebase.initializeApp(firebaseConfig);

// firebase.analytics();

ReactDOM.render(<App />, document.getElementById('note-container'));

serviceWorker.unregister();
