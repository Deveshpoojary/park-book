import React, { useEffect, useState } from 'react';

const UpdatePrices = () => {
    const [carPrice, setCarPrice] = useState('');
    const [bikePrice, setBikePrice] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
   const [count,setcount]=useState(0);


useEffect(() => {





    const fetchPrices = async () => {
        try {
            const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/prices');
            const data = await response.json();
            if (response.ok) {
                setCarPrice(data[0].carprice);
                setBikePrice(data[0].bikeprice);

            }
        } catch (error) {
            console.error('Error fetching prices:', error);
        }
    };

    fetchPrices();
}, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isNaN(carPrice) || isNaN(bikePrice) || carPrice <= 0 || bikePrice <= 0) {
            setError('Please enter valid positive numbers for prices.');
            return;
        }

        try {
            const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/updatePrices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ carPrice: parseFloat(carPrice), bikePrice: parseFloat(bikePrice) })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Prices updated successfully!');
                setError('');
            } else {
                throw new Error(data.message || 'Error updating prices');
            }
        } catch (error) {
            setError(error.message);
            setMessage('');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 px-4 py-8 bg-neutral-800 shadow-md rounded-lg">
            <h1 className="text-2xl font-semibold text-center text-white mb-4">Update Parking Prices</h1>
            <button className='bg-cyan-500 text-black p-1 rounded-md hover:bg-cya-600 animate-pulse' onClick={() => {setcount(count+1)}}> Fetch latest prices
           

            
            </button>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="carPrice">
                        Car Price (per minute)
                    </label>
                    <span className='text-cyan-500 animate-pulse'>Current Price <span className='text-red-400 animate-pulse'>{carPrice}</span> </span> 
                    <br></br>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="carPrice"
                        type="number"
                        placeholder="Enter car price"
                        value={carPrice}
                        onChange={(e) => setCarPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2" htmlFor="bikePrice">
                        Bike Price (per minute)
                    </label>
                    <span className='text-cyan-400 animate-pulse'>Current Price  <span className='text-red-400 animate-pulse'>{bikePrice}</span> </span>
                    <br></br>

                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="bikePrice"
                        type="number"
                        placeholder="Enter bike price"
                        value={bikePrice}
                        onChange={(e) => setBikePrice(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-cyan-500 hover:bg-cyan-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Update Prices
                    </button>
                </div>
                {message && <p className="mt-4 text-green-600">{message}</p>}
                {error && <p className="mt-4 text-red-600">{error}</p>}
            </form>
        </div>
    );
};

export default UpdatePrices;
