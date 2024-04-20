import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Auth0Provider
        domain="dev-3xz0udbsxxtdl6r4.us.auth0.com"
        clientId="JaBKZ74yvnMsjr65EorKy6NrL2KXlKCW"
         redirectUri={`${window.location.origin}/callback`}
 
  
        >
         
    <App />
    </Auth0Provider>,
 
);

