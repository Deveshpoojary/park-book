import React from 'react'
import { Link } from 'react-router-dom';

function accessdenied() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
            <h1 className="text-4xl text-red-500 animate-blink">404</h1>
            <p className="text-center text-2xl font-bold text-gray-700">Access Denied.</p>
            <Link to="/home" className="no-underline mt-5 px-5 py-2 bg-blue-500 text-white rounded-md">Go Back Home</Link>
        </div>
  )
}

export default accessdenied
