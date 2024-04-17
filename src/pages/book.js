import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

const Book = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();

  const [isModalVisible, setModalVisible] = useState(false);
  const [booking, setBooking] = useState({
    vehicleType: "",
    date: "",
    time: ""
  });

  const confirmpage = () => {
    navigate('/confirm');
  };
const handleBooking = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.email, // Assuming user.sub contains the user ID
        bookedFrom: booking.date + ' ' + booking.time, // Combine date and time
        bookedTill: booking.endDate + ' ' + booking.endTime // Assume you have end date/time
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Booking successful with slot:', data.slotId);
      setModalVisible(true);
    } else {
      console.log('Failed to book:', data.error);
      alert(data.error);
    }
  } catch (error) {
    console.error('Error during booking:', error);
    alert('Error during booking');
  }
};


  const handleChange = (event) => {
    const { name, value } = event.target;
    setBooking(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleclick = (event) => {
    event.preventDefault();
    handleBooking();
  };

  const vehicleTypes = ["Car", "Bike"];

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Parking Booking</h1>
          <form id='bookingform'>
            <div className="mb-6">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
              <select id="vehicleType" name="vehicleType" className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-blue-500" onChange={handleChange} value={booking.vehicleType}>
                {vehicleTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" id="date" name="date" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} value={booking.date} />
            </div>
            <div className="mb-6">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input type="time" id="time" name="time" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" onChange={handleChange} value={booking.time} />
            </div>
            <div className="mb-6">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300" onClick={handleclick}>Book Now</button>
            </div>
          </form>
        </div>
      </div>

      {isModalVisible && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Booking Confirmation
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Your booking for a {booking.vehicleType} on {booking.date} at {booking.time} has been confirmed.
                    </p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button onClick={confirmpage} className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                      Go to Confirm Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
