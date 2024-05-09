import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';
import { BsTicketPerforated } from 'react-icons/bs';
import { set } from 'firebase/database';

const Book = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [booking, setBooking] = useState({
    vehicleType: "",
    date: "",
    date2: "",
    time: "",
    endTime: "",
    slotId: null,
    vehicleNumber: "",
    amount: 0
  });
  const [slots, setSlots] = useState([]);
  const [bookedFrom, setBookedFrom] = useState("");
  const [bookedTill, setBookedTill] = useState("");
  const [load, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [carprice, setCarprice] = useState(0);
  const [bikeprice, setBikeprice] = useState(0);
  
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/prices');
        const data = await response.json();
        setCarprice(data[0].carprice);
        setBikeprice(data[0].bikeprice);
        
        console.log(carprice);
        console.log(bikeprice);
       
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };
    fetchPrice();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookedFrom, bookedTill, booking.vehicleType, carprice, bikeprice]);

    useEffect(() => {
    if (bookedFrom && bookedTill && booking.vehicleType && carprice || bikeprice) {
      const calculatedAmount = calculateAmount(bookedFrom, bookedTill, booking.vehicleType);
      setAmount(calculatedAmount);
    }
  }, [bikeprice, bookedFrom, bookedTill, booking.vehicleType, carprice,bikeprice]);

  
useEffect(() => {
  if(error){
    setSlots([]);
    

}

else{
  setBooking(prev=>({...prev,vehicleType:!booking.vehicleType}));
}},[error]);
  useEffect(() => {
    console.log('fetching slots');
    console.log(bookedFrom, bookedTill);
    console.log(booking.vehicleType);

    const fetchSlots = async () => {
      if (!bookedFrom || !bookedTill || !booking.vehicleType) {
        return;
      }
      try {
        setLoading(true)
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}&type=${booking.vehicleType}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setSlots(data);
          console.log(data);
         
          }
          
          }
          
        
       catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]);
        setError("Error fetching slots");
      }
    };

    fetchSlots();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookedFrom, bookedTill, booking.vehicleType]);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!booking.vehicleType || !booking.date || !booking.time || !booking.date2 || !booking.endTime || !booking.slotId || !booking.vehicleNumber || !amount) {
      
      
      setError('Please fill all the fields');



      return;
    }
    
    setIsConfirmModalVisible(true);
  };

  const confirmBooking = async () => {
    const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.email,
        vehicleType: booking.vehicleType,
        amount: amount,
        bookedFrom: `${booking.date} ${booking.time}`,
        bookedTill: `${booking.date2} ${booking.endTime}`,
        slotId: booking.slotId,
        vehicleNumber: booking.vehicleNumber,
      

      }),
    });

    const data = await response.json();
    if (response.ok) {
      navigate('/confirm', { state: { booking: data } });
    } else {
      setError(data.message);
      console.error('Failed to book:', data);
    }
  };

   const calculateAmount = (from, till, type) => {
    const start = new Date(from);
    const end = new Date(till);
    const diff = (end - start) / 60000; // difference in minutes
    const rate = type === "car" ? carprice : bikeprice;
    const calculatedAmount = diff * rate;
    try{if (calculatedAmount <= 0) {
       setError('Calculated amount is non-positive');
      throw new Error('Calculated amount is non-positive');
     
    }
    if (calculatedAmount < 10 && !(calculatedAmount> 10)) {
      setError('Minimum amount is 10');
      return 10;
    }
    return calculatedAmount;
    }
    catch(error){
      console.error('Error calculating amount:', error);
    }
  };

  const handleChange = (event) => {
  const { name, value } = event.target;
  setBooking(prev => ({ ...prev, [name]: value }));

  // Perform additional logic when date, time, date2, or endTime are changed
  const { date, time, date2, endTime } = { ...booking, [name]: value };
  const now = new Date();
  
  if (date && time && date2 && endTime) {
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(`${date2}T${endTime}`);
    
    if (startDateTime < now || endDateTime < now) {
      setError('Booking times must be in the future');
      setBookedFrom("");
      setBookedTill("");
    } else if (startDateTime >= endDateTime) {
      setError('End time should be later than start time');
      setBookedFrom("");
      setBookedTill("");
    } else {
      setBookedFrom(`${date}T${time}`);
      setBookedTill(`${date2}T${endTime}`);
      setError(null);
    }
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
            {/* Vehicle Type Selection */}
            <div className="mb-6">
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
              <div className="mt-2 flex">
                <button type="button" id="car" name="vehicleType" value="car" onClick={handleChange} className={`w-1/2 py-2 px-4 rounded-md ${booking.vehicleType === "car" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} border border-gray-300`}>
                  Car
                </button>
                <button type="button" id="bike" name="vehicleType" value="bike" onClick={handleChange} className={`w-1/2 py-2 px-4 rounded-md ${booking.vehicleType === "bike" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} border border-gray-300`}>
                  Bike
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="date" className="block border-stone-950 text-sm font-medium text-gray-700">Vehicle number</label>
              <input type="number" id="vehicleNumber" name="vehicleNumber" placeholder='KA19XXXXXX' autoFocus required className="form-input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " onChange={handleChange} value={booking.vehicleNumber} />
            </div>
            {/* Date and Time Input Fields */}
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" id="date" name="date" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.date} />
            </div>
            <div className="mb-6">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Start Time</label>
              <input type="time" id="time" name="time" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.time} />
            </div>
            <div className="mb-6">
              <label htmlFor="date2" className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" id="date2" name="date2" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.date2} />
            </div>
            <div className="mb-6">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
              <input type="time" id="endTime" name="endTime" required className="form-input mt-1 block w-full" onChange={handleChange} value={booking.endTime} />
            </div>
            {/* Total Charges Display */}
            {amount > 0 ? <p>Total Charges:<span className=' font-medium text-green-900'>INR: {amount.toFixed(2)}</span> </p> : <span class="relative flex h-3 w-3">Fetching
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
</span>}
            {/* Slot Selection */}
            
            <div className="mb-6 mt-2"> 
              <label className="block text-sm font-medium text-gray-700">Select Slot</label>
              
              <div className="grid grid-cols-4 gap-4 mt-2">
                {slots.map(slot => (
                  <div key={slot.slotId} onClick={() => handleSlotSelect(slot.slotId)}
                    className={`cursor-pointer p-3 ${slot.slotId === booking.slotId ? 'bg-blue-500 text-white' : slot.isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} rounded-lg`}>
                    Slot {slot.slotId}
                  </div>
                ))}
              </div>
              {error && <Alert variant="filled" severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
            </div>
            {/* Booking Button */}
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" onClick={handleBooking}>
              Book Now
            </button>
          </form>
        </div>
      </div>
      {/* Confirmation Modal */}
      {isConfirmModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold">Confirm Booking</h2>
            <p className="text-sm">Please confirm your booking details:</p>
            <ul className="text-sm list-disc pl-5 mt-2">
              <li>Vehicle Type: {booking.vehicleType}</li>
              <li>Vehicle Number: {booking.vehicleNumber}</li>
              <li>Start Date: {booking.date}</li>
              <li>Start Time: {booking.time}</li>
              <li>End Date: {booking.date2}</li>
              <li>End Time: {booking.endTime}</li>
              <li>Slot: {booking.slotId}</li>
              <li>Amount: INR: {amount.toFixed(2)}</li>
            </ul>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setIsConfirmModalVisible(false)} className="bg-red-300 hover:bg-gray-400 text-black py-2 px-4 rounded">
                No
              </button>
              <button onClick={confirmBooking} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Pay and Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Book;
