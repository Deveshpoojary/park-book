import React from 'react';
import location from '../images/photo-1600266511717-1cf08f902b56.jpg';
import image1 from '../images/photo-1536585422010-b58dd25bb946.jpg';
import image2 from '../images/photo-1487537891204-8e3ba1a38082.jpg';
import image3 from '../images/photo-1607286966263-af9fed5a735c.jpg';

function About() {
  const currentyear = new Date().getFullYear();

  return (
    <div className="relative bg-gradient-to-br from-orange-100 via-white to-orange-200 text-gray-800 overflow-hidden">
      {/* Location Image */}
      <div className="flex justify-center items-center py-10">
        <img
          src={location}
          alt="Parking"
          className="border-8 border-white rounded-2xl shadow-xl max-w-[90%] md:max-w-4xl"
        />
      </div>

      {/* Section Title */}
      <div className="mt-10 text-center space-y-4 px-4">
        <h1 className="font-extrabold text-4xl sm:text-5xl text-orange-600">
          Book Your Parking Spot with Ease
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl max-w-3xl mx-auto">
          Your ultimate solution for booking parking spots online with our user-friendly system.
        </p>
      </div>

      {/* Feature Section - 1 */}
      <div className="flex flex-col lg:flex-row justify-between items-center mt-16 px-4 lg:px-20 gap-10">
        <img
          src={image1}
          alt="Efficient Booking"
          className="w-full lg:w-1/2 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
        />
        <div className="space-y-4 text-center lg:text-left max-w-xl">
          <h1 className="font-bold text-3xl sm:text-5xl text-orange-700">Efficient Booking Process</h1>
          <p className="text-gray-700 text-lg">
            Easily find and reserve parking spaces online, saving you time and hassle searching for a spot when you arrive.
          </p>
        </div>
      </div>

      {/* Feature Section - 2 */}
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center mt-16 px-4 lg:px-20 gap-10">
        <div className="space-y-4 text-center lg:text-left max-w-xl">
          <h1 className="font-bold text-3xl sm:text-5xl text-orange-700">User-Friendly Interface</h1>
          <p className="text-gray-700 text-lg">
            ParkWay offers a simple and intuitive interface, making it easy for you to navigate through the booking process.
          </p>
        </div>
        <img
          src={image2}
          alt="User Friendly"
          className="w-full lg:w-1/2 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Feature Section - 3 */}
      <div className="flex flex-col lg:flex-row justify-between items-center mt-16 px-4 lg:px-20 gap-10">
        <img
          src={image3}
          alt="Order History"
          className="w-full lg:w-1/2 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105"
        />
        <div className="space-y-4 text-center lg:text-left max-w-xl">
          <h1 className="font-bold text-3xl sm:text-5xl text-orange-700">Convenient Order History</h1>
          <p className="text-gray-700 text-lg">
            Keep track of your parking bookings with ease through ParkWay’s order history feature.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-6 bg-white text-center text-gray-600 shadow-inner border-t">
        <p className="text-sm">&copy; {currentyear} All rights reserved</p>
      </footer>
    </div>
  );
}

export default About;
