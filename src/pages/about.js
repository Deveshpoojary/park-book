import React from 'react';
import location from '../images/photo-1600266511717-1cf08f902b56.jpg';
import image1 from '../images/photo-1536585422010-b58dd25bb946.jpg';
import image2 from '../images/photo-1487537891204-8e3ba1a38082.jpg';
import image3 from '../images/photo-1607286966263-af9fed5a735c.jpg';

function About() {
  const currentyear = new Date().getFullYear();
  return (
    <div className='bg-primary text-white text-center'>
      <div className='flex justify-center items-center'>
        <img src={location} alt='Parking' className='text-center border-8 border-gray-800 rounded-lg'></img>
      </div>

      <div className='mt-20 space-y-4'>
        <h1 className='font-bold text-5xl'>Book Your Parking Spot with Ease</h1>
        <p className='text-slate-300 text-xl '>Your ultimate solution for booking parking spots online with our user-friendly system.</p>
      </div>

      {/* First image and text */}
      <div className='flex flex-col lg:flex-row justify-between mt-16'>
        <div className='flex flex-col-reverse lg:flex-row items-center lg:items-center'>
          <img src={image1} alt='Convenient' className='w-6/12 h-auto rounded-xl mb-4 lg:mb-0 lg:mr-4'></img>
          <div className='space-y-4 px-7 text-center lg:text-left'>
            <h1 className='font-bold text-5xl'>Efficient Booking Process</h1>
            <p className='text-slate-300 text-xl '>Our Parking Booking System allows you to easily find and reserve parking spaces online, saving you time and hassle searching for a spot when you arrive.</p>
          </div>
        </div>
      </div>

      {/* Second text and image */}
      <div className='flex flex-col lg:flex-row-reverse justify-between mt-10'>
        <div className='flex flex-col-reverse lg:flex-row-reverse items-center lg:items-center'>
          <img src={image2} alt='Convenient' className='w-6/12 h-auto rounded-xl mb-4 lg:mb-0 lg:ml-4'></img>
          <div className='space-y-4 px-7 text-center lg:text-left'>
            <h1 className='font-bold text-5xl'>User-Friendly Interface</h1>
            <p className='text-slate-300 text-xl '>ParkWay offers a simple and intuitive interface, making it easy for you to navigate through the booking process. Enjoy a stress-free parking experience every time.</p>
          </div>
        </div>
      </div>

      {/* Third image and text */}
      <div className='flex flex-col lg:flex-row justify-between mt-10'>
        <div className='flex flex-col-reverse lg:flex-row items-center lg:items-center'>
          <img src={image3} alt='Convenient' className='w-6/12 h-auto rounded-xl mb-4 lg:mb-0 lg:mr-4'></img>
          <div className='space-y-4 px-7 text-center lg:text-left'>
            <h1 className='font-bold text-5xl'>Convenient Order History</h1>
            <p className='text-slate-300 text-xl '>Keep track of your parking bookings with ease through ParkWay's convenient order history feature. Access your past reservations at any time for a seamless parking experience.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-primary text-white py-6 border-t border-gray-400 mt-10'>
        <div className='text-center'>
          <p className='mt-2 fam'>&copy; {currentyear} All rights reserved</p>
        </div> 
      </footer>
    </div>
  );
}

export default About;
