import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0, } from '@auth0/auth0-react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Profile from './Profile';
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { GiFallingStar } from "react-icons/gi";
import { IoCarSportSharp } from "react-icons/io5";

//import { FaBolt } from "react-icons/fa";
const HomePage = () => {

    const navigate = useNavigate();
    const { logout } = useAuth0();
    const handleClick = (event) => {
        event.preventDefault();
        navigate('/book');



    };
    return (







        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 bg-primary  ">
            <Profile />

            <div className='bg-secondary flex items-center justify-between px-4 py-2 shadow-lg '>
                <div>
                    <img src="https://api.time.com/wp-content/uploads/2015/02/apple-logo.jpg" alt="Logo" className="h-8 w-auto" />
                </div>
                <div>
                    <button onClick={() => { navigate('/book'); }} className="bg-white hover:bg-black hover:text-white border border-white text-black font-bold py-2 px-4 rounded-2xl">
                        Book
                    </button>
                    <button onClick={() => { navigate('/admin'); }} className="ml-4 bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">
                        Admin
                    </button>
                    <button onClick={() => { navigate('/adminhist'); }} className="ml-4 bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">Admin history</button>
                    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className="ml-4 bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">Log Out </button>
                </div>

                <div>
                    <button onClick={() => { navigate('/history'); }} className="ml-4 bg-white hover:bg-black hover:text-white border border-white font-bold py-2 px-4 rounded-2xl">History</button>
                </div>
            </div>
            <div className="relative py-3 sm:max-w-xl sm:mx-auto"></div>

            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="bg-secondary border border-gray-400 relative px-4 py-10 bg-neutral-800 text-white shadow-lg sm:rounded-3xl sm:p-20 inset-0 ">
                    <div className="max-w-md mx-auto">
                        <div>
                            {/* <img src="https://api.time.com/wp-content/uploads/2015/02/apple-logo.jpg" className="h-7 sm:h-8" alt="logo" /> */}
                            <IoCarSportSharp size={50} color='cyan' className='margin'/>

                        </div>
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <p className='text-white text-lg font-bold flex'>An advanced online parking booking system <GiFallingStar size={30} color='cyan' className='ml-1' /></p>
                                <form className="mt-6" >
                                    <div>
                                        <label htmlFor="location" className="sr-only">Location</label>

                                        <select className='bg-gray-700 rounded text-white'>
                                            <option value="location">Railway MlR CNTRL</option>
                                            <option value="location">none</option>
                                        </select>
                                    </div>
                                    <div className="mt-6">
                                        <button onClick={handleClick} className="w-full mr-auto px-4 py-2 text-black font-bold bg-slate-100 hover:bg-neutral-900 hover:text-white rounded-md focus:outline-none flex justify-center items-center border border-white">  Book a parking space <FaRegArrowAltCircleRight size={25} className='ml-1' /></button>
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