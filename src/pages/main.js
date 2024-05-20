import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';
import About from './about';
import './main.css';

const Main = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div className='h-screen'>
    <div className="flex flex-col h-screen bg-primary" >
      <nav className=" text-white py-4 px-8 flex justify-between items-center border-b border-black-100">
        <h1 className="text-4xl font-bold text-white fam txt">ParkWay</h1>
        {isAuthenticated ? (
          <div className="flex items-center">
            {/* <p className="mr-4">Hello, {user.name}</p> */}
            <Profile/>
            <button
              className="bg-white hover:bg-black hover:text-white border-2 border-white text-black font-bold py-2 px-4 rounded"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log Out
            </button>
          </div>
        ) : (
          <button
            className="btn bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => loginWithRedirect()}
          >
            Get Started
          </button>
        )}
      </nav>

      <div className=" flex-grow relative">
        <div className="absolute inset-0" />
        <div className="absolute inset-0 opacity-50" />

          
        <div className=" absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-blue-500 text-7xl font-semibold text-center mb-4">
            <span className="text-white ">Don't waste your time anymore</span>
            <br /><span className='txt'>to find a parking space.</span>
          </p>
          <p className='text-slate-300 text-center text-xl font-semibold '>Welcome to <span className='name font-bold'>ParkWay</span> - your ultimate solution for booking parking spots online. Book your spot with <br/>just one click! Our system offers a user-friendly interface for booking, accessing <br/>order history, and more.

          </p>
          {!isAuthenticated && ( 
            <button
              className=" bg-white hover:bg-black text-white font-bold py-2 px-4 rounded-full btn "
              onClick={() => loginWithRedirect()}
            >
              Get Started
            </button>
          )}
          {isAuthenticated && (
            <button
              className="btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mt-4+"
              onClick={() => navigate('/home')}
            >
              Book
            </button>
          )}
          
        </div>
      </div>
    </div>
    <About/>
    </div>
  );
};

export default Main;
