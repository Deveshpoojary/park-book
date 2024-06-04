import React, { useEffect, useState } from 'react';
import car from "../../images/car.png"
import bike from "../../images/bike.webp"
import { set } from 'firebase/database';
const  Current = () => {
    const [slots, setSlots] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setloading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const bookedFrom = new Date();
    
       
        const bookedTill = new Date(Date.now() + 5 * 60 * 1000);
        // const bookedfromformatted = new Date(bookedFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        // const bookedtillformatted = new Date(bookedTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const [booking ,setbooking]= useState({ vehicleType: "car" });
        useEffect(() => {
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
      fetchslots();
    }
    , [booking.vehicleType, refresh]);
    return (
      <div className='text-white'>
        <div className='grid grid-cols-8 gap-4'>
          <span>from: {new Date(bookedFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
           <span>bookedTill: {new Date(bookedTill).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
     </span>    
      <button className=' col-span-8 bg-slate-600 w-32 hover:bg-[#864AF9]' onClick={() => { setbooking({ vehicleType: "car" }) }}>CAR SLOTS</button>
          <button className=' col-span-8 bg-slate-600 w-32 m-0 hover:bg-[#864AF9]' onClick={() => { setbooking({ vehicleType: "bike" }) }}>BIKE SLOTS</button>
          {/* {!loading?<bton className='col-span-8 bg-red-400'  onClick={fetchslots}>
            Fetch slots
          </button>:<button  disabled className='col-span-8 bg-red-400'>
            Fetching.....
          </button>} */}
          <button className='col-span-8 bg-red-400 w-64' onClick={() => { setRefresh(!refresh) }}>

            {loading ? "refreshing" : "refresh"}
          </button>
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className={`flex flex-col justify-center  items-center cursor-pointer p-2 py-4 w-32 h-22 sm:w-32 sm:h-32 md:w-32 md:h-32 ${
                slot.slotId === booking.slotId
                  ? 'bg-cyan-400 text-black'
                  : slot.isOccupied
                    ? 'bg-red-100 text-black p-1'
                    : 'bg-3 text-black'
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
                <p>Slot {slot.slotId}  <br />
                Veh. number {slot.bookingDetails[0].vehicleNumber}



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