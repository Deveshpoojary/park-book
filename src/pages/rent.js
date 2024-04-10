import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import tailwindcss from 'tailwindcss/tailwind.css';

const Rent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    price: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic, e.g., send data to backend
    // Redirect to confirmation page or do something else
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">List Your Parking Space</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price</label>
              <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button onClick={() => { navigate('/confirm') }} type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">List Space</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Rent;
