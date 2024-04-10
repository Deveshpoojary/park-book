import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import data from '../data';
const Main = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const myStyle = {
    border: '2px solid blue',
    borderRadius: '10px',
    backgroundColor: 'blue',
  };

  return (
    <div>
      <div className="home-page relative h-screen">
        <div
          className="bg-img absolute inset-0 bg-cover bg-center"
          
        />
        <div className="overlay absolute inset-0 bg-cyan-500 opacity-50">
         
          <p className="overlay-txt absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-semibold text-rose-600">
         
          <span className="txt-color text-black animate-ping">
            
              Don't waste your time anymore</span>to find a parking lot.
            
            {isAuthenticated ? (
           <> <p>Hello {user.name} </p>
            <button  className='bg-blue-500 shadow-lg shadow-blue-500/50 hover:bg-sky-700  rounded-lg p-1' onClick={()=>{navigate('/home')}}> Book</button></>
          ) : (
            <button className='bg-gray-950 rounded-lg p-1 m-4 left-64 absolute hover:bg-sky-700' onClick={() => loginWithRedirect()}>Get Started</button>
          )}
          </p>
          <button onClick={()=>{data.slot=19;}}>book</button>         Slots={ data.slot}
        </div>
      </div>
     

      {isAuthenticated && (
        <button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          style={myStyle}
        >
          Log Out
        </button>
      )}
    </div>
  );
};

export default Main;
