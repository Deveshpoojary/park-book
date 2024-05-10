import React, { useState } from 'react';

const UpdateSlots = () => {
    const [slotId, setSlotId] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [numSlots, setNumSlots] = useState(1);
    const [operation, setOperation] = useState('add'); // 'add' or 'remove'

    const handleAddSlots = async () => {
        for (let i = 0; i < numSlots; i++) {
            const currentSlotId = parseInt(slotId) + i;
            const slotData = {
                slotId: currentSlotId.toString(),
                type: vehicleType
            };
            try {
                const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/slots', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(slotData)
                });
                const data = await response.json();
                console.log('Slot added:', data);
            } catch (error) {
                console.error('Failed to add slot:', error);
            }
        }
    };

    const handleRemoveSlot = async () => {
        try {
            const response = await fetch(`https://park-book-9f9254d7f86a.herokuapp.com/api/slots/${slotId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log('Slot removed:', data);
        } catch (error) {
            console.error('Failed to remove slot:', error);
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
        <div className="container mx-auto px-4">
            <h1 className="text-xl font-semibold">Update Parking Slots</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">Starting Slot ID</label>
                    <input
                        type="number"
                        id="slotId"
                        value={slotId}
                        onChange={e => setSlotId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <select
                        id="vehicleType"
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="numSlots" className="block text-sm font-medium text-gray-700">Number of Slots</label>
                    <input
                        type="number"
                        id="numSlots"
                        value={numSlots}
                        onChange={e => setNumSlots(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Operation</label>
                    <select
                        value={operation}
                        onChange={e => setOperation(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="add">Add Slots</option>
                        <option value="remove">Remove Slot</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {operation === 'add' ? 'Add Slots' : 'Remove Slot'}
                </button>
            </form>
        </div>
    );
};

export default UpdateSlots;
