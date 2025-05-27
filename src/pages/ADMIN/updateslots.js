import React, { useState } from 'react';

const UpdateSlots = () => {
  const [slotId, setSlotId] = useState('');
  const [vehicleType, setVehicleType] = useState('car');
  const [numSlots, setNumSlots] = useState(1);
  const [operation, setOperation] = useState('add'); // 'add' or 'remove'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAddSlots = async () => {
    if (!(slotId < 0) && !(numSlots <= 0)) {
      setError('');
      setMessage('');
      const slotData = {
        slotId: parseInt(slotId),
        type: vehicleType,
        numberofslots: parseInt(numSlots),
      };
      try {
        const response = await fetch('https://park-server.onrender.com/api/slots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slotData),
        });
        const data = await response.json();
        if (data.error) {
          setError('Failed to add slots/already exists');
        } else {
          setMessage('Slot added successfully');
          setSlotId('');
          setNumSlots(1);
        }
      } catch (error) {
        setError('Error occurred while adding slot.');
      }
    } else {
      setError('Invalid data entered');
    }
  };

  const handleRemoveSlot = async () => {
    if (!(slotId <= 0)) {
      setError('');
      setMessage('');
      const slotData = {
        slotId: parseInt(slotId),
      };
      try {
        const response = await fetch(`https://park-server.onrender.com/api/slotsdel`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(slotData),
        });
        const data = await response.json();
        setMessage('Slot removed successfully');
        setSlotId('');
      } catch (error) {
        setError('Error occurred while removing slot.');
      }
    } else {
      setError('Invalid data entered');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (operation === 'add') {
      handleAddSlots();
    } else {
      handleRemoveSlot();
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-orange-100 via-white to-orange-50 min-h-screen flex items-center justify-center px-6 py-8"
      style={{
        // background: 'linear-gradient(135deg, #ffffff 0%, #ffcc80 100%)',
      }}
    >
      <div
        className="max-w-md w-full border border-orange-200 p-8 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #ffcc80 100%)',
          boxShadow: 'none',
        }}
      >
        <h1 className="text-3xl font-extrabold mb-8 text-orange-800 text-center drop-shadow-sm">
          Update Parking Slots
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 text-orange-900">
          {/* Starting Slot ID */}
          <div>
            <label htmlFor="slotId" className="block font-semibold mb-2 text-orange-900">
              Starting Slot ID
            </label>
            <input
              type="number"
              id="slotId"
              value={slotId}
              onChange={(e) => setSlotId(e.target.value)}
              placeholder="Enter slot ID"
              required
              className="w-full rounded-lg px-4 py-3 border border-orange-300 bg-orange-50 bg-opacity-60 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-orange-900 shadow-sm transition"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block font-semibold mb-2 text-orange-900">Vehicle Type</label>
            <div className="flex space-x-8">
              {['car', 'bike'].map((type) => (
                <label
                  key={type}
                  className={`flex items-center space-x-2 cursor-pointer text-orange-900 ${
                    operation === 'remove' ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value={type}
                    checked={vehicleType === type}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="accent-orange-500"
                    disabled={operation === 'remove'}
                  />
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </label>
              ))}
            </div>
            {operation === 'remove' && (
              <p className="text-sm mt-1 text-orange-900/70 italic">
                Vehicle type is ignored when removing slot.
              </p>
            )}
          </div>

          {/* Number of Slots */}
          {operation === 'add' && (
            <div>
              <label htmlFor="numSlots" className="block font-semibold mb-2 text-orange-900">
                Number of Slots
              </label>
              <div className="flex items-center max-w-xs rounded-lg overflow-hidden border border-orange-300">
                <button
                  type="button"
                  onClick={() => setNumSlots(Math.max(1, numSlots - 1))}
                  className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white px-4 py-2 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  id="numSlots"
                  min={1}
                  value={numSlots}
                  onChange={(e) => setNumSlots(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-center bg-orange-50 bg-opacity-60 border-none text-orange-900 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setNumSlots(numSlots + 1)}
                  className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:from-orange-500 hover:via-orange-600 hover:to-orange-700 text-white px-4 py-2 transition"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Operation */}
          <div>
            <label className="block font-semibold mb-2 text-orange-900">Operation</label>
            <div className="flex space-x-10 text-orange-900">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="add"
                  checked={operation === 'add'}
                  onChange={(e) => setOperation(e.target.value)}
                  className="accent-orange-500"
                />
                <span>Add Slots</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="remove"
                  checked={operation === 'remove'}
                  onChange={(e) => setOperation(e.target.value)}
                  className="accent-orange-500"
                />
                <span>Remove Slot</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold
                       bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                       text-white
                       hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
                       transition-colors duration-300
                       focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            {operation === 'add' ? 'Add Slots' : 'Remove Slot'}
          </button>
        </form>

        {/* Messages */}
        {error && (
          <p className="mt-6 text-center text-red-700 font-semibold relative">
            {error}{' '}
            <span
              className="absolute right-0 top-0 cursor-pointer text-orange-900 bg-white rounded px-2"
              onClick={() => setError('')}
              title="Dismiss error"
            >
              X
            </span>
          </p>
        )}
        {message && (
          <p className="mt-6 text-center text-green-700 font-semibold">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UpdateSlots;
