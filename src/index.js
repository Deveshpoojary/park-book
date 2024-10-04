import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Auth0Provider
        domain="dev-um2w5d0mlhg5skzq.us.auth0.com"
        clientId="ZCn4QQpuHfCefdtpVocU92ZZFbMYsMc9"
         redirectUri={`${window.location.origin}`}
 
  
        >
         
    <App />
    </Auth0Provider>,
 
);

