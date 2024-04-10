import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <Auth0Provider
        domain="dev-d4dv7obbhqirc2nt.us.auth0.com"
        clientId="ucci3mbRP6BEG6ZQZ9agOoRh4OjZLz2r"
        authorizationParams={{
            redirect_uri: window.location.origin
        }}
        >
         
    <App />
    </Auth0Provider>,
 
);

