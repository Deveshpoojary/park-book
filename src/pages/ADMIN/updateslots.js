import React, { useState } from 'react';

const UpdateSlots = () => {
    const [slotId, setSlotId] = useState(0);
    const [vehicleType, setVehicleType] = useState('car');
    const [numSlots, setNumSlots] = useState(1);
    const [operation, setOperation] = useState('add'); // 'add' or 'remove'
    const [error,setError]=useState("")

    const handleAddSlots = async () => {
        if(!(slotId<0) && !(numSlots<=0))
        {
            
            const currentSlotId =slotId ;
            const slotData = {
                slotId: parseInt(currentSlotId),
                type: vehicleType,
                numberofslots:parseInt(numSlots)
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
            
        }}
        else{
            setError("  Invalid data entered");
        }
    };

    const handleRemoveSlot = async () => {
        if(!(slotId<=0) && !(numSlots<=0)){
                const currentSlotId =slotId ;
            const slotData = {
                slotId: parseInt(currentSlotId),
                numberofslots:parseInt(numSlots)
            };
        try {
            const response = await fetch(`https://park-book-9f9254d7f86a.herokuapp.com/api/slotsdel`, {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(slotData)
            });
            const data = await response.json();
            console.log('Slot removed:', data);
        } catch (error) {
            console.error('Failed to remove slot:', error);
        }
        }
        else{
            setError("  Invalid data entered");
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
        <div className="container bg-secondary mx-auto px-4 shadow-lg shadow-gray-500 rounded-lg py-4 mt-6">
            <h1 className="text-4xl py-2 mt-4 font-bold text-white l-border">Update Parking Slots</h1>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-4">
                    <label htmlFor="slotId" className="block text-sm font-medium text-white">Starting Slot ID</label>
                    <input
                        type="number"
                        id="slotId"
                        value={slotId}
                        onChange={e => setSlotId(e.target.value)}
                        className="bg-primary picker form-input hover:border-cyan-500 mt-1 block w-full px-3 py-2 border border-gray-500 rounded-md bg-transparent text-white"
                        
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-white">Vehicle Type</label>
                    <select
                        id="vehicleType"
                        value={vehicleType}
                        onChange={e => setVehicleType(e.target.value)}
                        className="bg-primary picker mt-1 block w-full px-3 py-2 border border-gray-500 hover:border-cyan-500 rounded-md bg-transparent text-white"
                    >
                        <option value="car" className='text-white'>Car</option>
                        <option value="bike" className='text-white'>Bike</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="numSlots" className="block text-sm font-medium text-white">Number of Slots</label>
                    <input
                        type="number"
                        id="numSlots"
                        min={1}
                        value={numSlots}
                        onChange={e => setNumSlots(e.target.value)}
                        className="bg-primary picker mt-1 block w-full px-3 py-2 border border-gray-500 hover:border-cyan-500 rounded-md bg-transparent text-white"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Operation</label>
                    <select
                        value={operation}
                        onChange={e => setOperation(e.target.value)}
                        className="bg-primary picker mt-1 block w-full px-3 py-2 border border-gray-500 hover:border-cyan-500 rounded-md bg-transparent text-white"
                    >
                        <option value="add" className='text-white'>Add Slots</option>
                        <option value="remove" className='text-white'>Remove Slot</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-white hover:bg-black hover:text-white text-black border border-white font-bold py-2 px-4 rounded"
                >
                    {operation === 'add' ? 'Add Slots' : 'Remove Slot'}
                </button>
            </form>
            {error}
        </div>
    );
};

export default UpdateSlots;
