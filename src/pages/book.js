import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';
import { BsTicketPerforated } from 'react-icons/bs';
import { IoCarSportSharp } from "react-icons/io5";
import { PiMotorcycleFill } from "react-icons/pi";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { MdConfirmationNumber } from "react-icons/md";

import ConfirmationPage from './confirm';

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
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [carprice, setCarprice] = useState(0);
  const [bikeprice, setBikeprice] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 20;

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

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
  }, [bookedFrom, bookedTill, booking.vehicleType, carprice, bikeprice]);

  useEffect(() => {
    if (bookedFrom && bookedTill && booking.vehicleType && carprice || bikeprice) {
      const calculatedAmount = calculateAmount(bookedFrom, bookedTill, booking.vehicleType);
      setAmount(calculatedAmount);
    }
  }, [bikeprice, bookedFrom, bookedTill, booking.vehicleType, carprice, bikeprice]);

  useEffect(() => {
    if (error) {
      setSlots([]);
    } else {
      setBooking(prev => ({ ...prev, vehicleType: !booking.vehicleType }));
    }
  }, [error]);

  useEffect(() => {
    console.log('fetching slots');
    console.log(bookedFrom, bookedTill);
    console.log(booking.vehicleType);

    const fetchSlots = async () => {
      if (!bookedFrom || !bookedTill || !booking.vehicleType || !carprice || !bikeprice || !booking.vehicleNumber) {
        return;
      }
      try {
        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}&type=${booking.vehicleType}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          const uniqueSlots = data.filter((slot, index, self) => self.findIndex(s => s.slotId === slot.slotId) === index);
          setSlots(uniqueSlots);
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]);
        setError("Error fetching slots");
      }
    };

    fetchSlots();
  }, [bookedFrom, bookedTill, booking.vehicleType, booking.vehicleNumber]);

  const handleBooking = (e) => {
    e.preventDefault();
    if (!booking.vehicleType || !booking.date || !booking.time || !booking.date2 || !booking.endTime || !booking.slotId || !booking.vehicleNumber || !amount) {
      setError('Please fill all the fields');
      return;
    }
    setIsConfirmModalVisible(true);
  };

  const confirmBooking = async () => {
    setLoading(true);
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
      setLoading(false);
      setConfirm(true);
    } else {
      setLoading(false);
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
    try {
      if (calculatedAmount <= 0) {
        setError('Calculated amount is non-positive');
        throw new Error('Calculated amount is non-positive');
      }
      if (calculatedAmount < 10 && !(calculatedAmount > 10)) {
        setError('Minimum amount is 10');
        return 10;
      }
      return calculatedAmount;
    } catch (error) {
      console.error('Error calculating amount:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBooking(prev => ({ ...prev, [name]: value }));

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
    if (name === "vehicleType") {
      setCurrentPage(1); // Reset to the first page when vehicle type changes
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

  const handleNextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  const currentSlots = slots.slice((currentPage - 1) * slotsPerPage, currentPage * slotsPerPage);

//delay in selecting vehicleType
  const handleVehicleTypeChange = (vehicleType) => {
    setBooking((prev) => ({
      ...prev,
      vehicleType,
    }));
  };


  return (
    <>
      {!confirm ?
        <div className="bg-primary min-h-screen bg-neutral-900 text-white py-4 px-14 ">
          <div className="container mx-auto py-8">
            <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl shadow-gray-500">
              <h1 className="text-3xl font-bold mb-6">Parking Booking</h1>
              <form id='bookingform'>
                <div className="mb-4">
                  <label htmlFor="vehicleType" className="font-medium">Vehicle Type:</label>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => handleVehicleTypeChange("car")}
                      className={`py-2 px-4 rounded-md border border-gray-400 transition-colors ${booking.vehicleType === "car" ? "bg-cyan-500" : "bg-primary hover:bg-gray-600"
                        } font-bold`}
                    >
                      <IoCarSportSharp size={30} className="text-black-500" />
                      Car
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVehicleTypeChange("bike")}
                      className={`py-2 px-4 rounded-md border border-gray-400 transition-colors ${booking.vehicleType === "bike" ? "bg-cyan-500" : "bg-primary hover:bg-gray-600"
                        } font-bold`}
                    >
                      <PiMotorcycleFill size={30} className="text-black-500" />
                      Bike
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="date" className="font-medium">Start Date:</label>
                    <input type="date" name="date" required className="form-input w-full mt-1 p-2 bg-gray-700 border border-gray-400 rounded bg-primary picker" onChange={handleChange} value={booking.date} />
                  </div>
                  <div>
                    <label htmlFor="time" className="font-medium">Start Time:</label>
                    <input type="time" name="time" required className="form-input w-full mt-1 p-2 bg-gray-700 border border-gray-400 rounded bg-primary picker" onChange={handleChange} value={booking.time} />
                  </div>
                  <div>
                    <label htmlFor="date2" className="font-medium">End Date:</label>
                    <input type="date" name="date2" required className="form-input w-full mt-1 p-2 bg-gray-700 border border-gray-400 rounded bg-primary picker" onChange={handleChange} value={booking.date2} />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="font-medium">End Time:</label>
                    <input type="time" name="endTime" required className="form-input w-full mt-1 p-2 bg-gray-700 border border-gray-400 rounded bg-primary picker" onChange={handleChange} value={booking.endTime} />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="vehicleNumber" className="font-medium">Vehicle Number:</label>
                  <input type="text" name="vehicleNumber" placeholder="KA-01-AB-1234" required className="form-input w-full mt-1 p-2 bg-gray-700 border border-gray-400 rounded bg-primary" onChange={handleChange} value={booking.vehicleNumber} />
                </div>
                {error && <div className="bg-red-700 text-center p-3 rounded mb-4">
                  {error}
                </div>}
                {/* Total Charges Display */}
                {amount > 0 ? <p>Total Charges:<span className='font-medium text-cyan-500'>INR: {amount.toFixed(2)}</span> </p> : <span className="relative flex h-3 w-3">Fetching
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>}
                {/* Slot Selection */}
                <div className="mb-6 mt-2">
                  <label className="block text-sm font-medium text-gray-700">Select Slot</label>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    {currentSlots.map(slot => (
                      <div key={slot.slotId} onClick={() => handleSlotSelect(slot.slotId)}
                        className={`cursor-pointer p-3 ${slot.slotId === booking.slotId ? 'bg-cyan-400 text-black' : slot.isOccupied ? 'bg-red-300 text-white' : 'bg-slate-500 text-white'} rounded-lg`}>
                        Slot {slot.slotId}
                      </div>
                    ))}
                  </div>
                  {slots.length > 0 && (
                    <div className="flex justify-between mt-4">
                      <button disabled={currentPage === 1} onClick={handlePreviousPage} className="bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50">
                        Previous
                      </button>
                      <button disabled={currentSlots.length < slotsPerPage} onClick={handleNextPage} className="bg-gray-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50">
                        Next
                      </button>
                    </div>
                  )}
                  {error && <Alert variant="filled" severity="error" onClose={() => { setError(null) }}>{error}</Alert>}
                </div>
                {/* Booking Button */}
                <button type="submit" className="w-full bg-white text-black font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white border border-gray-400 flex justify-center items-center" onClick={handleBooking}>
                  Book Now <FaRegArrowAltCircleRight size={25} className='ml-1' />
                </button>
              </form>
            </div>
          </div>
          {/* Confirmation Modal */}
          {isConfirmModalVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-700 rounded-lg p-6 max-w-sm mx-auto">
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
                  <button onClick={() => setIsConfirmModalVisible(false)} className="bg-red-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded flex justify-center items-center">
                    Cancel<MdCancel className="ml-2" />
                  </button>
                  {!loading ? <button onClick={confirmBooking} className="bg-cyan-500 hover:bg-sky-600 text-black font-bold py-2 px-4 rounded flex justify-center items-center">
                    Pay and Confirm<GiConfirmed className="ml-2" />
                  </button> : <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    <BsTicketPerforated className="animate-spin" />
                  </button>}
                </div>
              </div>
            </div>
          )}
        </div>
        :
        <ConfirmationPage />}
    </>
  );
};

export default Book;
