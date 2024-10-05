import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Auth0Provider
        domain = {process.env.AUTH0_DOMAIN}
        clientId = {process.env.AUTH0_CLIENT_ID}
         redirectUri={`${window.location.origin}`}
 
  
        >
         
    <App />
    </Auth0Provider>,
 
);

