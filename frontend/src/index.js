import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./css/shared-style.css"
import "./css/Button.css"
import {Endpoints} from "./constants/links/Endpoints";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
        <App />
    // </React.StrictMode>
);

