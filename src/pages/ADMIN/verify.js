import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../fb';  // Import Firebase initialization

const Verify = () => {
    const { user, isLoading } = useAuth0();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [verified, setVerified] = useState(true);
    const [verificationId, setVerificationId] = useState('');

    useEffect(() => {
        const checkVerify = async () => {
            if (user?.email) {
                const response = await fetch('http://localhost:3001/api/isverified', {
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
    }, [user?.email, message]);



    // const sendOtp = async()=>{
    //     try{

    //         const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
    //         const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
    //         console.log(confirmation);
    //     }catch(err){
    //         console.error(err);
    //     }
    // }

    // const handleVerifyOtp = ()=>{
    //     user.confirm(otp)
    // }

    //Function to set up reCAPTCHA
    const setUpRecaptcha = () => {
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                console.log("reCAPTCHA verified successfully!");
            },
            'expired-callback': () => {
                setMessage('reCAPTCHA expired. Try again.');
            }
        } );
    };

    const handleSendOtp = async () => {
        if (phoneNumber === '' || phoneNumber.length < 10) {
            setMessage('Invalid phone number.');
            return;
        }

        // Initialize reCAPTCHA
        setUpRecaptcha();
        
        const appVerifier = window.recaptchaVerifier;

        try {
            // Send OTP with reCAPTCHA
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmationResult.verificationId);
            setMessage('OTP sent! Please check your phone.');
        } catch (error) {
            console.error(error);
            setMessage('Failed to send OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setMessage('Please enter the OTP.');
            return;
        }

        try {
            const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
            await auth.signInWithCredential(credential);
            setMessage('Phone number verified successfully!');
            setVerified(true);
        } catch (error) {
            console.error(error);
            setMessage('Failed to verify OTP. Please try again.');
        }
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
                            <span className='text-red-300'>Verification required to book a slot</span>
                            <h1 className="text-2xl font-bold mb-4">Phone Verification</h1>
                            <input
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="bg-gray-700 text-white p-2 rounded-md w-full mb-4"
                            />
                            <div id="recaptcha-container" className="mb-4"></div> {/* reCAPTCHA container */}
                            <button
                                onClick={handleSendOtp}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full"
                            >
                                Send OTP
                            </button>
                            {/* <div id="recaptcha"></div> */}
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
