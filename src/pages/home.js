import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0, } from  '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Profile from './Profile';
//import { FaBolt } from "react-icons/fa";
const HomePage = () => {

    const navigate = useNavigate();
    const { logout } = useAuth0();
    const handleClick = (event) => {
        event.preventDefault();
        navigate('/book');



    };
    return (







        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <Profile/>

            <div className="flex items-center justify-between px-4 py-2 bg-white shadow">
                <div>
                    <img src="https://api.time.com/wp-content/uploads/2015/02/apple-logo.jpg" alt="Logo" className="h-8 w-auto" />
                </div>
                <div>
                    <button onClick={() => { navigate('/book'); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Book
                    </button>
                    <button onClick={() => { navigate('/rent'); }} className="ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Rent
                    </button>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})} className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Log Out </button>
                </div>
            </div>
            <div className="relative py-3 sm:max-w-xl sm:mx-auto"></div>

            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <img src="https://api.time.com/wp-content/uploads/2015/02/apple-logo.jpg" className="h-7 sm:h-8" alt="logo" />
                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <p>An advanced online parking booking system.</p>
                                <form className="mt-6" >
                                    <div>
                                        <label htmlFor="location" className="sr-only">Location</label>
                                        
                                        <select>
                                            <option value="location">GDC college</option>
                                            <option value="location">none</option>

                                            
                                            
                                            </select> </div>
                                    <div className="mt-6">
                                        <button onClick={handleClick} className="w-full mr-auto px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none">  Book a parking space</button>
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

export  default withAuthenticationRequired(HomePage, {
    // Show a message while the user waits to be redirected to the login page.
    onRedirecting: () => (<div>Redirecting you to the login page...</div>)
  });