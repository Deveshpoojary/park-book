import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import Profile from './Profile';
import { FaRegArrowAltCircleRight, FaBars, FaTimes } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";
import '../index.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth0();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function checkverify() {
      try {
        if (user?.email) {
          const response = await fetch('https://park-server.onrender.com/api/check-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email })
          });
          const data = await response.json();
          setVerified(data.verified === true);
          setErrorMessage(data.message || '');
        }
      } catch (error) {
        console.error('Verification failed:', error);
        setErrorMessage('An error occurred during verification.');
      }
    }
    checkverify();
  }, [user?.email]);

  const handleNavigation = (path) => {
    navigate(path);
    setIsNavOpen(false);
  };

  const handlebook = (e) => {
    e.preventDefault();
    if (verified) {
      navigate('/book');
    } else {
      setMessage(errorMessage || 'Please verify your phone number to book a slot.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-start py-6 sm:py-10">
      <Profile />

      {/* Navbar */}
      <div className="w-full px-6 py-4 shadow-md bg-white border-b border-gray-200 flex justify-between items-center fixed top-0 z-50">
        <img src="https://th.bing.com/th/id/OIP.yat3HsshdS-vQTir3a4xLAAAAA?rs=1&pid=ImgDetMain" alt="Logo" className="h-10" />
        <div className="hidden md:flex gap-4">
          {['admin', 'history', 'verify'].map((item) => (
            <button
              key={item}
              onClick={() => handleNavigation(`/${item}`)}
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
          <button
            onClick={() => logout({ returnTo: window.location.origin })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </div>

        <button className="md:hidden text-gray-700" onClick={() => setIsNavOpen(!isNavOpen)}>
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Nav */}
      {isNavOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex">
          <div className="w-64 bg-white p-5 space-y-4 shadow-lg">
            <button className="mb-4" onClick={() => setIsNavOpen(false)}>
              <FaTimes size={24} />
            </button>
            {['admin', 'history', 'verify'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavigation(`/${item}`)}
                className="block text-gray-800 font-medium py-2 hover:text-orange-600 transition"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="block mt-4 text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
          <div className="flex-1" onClick={() => setIsNavOpen(false)} />
        </div>
      )}

      {/* Main Card */}
      <div className="mt-28 px-4 w-full max-w-xl">
        <div className="bg-gradient-to-br from-orange-100 via-white to-orange-50 p-8 rounded-3xl shadow-xl border border-orange-200 relative">
          <div className="flex justify-center mb-4">
            <IoCarSportSharp size={60} className="text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800 flex justify-center items-center gap-2 mb-2">
            An advanced online parking booking system
            <GiFallingStar className="text-orange-500" />
          </h2>

          <form onSubmit={handlebook} className="space-y-5 mt-6">
            <select className="w-full px-3 py-2 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="railway">City Mall</option>
              <option value="none">None</option>
            </select>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Book a parking space <FaRegArrowAltCircleRight size={20} />
            </button>

            {message && <p className="text-red-600 font-medium text-center">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(HomePage, {
  onRedirecting: () => <div className="text-center mt-20 text-orange-500">Loading...</div>,
});
