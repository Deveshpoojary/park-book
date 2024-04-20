import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';

const Book = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [booking, setBooking] = useState({
    vehicleType: "",
    date: "",
    time: "",
    endTime: "",
    slotId: null
  });
  const [slots, setSlots] = useState([]);
const [bookedFrom, setBookedFrom] = useState("");
const [bookedTill, setBookedTill] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
  useEffect(() => {
    console.log('fetching slots');
    console.log(bookedFrom, bookedTill);
    if (bookedFrom && bookedTill){
   fetchSlots( bookedFrom, bookedTill);

    }
    
  }, [ bookedFrom,bookedTill]);

  

 const fetchSlots = async (bookedFrom, bookedTill) => {
    try {
        const url = `https://51.20.72.9:3001/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}`;
        const response = await fetch(url);
        const data = await response.json();
           setLoading(true)
        if (Array.isArray(data)) { // Check if data is an array
            setSlots(data);
             
            setLoading(false)


        } else {
            console.error('Data received is not an array:', data);
            setError(error);
            setLoading(false)
            setSlots([]); // Reset slots or handle as needed
        }
    } catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]); // Reset slots or provide a default value on error
    }
};


// When the user selects or updates the booking time, call fetchSlots with the new times
// Example: fetchSlots('2023-04-12T12:00', '2023-04-12T13:00');

  const handleBooking = () => {
    if (!booking.vehicleType || !booking.date || !booking.time || !booking.endTime || !booking.slotId) {
      setError('Please fill all the fields');
      return;
    }
    setIsConfirmModalVisible(true);
  };

  const confirmBooking = async () => {
    const response = await fetch('http://localhost:3001/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.email,
        bookedFrom: `${booking.date} ${booking.time}`,
        bookedTill: `${booking.date} ${booking.endTime}`,
        slotId: booking.slotId
      }),
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/confirm', { state: { booking: data } });
    } else {
      alert(data.error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBooking(prev => ({ ...prev, [name]: value }));
    var bookedf =  document.getElementById('time').value;
    var bookedt =  document.getElementById('endTime').value;
    if (bookedf && bookedt) {
      bookedf = `${booking.date} ${bookedf}`;
      bookedt = `${booking.date} ${bookedt}`;

      setBookedFrom(bookedf);
      setBookedTill(bookedt);
    }
    
    

  };

  const handleSlotSelect = (slotId) => {
    const slot = slots.find(s => s.slotId === slotId);
    if (slot.isOccupied) {
      setError('Slot is already occupied');
      
    } else {
      setBooking(prev => ({ ...prev, slotId }));
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Parking Booking</h1>
          <form id='bookingform'>
            <div className="mb-6">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <div className="mt-2">
                <input type="radio" id="car" name="vehicleType" value="Car"  checked={booking.vehicleType === "Car"} />
                <label htmlFor="car" className="mr-6">Car</label>
                <input type="radio" id="bike" name="vehicleType" value="Bike" onChange={handleChange} checked={booking.vehicleType === "Bike"} />
                <label htmlFor="bike">Bike</label>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" name="date" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.date} />
            </div>
            <div className="mb-6">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
              <input type="time" id="time" name="time" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.time} />
            </div>
            <div className="mb-6">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input type="time" id="endTime" name="endTime" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.endTime} />
            </div>
            {loading && <p>Loading........................................................................</p>}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Select Slot</label>
              <div className="grid grid-cols-4 gap-4 mt-2">
                { slots.map(slot => (
                  <div key={slot.slotId} onClick={() => handleSlotSelect(slot.slotId)}
                    className={`cursor-pointer p-3 ${slot.slotId === booking.slotId ? 'bg-blue-500 text-white' : slot.isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} rounded-lg`}>
                    Slot {slot.slotId}
                  </div>
                ))}
                {error && <Alert variant="filled" severity="error" onClose={()=>{setError(null)}}>
    {error}
  </Alert>}
              </div>
            </div>
            <button type="button" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleBooking}>
              Book Now
            </button>
            
          </form>
        </div>
      </div>

      {isConfirmModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold">Confirm Booking</h2>
            <p className="text-sm">Please confirm your booking details:</p>
            <ul className="text-sm list-disc pl-5 mt-2">
              <li>Vehicle Type: {booking.vehicleType}</li>
              <li>Date: {booking.date}</li>
              <li>Time: {booking.time} to {booking.endTime}</li>
              <li>Slot: {booking.slotId}</li>
            </ul>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setIsConfirmModalVisible(false)} className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">
                Cancel
              </button>
              <button onClick={confirmBooking} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
