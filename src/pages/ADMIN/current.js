import React, { useEffect, useState } from 'react';

const Current = () => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const bookedFrom = new Date();
  const bookedTill = new Date(Date.now() + 5 * 60 * 1000);
  const [booking, setBooking] = useState({ vehicleType: "car" });

  useEffect(() => {
    async function fetchSlots() {
      try {
        setLoading(true);
        const url = `https://park-server.onrender.com/api/parkingSlots?bookedFrom=${bookedFrom}&bookedTill=${bookedTill}&type=${booking.vehicleType}`;
        const response = await fetch(url);
        const data = await response.json();

        if (Array.isArray(data)) {
          const uniqueSlots = data.filter((slot, index, self) => self.findIndex(s => s.slotId === slot.slotId) === index);
          setSlots(uniqueSlots);
          setError(null);
        }
      } catch (error) {
        console.error('Failed to fetch slots:', error);
        setSlots([]);
        setError("Error fetching slots");
      } finally {
        setLoading(false);
      }
    }
    fetchSlots();
  }, [booking.vehicleType, refresh]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-orange-300 via-orange-300 to-orange-200 text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow-md">Current Parking Slots</h2>
        
        <div className="flex justify-between mb-6 text-lg font-medium">
          <span>From: {bookedFrom.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>Booked Till: {bookedTill.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 ${
              booking.vehicleType === 'car' ? 'bg-white text-orange-600 shadow-lg' : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
            onClick={() => setBooking({ vehicleType: "car" })}
          >
            CAR SLOTS
          </button>

          <button
            className={`px-6 py-2 rounded-md font-semibold transition-colors duration-300 ${
              booking.vehicleType === 'bike' ? 'bg-white text-orange-600 shadow-lg' : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
            onClick={() => setBooking({ vehicleType: "bike" })}
          >
            BIKE SLOTS
          </button>

          <button
            className="px-6 py-2 rounded-md font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors duration-300"
            onClick={() => setRefresh(!refresh)}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 text-center mb-6 font-semibold">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {slots.map((slot) => (
            <div
              key={slot.slotId}
              className={`p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105
                ${
                  slot.isOccupied
                    ? "bg-white text-orange-700 border-2 border-orange-600"
                    : "bg-orange-50 text-orange-900 border border-orange-300"
                }
              `}
            >
              <div className="text-center font-semibold mb-2">
                Slot {slot.slotId}
              </div>
              {slot.isOccupied ? (
                <div className="text-sm">
                  <div><span className="font-semibold">Occupied</span></div>
                  <div>Veh. Number:</div>
                  <div className="break-words">{slot.bookingDetails?.[0]?.vehicleNumber || "N/A"}</div>
                </div>
              ) : (
                <div className="text-sm font-semibold text-center">
                  Available
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Current;
