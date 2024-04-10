import React from 'react';
import { useState } from 'react';
// import tailwindcss from 'tailwindcss/tailwind.css'
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc ,addDoc,collection} from 'firebase/firestore';
import  {db}  from '../fb';
const Book = () => {
 


  const navigate = useNavigate();
  const confirmpage = () => {
    navigate('/confirm');

  }
/// states

  const [isModalVisible, setModalVisible] = useState(false);
  const [booking, setBooking] = useState({
   
    vehicleType: "",
    date: "",
    time: ""
  });


// functionsss


const addBooking = async (userId, slotId, paymentDetails) => {
  const bookingTime = new Date();
  const bookedTill = new Date(bookingTime.getTime() + 2 * 60 * 60 * 1000); // Book for 2 hours

  try {
    // Add the booking information
    const bookingRef = await addDoc(collection(db, "bookings"), {
      userId: doc(db, "users", userId), // Reference to the user document
      slotId: doc(db, "parkingSlots", slotId), // Reference to the slot document
      bookedFrom: bookingTime,
      bookedTill,
      paymentDetails,
    });


    console.log("New booking added with ID: ", bookingRef.id);
    return bookingRef.id; // Return the new booking ID
  } catch (error) {
    console.error("Error adding booking: ", error);
  }
};




// event handlers

  const handleclick = (event) => {
    event.preventDefault();
    const data = document.getElementById('bookingform');
   
    const vehicleType = data.vehicleType.value;
    const date = data.date.value;
    const time = data.time.value;
     setBooking( {
      
      vehicleType: vehicleType,
      date: date,
      time: time
    });
    setModalVisible(!isModalVisible);
   
   addBooking("T@G.CO", "2", "500 ");
    
  }

  const vehicleTypes = ["Car", "bike"];
  return (

    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Parking Booking</h1>
          <form id='bookingform'>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="vehicleType">Vehicle Type</label>
              <div className="relative">
                <select className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500" id="vehicleType" name="vehicleType">
                  {vehicleTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="date">Date</label>
              <input className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" type="date" id="date" name="date" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="time">Time</label>
              <input className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" type="time" id="time" name="time" />
            </div>
            <div className="mb-6">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300" onClick={handleclick} >Book Now</button>
            </div>
          </form>
        </div>
      </div>


      {isModalVisible && (<>      <div>
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start"></div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Booking Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your booking has been confirmed.
                      </p>
                      <button onClick={confirmpage} className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"'>go to confirm page </button>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button onClick={handleclick} className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>





      </>)}

    </div>
  )
}



export default Book;