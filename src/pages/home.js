import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Profile from './Profile';
import { FaRegArrowAltCircleRight, FaBars, FaTimes } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsNavOpen(false);
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-primary">
      <Profile />

      {/* Navigation bar */}
      <div className="bg-secondary flex items-center justify-between px-4 py-2 shadow-lg">
        <div>
          <img src="https://api.time.com/wp-content/uploads/2015/02/apple-logo.jpg" alt="Logo" className="h-8 w-auto" />
            {/* <h1 className='text-white font-bold text-3xl'>ParkWay</h1> */}
        </div>
        {/* Navbar for medium and small screens */}
        <div className="md:hidden">
          <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-white">
            <FaBars size={24} />
          </button>
        </div>
        {/* Navbar for large screens */}
        <div className="hidden md:flex space-x-4">
          <button onClick={() => handleNavigation('/book')} className="bg-white hover:bg-black hover:text-white border border-white text-black font-bold py-2 px-4 rounded-2xl">Book</button>
          <button onClick={() => handleNavigation('/admin')} className="bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">Admin</button>
          <button onClick={() => handleNavigation('/adminhist')} className="bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">Admin history</button>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">Log Out</button>
          <button onClick={() => handleNavigation('/history')} className="bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">History</button>
        </div>
      </div>

      {/* Slide-in navbar for medium and small screens */}
      <div className={`fixed inset-0 z-50 flex transition-transform transform ${isNavOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex-1" onClick={() => setIsNavOpen(false)} />
        <div className="bg-secondary flex flex-col w-64 h-full p-4">
          <div className="flex justify-end">
            <button onClick={() => setIsNavOpen(false)} className="text-white">
              <FaTimes size={24} />
            </button>
          </div>
          <button onClick={() => handleNavigation('/book')} className="mt-4 text-white font-bold py-2 px-4 hover:bg-white hover:text-black hover:rounded-md">Book</button>
          <button onClick={() => handleNavigation('/admin')} className="mt-2 text-white font-bold py-2 px-4 hover:bg-white hover:text-black hover:rounded-md">Admin</button>
          <button onClick={() => handleNavigation('/adminhist')} className="mt-2 text-white font-bold py-2 px-4 hover:bg-white hover:text-black hover:rounded-md">Admin history</button>
          <button onClick={() => handleNavigation('/history')} className="mt-2 text-white font-bold py-2 px-4 hover:bg-white hover:text-black hover:rounded-md">History</button>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="mt-2 text-white font-bold py-2 px-4 hover:bg-white hover:text-black hover:rounded-md">Log Out</button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto px-4"></div>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto sm:px-0 px-2">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
        <div className="bg-secondary border border-gray-400 relative px-4 py-10 bg-neutral-800 text-white shadow-lg rounded-3xl sm:p-20 inset-0 ">
          <div className="max-w-md mx-auto">
            <div>
              <IoCarSportSharp size={50} color='cyan' className='margin' />
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p className='text-white text-lg font-bold flex'>An advanced online parking booking system <GiFallingStar size={30} color='cyan' className='ml-1' /></p>
                <form className="mt-6">
                  <div>
                    <label htmlFor="location" className="sr-only">Location</label>
                    <select className='bg-gray-700 rounded text-white'>
                      <option value="location">Railway MlR CNTRL</option>
                      <option value="location">none</option>
                    </select>
                  </div>
                  <div className="mt-6">
                    <button onClick={() => handleNavigation('/book')} className="w-full mr-auto px-4 py-2 text-black font-bold bg-slate-100 hover:bg-neutral-900 hover:text-white rounded-md focus:outline-none flex justify-center items-center border border-white">  Book a parking space <FaRegArrowAltCircleRight size={25} className='ml-1' /></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthenticationRequired(HomePage, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<div>Redirecting you to the login page...</div>)
});
