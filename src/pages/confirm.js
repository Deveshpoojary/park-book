import React from 'react';
import { useNavigate } from 'react-router-dom';
import './confirm.css';

function ConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-900 text-white bg-primary flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto p-4 sm:p-8">
        <div className="p-6 bg-neutral-800 rounded-lg shadow-lg border-2 border-gray-400">
          <div className="flex justify-center mb-0">
            <svg className="funds-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle className="funds-checkmark-circle" cx="26" cy="26" r="25" fill="none" /><path className="funds-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
          </div>
          <audio src="success.mp3" autoPlay></audio>
          <div className="text-center">
            <h1 className="text-white text-3xl font-bold mb-2 delayed-text">Done!</h1>
            <h2 className="text-white text-xl mb-4 delayed-text">Your Booking has been confirmed!</h2>
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                className="bg-white border border-white text-neutral-900 font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white delayed-text"
                onClick={() => navigate('/home')}
              >
                Go to Home
              </button>
              <button
                className="bg-white border border-white text-neutral-900 font-bold py-2 px-4 rounded-md hover:bg-black hover:text-white delayed-text"
                onClick={() => navigate('/history')}
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
