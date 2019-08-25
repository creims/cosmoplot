import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

function renderApp() {
    ReactDOM.render(<App width={window.innerWidth} height={window.innerHeight} />, document.getElementById('root'));
}

window.addEventListener('resize', renderApp);

renderApp();
