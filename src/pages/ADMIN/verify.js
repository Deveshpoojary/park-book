import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Verify = () => {
    const { user, isLoading } = useAuth0();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(true);

    useEffect(() => {
        const checkVerify = async () => {
            if (user?.email) {
                const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/isverified', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email })
                });
                const data = await response.json();
                if (data.isverified === true) {
                    setMessage('Your phone number is verified');
                    setVerified(true);
                } else {
                    setVerified(false);
                }
            }
        };
        checkVerify();
    }, [user?.email,message]);

    const handleSendOtp = async () => {
        const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/sendotp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber })
        });
        const data = await response.json();
        setMessage(data.message);
        
    };

    const handleVerifyOtp = async () => {
        const response = await fetch('https://park-book-9f9254d7f86a.herokuapp.com/api/verifyotp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, code: otp, email: user.email })
        });
        const data = await response.json();
        setMessage(data.message);
    };

    if (isLoading) {
        return <div className="text-white font-bold">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {!user?.email ? (
                <div className="text-white font-bold">Loading...</div>
            ) : (
                <>
                    {!verified ? (
                        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                            <h1 className="text-2xl font-bold mb-4">Phone Verification</h1>
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="bg-gray-700 text-white p-2 rounded-md w-full mb-4"
                            />
                            <button
                                onClick={handleSendOtp}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
                            >
                                Send OTP
                            </button>
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                className="bg-gray-700 text-white p-2 rounded-md w-full mb-4"
                            />
                            <button
                                onClick={handleVerifyOtp}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                            >
                                Verify OTP
                            </button>
                            <p className="mt-4">{message}</p>
                            <p className="mt-4">{user.email}</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <h1 className="text-2xl font-bold">Your phone number is already verified.</h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Verify;
