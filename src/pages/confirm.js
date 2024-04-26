


import React, { useEffect } from 'react';
// import { usePage } from './PageContext';
import { useNavigate } from 'react-router-dom';

function ConfirmationPage() {
  // const { visited, setVisited } = usePage();
  // const history = useNavigate();

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
        <div style={{justifyContent:"center", alignItems:"center", display:"flex"}} className='m-8' >
            {/* <IconContext.Provider value={{color:"green",size:"100px",}} >
            <GiConfirmed/>
            </IconContext.Provider> */}
             <img src='https://i.pinimg.com/originals/57/b5/48/57b54818e2011d482548fb54201ce6c1.gif' alt="success"></img>
            </div>
       
        <div className=' text-center'  >
            <audio src="success.mp3" autoPlay></audio>
            
            
            <h1>Confirmation Page</h1>

            <p>Your Booking has been confirmed!</p>
            <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' onClick={()=>{window.location.href='/home'}}>Go to Home</button>
            <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' onClick={()=>{window.location.href='/history'}}>View History</button>
            <p></p>
            
            
        </div>
</>
  );
}

export default ConfirmationPage;
