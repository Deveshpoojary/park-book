import React from 'react';
import { useNavigate } from 'react-router-dom';
import './confirm.css';

function ConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-orange-200 text-black flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto p-4 sm:p-8">
        <div className="p-6 bg-white rounded-2xl shadow-xl border border-orange-300">
          <div className="flex justify-center mb-4">
            <svg className="funds-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className="funds-checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="funds-checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
          <audio src="success.mp3" autoPlay></audio>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-orange-600 mb-2 delayed-text">🎉Done!</h1>
            <h2 className="text-xl text-orange-700 mb-4 delayed-text">Your Booking has been confirmed!</h2>
            <p className="text-lg text-gray-800 mb-6 delayed-text">Check your OTP in history.</p>

            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                className="bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition-colors delayed-text"
                onClick={() => navigate('/home')}
              >
                Go to Home
              </button>
              <button
                className="bg-white border border-orange-400 text-orange-700 font-semibold py-2 px-4 rounded-md hover:bg-orange-100 transition-colors delayed-text"
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
