import React, { useEffect } from 'react';
import { useState } from 'react';
// import { usePage } from './PageContext';
import { useNavigate } from 'react-router-dom';
import './confirm.css';
// import GifPlayer from "react-gif-player";

function ConfirmationPage() {
  // const { visited, setVisited } = usePage();
  const navigate = useNavigate();
  // const [gifLoaded, setGifLoaded]=useState(false);

  // const handleLoad=()=>{
  //   setGifLoaded(true);
  // }

  // useEffect(() => {
  //   if (!visited.bookings || visited.confirmation) {
  //     history('/confirmerror');
  //   } else {
  //     setVisited(prev => ({ ...prev, confirmation: true }));
  //     setTimeout(() => {
  //       history('/home');
  //     }, 15000); // Redirect after 5 seconds
  //   }
  // }, [visited, setVisited, history]);

  return (
    <>
      {/* <div style={{ justifyContent: "center", alignItems: "center", display: "flex" }} className='m-8' >
        <IconContext.Provider value={{color:"green",size:"100px",}} >
            <GiConfirmed/>
            </IconContext.Provider> 
        <img src='https://i.pinimg.com/originals/57/b5/48/57b54818e2011d482548fb54201ce6c1.gif' alt="success" ></img>

      </div> */}

      <div className='min-h-screen bg-neutral-900 text-white bg-primary'>
      <div className="funds-success-message-container p-20">
        <div className="funds-checkmark-text-container rounded-lg shadow-lg shadow-cyan-300 border-2 border-gray-400 shadow-gray-500">
          <div className="funds-checkmark-container">
            <svg className="funds-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="funds-checkmark-circle" cx="26" cy="26" r="25" fill="none" /><path className="funds-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>

            <div className="funds-display-on-ie">
              <svg className="funds-ie-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="funds-ie-checkmark-circle" cx="26" cy="26" r="25" fill="none" /><path className="funds-ie-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
            </div>
          </div>

          <div className=' text-center'  >
            <audio src="success.mp3" autoPlay></audio>


            <h1 className='text-white delayed-text h1'>Done!</h1>
            <h2 className='mb-4 text-white delayed-text'>Your Booking has been confirmed!</h2>
            <button className='bg-white border border-white text-neutral-900 font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white delayed-text' onClick={() => { navigate('/home'); }}>Go to Home</button>
            <button className='bg-white border border-white text-neutral-900 py-2 font-bold px-4 rounded-md hover:bg-black hover:text-white ml-2 delayed-text' onClick={() => { navigate('/history'); }}>View History</button>
            <p></p>


          </div>
        </div>

      </div>
      </div>



    </>
  );
}

export default ConfirmationPage;
