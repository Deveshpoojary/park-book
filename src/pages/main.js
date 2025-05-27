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
    <div className="h-screen bg-white">
      <div className="flex flex-col h-screen relative overflow-hidden">
        {/* Gradient animated background */}
        <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-orange-100 via-white to-orange-200" />

        {/* Modern Glass Navbar */}
        <nav className="z-10 backdrop-blur-md bg-white/80 text-gray-800 py-4 px-8 flex justify-between items-center shadow-md border-b border-orange-100">
          <h1 className="text-4xl font-extrabold text-orange-600 tracking-wide">ParkWay</h1>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Profile />
              <button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
              onClick={() => loginWithRedirect()}
            >
              Get Started
            </button>
          )}
        </nav>

        {/* Main Hero Content */}
        <div className="flex-grow relative z-10">
          <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
            <p className="text-gray-900 text-3xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
              Don’t waste your time anymore
              <br className="sm:hidden" />
              <span className="block text-orange-600"> to find a parking space.</span>
            </p>
            <p className="text-gray-700 text-base sm:text-lg max-w-3xl">
              Welcome to <span className="font-bold text-orange-600">ParkWay</span> — your ultimate solution for booking parking spots online.
              Book your spot with just one click! Access bookings, order history, and more.
            </p>
            {!isAuthenticated && (
              <button
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
                onClick={() => loginWithRedirect()}
              >
                Get Started
              </button>
            )}
            {isAuthenticated && (
              <button
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition duration-300"
                onClick={() => navigate('/home')}
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>

      <About />
    </div>
  );
};

export default Main;
