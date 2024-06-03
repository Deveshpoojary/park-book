import React, { useState } from 'react';
import car from "../../images/car.png"
import bike from "../../images/bike.webp"
import { set } from 'firebase/database';
const  Current = () => {
    const [slots, setSlots] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(false);
    const bookedFrom = new Date().toISOString();
       
        const bookedTill = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        const [booking ,setbooking]= useState({ vehicleType: "car" });
    async function fetchslots(){
        try {
        setloading(true );

        const url = `https://park-book-9f9254d7f86a.herokuapp.com/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}&type=${booking.vehicleType}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          const uniqueSlots = data.filter((slot, index, self) => self.findIndex(s => s.slotId === slot.slotId) === index);
          setSlots(uniqueSlots);
          console.log(uniqueSlots);
          setError(null);
          setloading(false);
          
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]);
        setError("Error fetching slots");
      }}
    return (
      <div className='text-white'>
        <div className='grid grid-cols-8 gap-4'>
          <button className='col-span-8 bg-slate-600'  onClick={()=>{booking.vehicleType="car"}}>CAR SLOTS</button>
          <button className='col-span-8 bg-slate-800' onClick={()=>{booking.vehicleType="bike"}}>BIKE SLOTS</button>
          {!loading?<button className='col-span-8 bg-red-400'  onClick={fetchslots}>
            Fetch slots
          </button>:<button  disabled className='col-span-8 bg-red-400'>
            Fetching.....
          </button>}

          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className={`flex flex-col justify-center text-center items-center cursor-pointer p-4 w-24 h-22 sm:w-32 sm:h-32 md:w-32 md:h-32 ${
                slot.slotId === booking.slotId
                  ? 'bg-cyan-400 text-black'
                  : slot.isOccupied
                  ? 'bg-red-200 text-white'
                  : 'bg-slate-500 text-white'
              } rounded-lg`}
            >
              {slot.isOccupied ? (
                booking.vehicleType === 'car' ? (
                  <img src={car} alt='Car' width='100' height='50' />
                ) : (
                  <img src={bike} className='' alt='Bike' width='100' height='50' />
                )
              ) : null}

              {slot.isOccupied ? (
                <p>Slot {slot.slotId} till {(slot.bookedTill)}
                Veh. number {slot.vehicleNumber}
                
                
                
                 </p>
              ) : (
                <p>
                  Slot {slot.slotId} <br />
                  Available
                </p>
              )}
            </div>
          ))}
          {error && <div>{error}</div>}
        </div>
      </div>
    );
    }

export default Current;