import React, { useEffect, useState } from 'react';

const UpdatePrices = () => {
  const [carPrice, setCarPrice] = useState('');
  const [bikePrice, setBikePrice] = useState('');
  const [fetchedcar, setFetchedcar] = useState('');
  const [fetchedbike, setFetchedbike] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://park-server.onrender.com/api/prices');
        const data = await response.json();
        if (response.ok) {
          setFetchedcar(data[0].carprice);
          setFetchedbike(data[0].bikeprice);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, [count]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isNaN(carPrice) || isNaN(bikePrice) || carPrice <= 0 || bikePrice <= 0) {
      setError('Please enter valid positive numbers for prices.');
      return;
    }

    try {
      const response = await fetch('https://park-server.onrender.com/api/updatePrices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carPrice: parseFloat(carPrice), bikePrice: parseFloat(bikePrice) }),
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
    <div
      className="bg-gradient-to-br from-orange-100 via-white to-orange-50 min-h-screen flex items-center justify-center px-4"
    //   style={{
    //     background: 'linear-gradient(135deg, #fff8f0 0%, #ff6f00 510%)',
    //   }}
    >
      <div
        className="max-w-md w-full border border-orange-200 p-8 rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #ffcc80 100%)',
          boxShadow: 'none',
        }}
      >
        <h1 className="text-3xl font-extrabold mb-6 text-orange-800 text-center drop-shadow-sm">
          Update Parking Prices
        </h1>

        <button
          className="mb-6 w-full py-3 rounded-lg font-semibold
                     bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                     text-white
                     hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
                     transition-colors duration-300
                     focus:outline-none focus:ring-4 focus:ring-orange-300"
          onClick={() => setCount(count + 1)}
        >
          Fetch Latest Prices
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              className="block mb-2 font-semibold text-orange-900 text-lg"
              htmlFor="carPrice"
            >
              Car Price (per minute)
            </label>
            <div className="mb-1 text-orange-700 font-medium">
              Current Price:{' '}
              <span className="font-bold text-orange-900">{fetchedcar}</span>
            </div>
            <input
              id="carPrice"
              type="number"
              placeholder="Enter car price"
              value={carPrice}
              onChange={(e) => setCarPrice(e.target.value)}
              className="w-full px-4 py-3 rounded-lg
                         border border-orange-300
                         bg-orange-50 bg-opacity-60
                         text-orange-900 placeholder-orange-600
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         shadow-sm
                         transition"
              min="0"
              step="any"
              formNoValidate
            />
          </div>

          <div className="mb-5">
            <label
              className="block mb-2 font-semibold text-orange-900 text-lg"
              htmlFor="bikePrice"
            >
              Bike Price (per minute)
            </label>
            <div className="mb-1 text-orange-700 font-medium">
              Current Price:{' '}
              <span className="font-bold text-orange-900">{fetchedbike}</span>
            </div>
            <input
              id="bikePrice"
              type="number"
              placeholder="Enter bike price"
              value={bikePrice}
              onChange={(e) => setBikePrice(e.target.value)}
              className="w-full px-4 py-3 rounded-lg
                         border border-orange-300
                         bg-orange-50 bg-opacity-60
                         text-orange-900 placeholder-orange-600
                         focus:outline-none focus:ring-2 focus:ring-orange-500
                         shadow-sm
                         transition"
              min="0"
              step="any"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold
                       bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600
                       text-white
                       hover:from-orange-500 hover:via-orange-600 hover:to-orange-700
                       transition-colors duration-300
                       focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Update Prices
          </button>
        </form>

        {message && (
          <p className="mt-6 text-center text-green-700 font-semibold">{message}</p>
        )}
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
      </div>
    </div>
  );
};

export default UpdatePrices;
